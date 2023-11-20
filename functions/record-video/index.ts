import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";
import { google } from "@google-cloud/speech/build/protos/protos";

type RecordVideoParams = {
  pageUrl: string;
  transcription: google.cloud.speech.v1.ISpeechRecognitionResult;
};

export async function recordVideo({
  pageUrl,
  transcription,
}: RecordVideoParams) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl);
  const audio = (await page.waitForSelector(
    "#audio-script"
  )) as HTMLAudioElement | null;

  if (!audio) {
    throw new Error("Audio not found");
  }

  const session = await page.target().createCDPSession();

  const frames: string[] = [];

  audio.addEventListener("ended", async () => {
    await session.send("Page.stopScreencast");
    await browser.close();

    await convertBase64ToMP4(frames, pageUrl);
  });

  await page.evaluate(async () => {
    audio.play();

    await session.send("Page.startScreencast", {
      format: "png",
      quality: 100,
    });

    console.log("Recording started");
    console.log(transcription, "transcription");

    session.on("Page.screencastFrame", async (event) => {
      frames.push(event.data);
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
