import * as CloudSpeech from "@google-cloud/speech";
import { google } from "@google-cloud/speech/build/protos/protos";

type TranscribeSpeech = {
  gcsUri: string;
  client: CloudSpeech.SpeechClient;
};

export async function transcribeSpeech({ gcsUri, client }: TranscribeSpeech) {
  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3,
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);

  if (!response.results) {
    throw new Error("No results");
  }

  return { transcription: response.results[0] };
}
