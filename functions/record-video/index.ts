import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

export async function recordVideo(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector("#audio-script");

  await page.evaluate(async () => {
    const audio = document.getElementById("audio-script") as HTMLAudioElement;

    audio.play();

    const session = await page.target().createCDPSession();

    const frames: string[] = [];

    session.on("Page.screencastFrame", async (event) => {
      frames.push(event.data);
      event.data;
    });

    await session.send("Page.startScreencast", {
      format: "png",
      quality: 100,
    });

    // Do DOM manipulation here

    await session.send("Page.stopScreencast");

    await browser.close();

    await convertBase64ToMP4(frames, url);
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
