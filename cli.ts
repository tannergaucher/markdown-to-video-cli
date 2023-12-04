#!/usr/bin/env zx

import { $ } from "zx";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { SpeechClient } from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";

import { textToSpeech } from "./functions/text-to-speech.js";
import { transcribeSpeech } from "./functions/transcribe-speech.js";
import { recordVideo } from "./functions/record-video.js";
import { readMarkdownFromPrompt } from "./functions/read-markdown-from-prompt.js";
import { markdownToText } from "./functions/markdown-to-text.js";

import { CLIENT_URL } from "./constants.js";

export const BUCKET_NAME = `markdown-to-media`;

// Step 1. Read the markdown file and convert to plain text, create html from markdown and to file
const markdown = await readMarkdownFromPrompt();

const html = await $`echo ${markdown} | marked`;

await $`echo ${html} > ./generated/index.html`;

console.log(html, "Html created from markdown");

const text = await markdownToText(markdown);

console.log(text, "Plain text created from markdown");

// Step 2. Convert the text to speech
const { gcsUri } = await textToSpeech({
  text,
  client: new TextToSpeechClient(),
  storage: new Storage(),
});

console.log("Speech created created from text at", gcsUri);

// Step 3. Transcribe the speech
const { transcriptionUri } = await transcribeSpeech({
  gcsUri,
  client: new SpeechClient(),
  storage: new Storage(),
});

console.log("Transcription created from speech at", transcriptionUri);

// Step 4. Record the video
const { videoFileName } = await recordVideo({
  transcriptionUri,
  pageUrl: CLIENT_URL,
  storage: new Storage(),
});

console.log(`Video created from transcription at ${videoFileName}`);
