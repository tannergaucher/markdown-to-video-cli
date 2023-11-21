import * as CloudSpeech from "@google-cloud/speech";

type TranscribeSpeech = {
  gcsUri: string;
  client: CloudSpeech.SpeechClient;
};

export async function transcribeSpeech({ gcsUri, client }: TranscribeSpeech) {
  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding:
      CloudSpeech.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
        .LINEAR16,
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);

  if (response?.results?.[0]) {
    return { transcription: response.results[0] };
  }

  throw new Error("No response");
}
