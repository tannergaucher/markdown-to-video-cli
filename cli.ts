#!/usr/bin/env zx

import { $ } from "zx";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { SpeechClient } from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { remark } from "remark";
import strip from "strip-markdown";

import { textToSpeech } from "./functions/text-to-speech.js";
import { transcribeSpeech } from "./functions/transcribe-speech.js";
import { recordVideo } from "./functions/record-video.js";
import { readMarkdownFromPrompt } from "./functions/read-markdown-from-prompt.js";
import { markdownToText } from "./functions/markdown-to-text.js";

import { CLIENT_URL } from "./constants.js";

export const BUCKET_NAME = `markdown-to-media`;

export interface MarkdownToText {
  markdown: string;
  strip: typeof strip;
  remark: typeof remark;
}

export interface TextToSpeech {
  client: TextToSpeechClient;
  storage: Storage;
  bucket: string;
  text: string;
}

export interface TranscribeSpeech {
  bucket: string;
  gcsUri: string;
  client: SpeechClient;
  storage: Storage;
}

export interface DetectImageText {
  bucketName: string;
  fileName: string;
  client: ImageAnnotatorClient;
}

export interface RecordVideo {
  pageUrl: string;
  transcriptionUri: string;
  storage: Storage;
  bucket: string;
}

// Step 1. Read the markdown file and convert to plain text
const markdown = await readMarkdownFromPrompt();

const html = await $`echo ${markdown} | marked`;

await $`echo ${html} > ./generated/index.html`;

console.log(html, "Html created from markdown");

const text = await markdownToText({
  markdown,
  remark,
  strip,
});

console.log(text, "Plain text created from markdown");

// Step 2. Convert the text to speech
const { speechGcsUri } = await textToSpeech({
  text,
  bucket: BUCKET_NAME,
  client: new TextToSpeechClient(),
  storage: new Storage(),
});

console.log("Speech created created from text at", speechGcsUri);

// Step 3. Transcribe the speech
const { transcriptionUri } = await transcribeSpeech({
  gcsUri: speechGcsUri,
  bucket: BUCKET_NAME,
  client: new SpeechClient(),
  storage: new Storage(),
});

console.log("Transcription created from speech at", transcriptionUri);

// Step 4. Record the video
const { videoFileName } = await recordVideo({
  transcriptionUri,
  pageUrl: CLIENT_URL,
  bucket: BUCKET_NAME,
  storage: new Storage(),
});

console.log(`Video created from transcription at ${videoFileName}`);
