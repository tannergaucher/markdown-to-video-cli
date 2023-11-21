#!/usr/bin/env zx

// Import $ from zx
import { $ } from "zx";
import { remark } from "remark";
import strip from "strip-markdown";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { SpeechClient } from "@google-cloud/speech";

import { textToSpeech } from "./functions/text-to-speech/index.js";
import { transcribeSpeech } from "./functions/transcribe-speech/index.js";
import { recordVideo } from "./functions/record-video/index.js";

import { CLIENT_URL } from "./constants.js";

const markdownFile = await $`cat ./content/my-post.md`;

const markdown = markdownFile.stdout.toString();

const html = await $`echo ${markdown} | marked`;

console.log(html);

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

const { videoUrl } = await recordVideo({
  pageUrl: CLIENT_URL,
  transcription,
});

console.log("video created at", videoUrl);
