import * as CloudSpeech from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as util from "util";

import { BUCKET_NAME } from "../../cli.js";

type TranscribeSpeech = {
  gcsUri: string;
  client: CloudSpeech.SpeechClient;
  storage: Storage;
};

export async function transcribeSpeech({
  gcsUri,
  client,
  storage,
}: TranscribeSpeech) {
  const audio = {
    uri: gcsUri,
  };

  const config = {
    encoding:
      CloudSpeech.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
        .MP3,
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

  await writeFile(filename, response.results.toString());

  await storage
    .bucket(BUCKET_NAME)
    .upload(filename, {
      destination: filename,
    })
    .catch((err) => {
      console.log(err, "error uploading file");
    });

  return {
    transcriptionUri: `gs://${BUCKET_NAME}/${filename}`,
  };
}
