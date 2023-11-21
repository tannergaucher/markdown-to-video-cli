import * as TextToSpeech from "@google-cloud/text-to-speech";
import { Storage } from "@google-cloud/storage";

import * as fs from "fs";
import * as util from "util";

import { BUCKET_NAME } from "../../cli.js";

interface TextToSpeechParams {
  client: TextToSpeech.TextToSpeechClient;
  storage: Storage;
  text: string;
}

export async function textToSpeech({
  text,
  client,
  storage,
}: TextToSpeechParams): Promise<{
  gcsUri: string;
}> {
  const request = {
    input: { text },
    voice: {
      languageCode: "en-US",
      ssmlGender:
        TextToSpeech.protos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE,
    },
    audioConfig: {
      audioEncoding:
        TextToSpeech.protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
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
    .bucket(BUCKET_NAME)
    .upload(filename, {
      destination: filename,
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(`${filename} uploaded to ${BUCKET_NAME}.`);

  return {
    gcsUri: `gs://${BUCKET_NAME}/${filename}`,
  };
}
