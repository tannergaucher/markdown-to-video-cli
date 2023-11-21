import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";
import { Storage } from "@google-cloud/storage";

import { BUCKET_NAME } from "../../cli.js";

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
  const fileName = transcriptionUri.split("text-to-speech-responses/")[1] ?? "";

  await storage.bucket(BUCKET_NAME).file(fileName).download();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl);

  const audio = await page.waitForSelector("#audio-script");

  if (!audio) {
    throw new Error("Audio not found");
  }

  console.log(page);

  const session = await page.target().createCDPSession();

  const frames: string[] = [];

  const audioHandle = await page.waitForSelector("#audio-script");

  if (!audioHandle) {
    throw new Error("Audio not found");
  }

  await audioHandle.evaluate(async (audioElement: Element) => {
    const audio = audioElement as HTMLAudioElement;
    audio.play();

    await session.send("Page.startScreencast", {
      format: "png",
      quality: 100,
    });

    console.log("Recording started");
    console.log("Do things with the transcription / DOM here");

    session.on("Page.screencastFrame", async (event) => {
      frames.push(event.data);
    });

    audio.addEventListener("ended", async () => {
      await session.send("Page.stopScreencast");
      await browser.close();
      await convertBase64ToMP4(frames, pageUrl);
    });
  });

  return {
    videoUrl: pageUrl,
  };
}

async function convertBase64ToMP4(
  base64Images: string[],
  outputFilePath: string
) {
  const imageBuffer = Buffer.from(base64Images.join(""), "base64");

  const readableImageStream = new Readable();
  readableImageStream.push(imageBuffer);
  readableImageStream.push(null);

  const ffmpegProcess = ffmpeg()
    .input(readableImageStream)
    .format("mp4")
    .output(outputFilePath);

  await new Promise((resolve, reject) => {
    ffmpegProcess.on("end", resolve);
    ffmpegProcess.on("error", reject);
    ffmpegProcess.run();
  });

  console.log(`MP4 file created successfully`);
}
