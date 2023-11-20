#!/usr/bin/env zx

// Import $ from zx
import { $ } from "zx";
import { remark } from "remark";
import strip from "strip-markdown";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { SpeechClient } from "@google-cloud/speech";

import { textToSpeech } from "./functions/text-to-speech";
import { transcribeSpeech } from "./functions/transcribe-speech";
// import { CLIENT_URL } from "./constants";

const markdownFile = await $`cat ./content/my-post.md`;

const markdown = markdownFile.stdout.toString();

// const html = await $`echo ${markdown} | marked`;

async function markdownToPlainText(markdown: string) {
  const result = await remark().use(strip).process(markdown);
  return result.toString();
}

const text = await markdownToPlainText(markdown);

const { gcsUri } = await textToSpeech({
  text,
  client: new TextToSpeechClient(),
});

const { transcription } = await transcribeSpeech({
  client: new SpeechClient(),
  gcsUri,
});

// Render the DOM using puppeteer

// Record video using puppeteer-recorder

// And stitch audio / video with ffmpeg
