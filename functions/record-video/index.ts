import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

export async function recordVideo(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
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

    await convertBase64ToMP4(frames, url);
  });

  await page.evaluate(async () => {
    audio.play();

    await session.send("Page.startScreencast", {
      format: "png",
      quality: 100,
    });

    session.on("Page.screencastFrame", async (event) => {
      frames.push(event.data);
    });
  });
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
