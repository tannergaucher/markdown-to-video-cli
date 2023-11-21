import { transcription } from "./transcription.js";
import { FourNobleTruths, script } from "./script.js";

const audio = document.querySelector("audio");

if (!audio) {
  throw new Error("Audio source not found");
}

const transcriptionWords = transcription?.results[0]?.alternatives[0]?.words;

if (!transcriptionWords?.length) {
  throw new Error("No transcription words found");
}

let currentWordIndex = 0;

let interval: any;

renderMovie(script);

audio.addEventListener("play", () => {
  interval = setInterval(() => {
    const currentTime = audio.currentTime;
    const currentWord = transcriptionWords[currentWordIndex];

    if (!currentWord) return;

    if (currentTime >= parseInt(currentWord.startTime)) {
      highlightWord(currentWordIndex);
    }

    if (currentTime >= parseInt(currentWord.endTime)) {
      currentWordIndex++;
    }

    if (currentWordIndex >= transcriptionWords.length) {
      clearInterval(interval);
    }
  }, 50);

  function highlightWord(currentWordIndex: number) {
    const wordSpan = document.getElementById(
      `${currentWordIndex}`
    ) as HTMLSpanElement | null;

    if (!wordSpan) {
      return;
    }

    const previousWordSpan = document.getElementById(
      `${currentWordIndex - 1}`
    ) as HTMLSpanElement | null;

    if (previousWordSpan) {
      previousWordSpan.removeAttribute("current");
      previousWordSpan.setAttribute("spoken", "true");
    }

    wordSpan.setAttribute("current", "true");
    wordSpan.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }
});

audio.addEventListener("pause", () => {
  clearInterval(interval);
});

function renderMovie(script: FourNobleTruths) {
  const movie = document.querySelector(
    "#movie-container"
  ) as HTMLDivElement | null;

  if (!movie) {
    throw new Error("No movie element found");
  }

  function wrapWordsInSpans(text: string) {
    return text.split(" ").map((word) => {
      const span = document.createElement("span");
      span.id = `${currentWordIndex++}`;
      span.textContent = word;
      return span;
    });
  }

  function appendSpansToContainer(
    container: HTMLElement,
    spans: HTMLElement[]
  ) {
    spans.forEach((span) => {
      container.appendChild(span);
      container.appendChild(document.createTextNode(" ")); // Add space between words
    });
  }

  // Extract to function, handle arbitrary script
  const title = document.createElement("h1");
  title.textContent = script.title;
  movie.appendChild(title);

  const intro = document.createElement("p");
  appendSpansToContainer(intro, wrapWordsInSpans(script.intro));
  movie.appendChild(intro);

  const truths = document.createElement("ol");
  movie.appendChild(truths);

  const firstTruth = document.createElement("li");
  truths.appendChild(firstTruth);

  const firstTruthTitle = document.createElement("h2");
  appendSpansToContainer(
    firstTruthTitle,
    wrapWordsInSpans(script.dukkha.title)
  );
  firstTruth.appendChild(firstTruthTitle);

  const firstTruthText = document.createElement("p");
  appendSpansToContainer(firstTruthText, wrapWordsInSpans(script.dukkha.text));
  firstTruth.appendChild(firstTruthText);

  const secondTruth = document.createElement("li");
  truths.appendChild(secondTruth);

  const secondTruthTitle = document.createElement("h2");
  secondTruthTitle.textContent = script.samudaya.title;

  const secondTruthText = document.createElement("p");
  secondTruthText.textContent = script.samudaya.text;

  secondTruth.appendChild(secondTruthTitle);
  secondTruth.appendChild(secondTruthText);

  const thirdTruth = document.createElement("li");
  truths.appendChild(thirdTruth);

  const thirdTruthTitle = document.createElement("h2");
  appendSpansToContainer(
    thirdTruthTitle,
    wrapWordsInSpans(script.noridha.title)
  );
  thirdTruth.appendChild(thirdTruthTitle);

  const thirdTruthText = document.createElement("p");
  appendSpansToContainer(thirdTruthText, wrapWordsInSpans(script.noridha.text));
  thirdTruth.appendChild(thirdTruthText);

  const fourthTruth = document.createElement("li");
  truths.appendChild(fourthTruth);

  const fourthTruthTitle = document.createElement("h2");
  appendSpansToContainer(
    fourthTruthTitle,
    wrapWordsInSpans(script.magga.title)
  );

  const fourthTruthText = document.createElement("p");
  appendSpansToContainer(fourthTruthText, wrapWordsInSpans(script.magga.text));

  fourthTruth.appendChild(fourthTruthTitle);

  const outro = document.createElement("p");
  appendSpansToContainer(outro, wrapWordsInSpans(script.outro));

  movie.appendChild(outro);
}
