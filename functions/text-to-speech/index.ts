import * as TextToSpeech from "@google-cloud/text-to-speech";

import * as fs from "fs";
import * as util from "util";

interface TextToSpeechParams {
  client: TextToSpeech.TextToSpeechClient;
  text: string;
}

export async function textToSpeech({
  client,
  text,
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
  await writeFile("output.mp3", response.audioContent, "binary");

  console.log("Audio content written to file: output.mp3");

  return {
    gcsUri: "example-gcs-uri",
  };
}
