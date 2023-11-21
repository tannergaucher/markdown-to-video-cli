#!/usr/bin/env zx

import { $ } from "zx";
import { remark } from "remark";
import strip from "strip-markdown";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { SpeechClient } from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";

import { textToSpeech } from "./functions/text-to-speech/index.js";
import { transcribeSpeech } from "./functions/transcribe-speech/index.js";
import { recordVideo } from "./functions/record-video/index.js";

import { CLIENT_URL } from "./constants.js";

export const BUCKET_NAME = `text-to-speech-responses`;

// const markdownFile = await $`cat ./posts/11-20-23.md`;

// const markdown = markdownFile.stdout.toString();

// const html = await $`echo ${markdown} | marked`;

// console.log(html, "html created");

// async function markdownToPlainText(markdown: string) {
//   const result = await remark().use(strip).process(markdown);
//   return result.toString();
// }

// const text = await markdownToPlainText(markdown);

// console.log(text, "text created");

// const { gcsUri } = await textToSpeech({
//   text,
//   client: new TextToSpeechClient(),
//   storage: new Storage(),
// });

// console.log("speech file created at", gcsUri);

// const { transcriptionUri } = await transcribeSpeech({
//   gcsUri,
//   client: new SpeechClient(),
//   storage: new Storage(),
// });

// console.log("transcription created at", transcriptionUri);

const { videoFileName } = await recordVideo({
  pageUrl: CLIENT_URL,
  transcriptionUri: `gs://text-to-speech-responses/transcription-1700597336059.json`,
  storage: new Storage(),
});

console.log(`video created at ${videoFileName}`);
