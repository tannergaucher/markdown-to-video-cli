import * as CloudSpeechEnum from "@google-cloud/speech";

import * as fs from "fs";
import * as util from "util";

import { TranscribeSpeech } from "../cli.js";

export async function transcribeSpeech({
  gcsUri,
  client,
  bucket,
  storage,
}: TranscribeSpeech) {
  const audio = {
    uri: gcsUri,
  };

  const config = {
    encoding:
      CloudSpeechEnum.protos.google.cloud.speech.v1.RecognitionConfig
        .AudioEncoding.MP3,
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);

  if (!response?.results) {
    throw new Error("No response");
  }

  const timestamp = gcsUri.split("/speech-")[1]?.split(".mp3")[0];

  const filename = `transcription-${timestamp}.json`;

  const writeFile = util.promisify(fs.writeFile);

  await writeFile(filename, JSON.stringify(response.results, null, 2));

  await storage
    .bucket(bucket)
    .upload(filename, {
      destination: filename,
    })
    .catch((err) => {
      console.log(err, "error uploading file");
    });

  return {
    transcriptionUri: `gs://${bucket}/${filename}`,
  };
}
