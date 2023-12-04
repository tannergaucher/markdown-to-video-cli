import puppeteer from "puppeteer";
import { Storage } from "@google-cloud/storage";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

import { BUCKET_NAME } from "../cli.js";

type RecordVideoParams = {
  pageUrl: string;
  transcriptionUri: string;
  storage: Storage;
};

export async function recordVideo({
  pageUrl,
  transcriptionUri,
  storage,
}: RecordVideoParams) {
  const fileName = transcriptionUri.split(`${BUCKET_NAME}/`)[1] ?? "";

  console.log(fileName, "filename");

  await storage.bucket(BUCKET_NAME).file(fileName).download({
    destination: fileName,
  });

  const videoFileName = fileName.replace(".json", ".mp4");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const frames: string[] = [];

  await page
    .target()
    .createCDPSession()
    .then(async (session) => {
      console.log("Session created", session);

      await page.goto(pageUrl);

      session.on("Page.screencastFrame", async (event) => {
        frames.push(event.data);

        session.send("Page.screencastFrameAck", {
          sessionId: event.sessionId,
        });
      });

      // Start the screencast
      await session.send("Page.startScreencast", {
        format: "jpeg",
        quality: 100,
        everyNthFrame: 1,
      });

      // For now just wait 5 seconds. Update to handle dynamic length
      await page.waitForTimeout(5000);

      await session.send("Page.stopScreencast");
      await browser.close();

      console.log(`Converting ${frames.length} frames to .mp4`);

      await convertBase64ToMP4(frames, videoFileName);
    });

  return {
    videoFileName,
  };
}

async function convertBase64ToMP4(
  base64Images: string[],
  outputFilePath: string
) {
  // Save each base64 image to a temporary JPEG file
  const imagePaths = await Promise.all(
    base64Images.map(async (base64Image, index) => {
      const imagePath = join(tmpdir(), `image${index}.jpeg`);
      const imageBuffer = Buffer.from(base64Image, "base64");
      await fs.writeFile(imagePath, imageBuffer);
      return imagePath;
    })
  );

  // Use FFmpeg to convert the JPEG files into an MP4 video
  const ffmpegProcess = ffmpeg()
    .input("concat:" + imagePaths.join("|"))
    .inputFormat("image2pipe")
    .videoCodec("libx264")
    .output(outputFilePath);

  await new Promise((resolve, reject) => {
    ffmpegProcess.on("end", resolve);
    ffmpegProcess.on("error", reject);
    ffmpegProcess.run();
  });

  // Delete the temporary JPEG files
  await Promise.all(imagePaths.map((imagePath) => fs.unlink(imagePath)));

  console.log(`MP4 file created successfully`);
}
