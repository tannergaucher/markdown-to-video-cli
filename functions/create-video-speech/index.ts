// Imports the Google Cloud client library
import * as textToSpeech from "@google-cloud/text-to-speech";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";

// Import other required libraries
import * as fs from "fs";
import * as util from "util";

// Create a client
// const client = new textToSpeech.TextToSpeechClient();

interface CreateVideoSpeechParams {
  client: textToSpeech.TextToSpeechClient;
  textFilePath: string;
}

export async function createVideoSpeech({
  client,
  textFilePath,
}: CreateVideoSpeechParams): Promise<{
  gcsUri: string;
}> {
  const text = fs.readFileSync(textFilePath, "utf8");

  const request = {
    input: { text },
    voice: {
      languageCode: "en-US",
      ssmlGender: google.cloud.texttospeech.v1.SsmlVoiceGender.MALE,
    },
    audioConfig: {
      audioEncoding: google.cloud.texttospeech.v1.AudioEncoding.MP3,
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
