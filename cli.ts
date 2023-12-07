#!/usr/bin/env zx

import { $ } from "zx";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { SpeechClient } from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";
import { remark } from "remark";
import strip from "strip-markdown";

import { textToSpeech } from "./functions/text-to-speech.js";
import { transcribeSpeech } from "./functions/transcribe-speech.js";
import { recordVideo } from "./functions/record-video.js";
import { readMarkdownFromPrompt } from "./functions/read-markdown-from-prompt.js";
import { markdownToText } from "./functions/markdown-to-text.js";

import { CLIENT_URL } from "./constants.js";

export const BUCKET_NAME = `markdown-to-media`;

// Step 1. Read the markdown file and convert to text / html
const markdown = await readMarkdownFromPrompt();

const html = await $`echo ${markdown} | marked`;

await $`echo ${html} > ./generated/content.html`;

console.log(html, "Html created from markdown");

export interface MarkdownToText {
  markdown: string;
  strip: typeof strip;
  remark: typeof remark;
}

const text = await markdownToText({
  markdown,
  remark,
  strip,
});

console.log(text, "Plain text created from markdown");

// Step 2. Convert the text to a speech file and save to cloud storage
export interface TextToSpeech {
  client: TextToSpeechClient;
  storage: Storage;
  bucket: string;
  text: string;
}

const { speechGcsUri } = await textToSpeech({
  text,
  bucket: BUCKET_NAME,
  client: new TextToSpeechClient(),
  storage: new Storage(),
});

console.log("Speech created created from text at", speechGcsUri);

// Step 3. Transcribe the speech file and save to cloud storage

export interface TranscribeSpeech {
  bucket: string;
  gcsUri: string;
  client: SpeechClient;
  storage: Storage;
}
const { transcriptionUri } = await transcribeSpeech({
  gcsUri: speechGcsUri,
  bucket: BUCKET_NAME,
  client: new SpeechClient(),
  storage: new Storage(),
});

console.log("Transcription created from speech at", transcriptionUri);

// Step 4. Record the video. Start a chrome devtools protocol session. Screencast while manipulating the dom, and save mp4 to cloud storage

export interface RecordVideo {
  pageUrl: string;
  transcriptionUri: string;
  storage: Storage;
  bucket: string;
}

const { videoFileName } = await recordVideo({
  transcriptionUri,
  pageUrl: CLIENT_URL,
  bucket: BUCKET_NAME,
  storage: new Storage(),
});

console.log(`Video created from transcription at ${videoFileName}`);
