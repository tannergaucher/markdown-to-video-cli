import * as TextToSpeechEnum from "@google-cloud/text-to-speech";

import * as fs from "fs";
import * as util from "util";

import { type TextToSpeech } from "../cli.js";

export async function textToSpeech({
  bucket,
  text,
  client,
  storage,
}: TextToSpeech) {
  const request = {
    input: { text },
    voice: {
      languageCode: "en-US",
      ssmlGender:
        TextToSpeechEnum.protos.google.cloud.texttospeech.v1.SsmlVoiceGender
          .MALE,
    },
    audioConfig: {
      audioEncoding:
        TextToSpeechEnum.protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
    },
  };

  const [response] = await client.synthesizeSpeech(request);

  if (!response.audioContent) {
    throw new Error("No audio content");
  }

  const writeFile = util.promisify(fs.writeFile);

  const timestamp = new Date().getTime();
  const filename = `speech-${timestamp}.mp3`;

  await writeFile(filename, response.audioContent, "binary");

  await storage
    .bucket(bucket)
    .upload(filename, {
      destination: filename,
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(`${filename} uploaded to ${bucket}.`);

  return {
    speechGcsUri: `gs://${bucket}/${filename}`,
  };
}
