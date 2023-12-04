// // import { transcription } from "./transcription.js";
// const audio = document.querySelector("audio");

// if (!audio) {
//   throw new Error("Audio source not found");
// }

// // const transcriptionWords = transcription?.results[0]?.alternatives[0]?.words;

// // if (!transcriptionWords?.length) {
// //   throw new Error("No transcription words found");
// // }

// let currentWordIndex = 0;

// let interval: any;

// renderMovie(script);

// audio.addEventListener("play", () => {
//   interval = setInterval(() => {
//     const currentTime = audio.currentTime;
//     const currentWord = transcriptionWords[currentWordIndex];

//     if (!currentWord) return;

//     if (currentTime >= parseInt(currentWord.startTime)) {
//       highlightWord(currentWordIndex);
//     }

//     if (currentTime >= parseInt(currentWord.endTime)) {
//       currentWordIndex++;
//     }

//     if (currentWordIndex >= transcriptionWords.length) {
//       clearInterval(interval);
//     }
//   }, 50);

//   function highlightWord(currentWordIndex: number) {
//     const wordSpan = document.getElementById(
//       `${currentWordIndex}`
//     ) as HTMLSpanElement | null;

//     if (!wordSpan) {
//       return;
//     }

//     const previousWordSpan = document.getElementById(
//       `${currentWordIndex - 1}`
//     ) as HTMLSpanElement | null;

//     if (previousWordSpan) {
//       previousWordSpan.removeAttribute("current");
//       previousWordSpan.setAttribute("spoken", "true");
//     }

//     wordSpan.setAttribute("current", "true");
//     wordSpan.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//       inline: "center",
//     });
//   }
// });

// audio.addEventListener("pause", () => {
//   clearInterval(interval);
// });

// interface Script {
//   title: string;
//   one: string;
//   two: string;
//   three: string;
//   four?: string;
//   five?: string;
//   fileScript: string;
// }

// function renderMovie(script: Script) {
//   const movie = document.querySelector(
//     "#movie-container"
//   ) as HTMLDivElement | null;

//   if (!movie) {
//     throw new Error("No movie element found");
//   }

//   function wrapWordsInSpans(text: string) {
//     return text.split(" ").map((word) => {
//       const span = document.createElement("span");
//       span.id = `${currentWordIndex++}`;
//       span.textContent = word;
//       return span;
//     });
//   }

//   function appendSpansToContainer(
//     container: HTMLElement,
//     spans: HTMLElement[]
//   ) {
//     spans.forEach((span) => {
//       container.appendChild(span);
//       container.appendChild(document.createTextNode(" ")); // Add space between words
//     });
//   }

//   // create elements for script frontmatter
//   const title = document.createElement("h1");
//   title.textContent = script.title;
//   const one = document.createElement("p");
//   one.textContent = script.one;
//   const two = document.createElement("p");
//   two.textContent = script.two;
//   const three = document.createElement("p");
//   three.textContent = script.three;
//   const four = document.createElement("p");

//   four.textContent = script.four;
//   const five = document.createElement("p");
//   five?.textContent = script.five;

//   // append script frontmatter to movie container
//   movie.appendChild(title);
//   movie.appendChild(one);
//   movie.appendChild(two);
//   movie.appendChild(three);
//   movie.appendChild(four);
//   movie.appendChild(five);
// }
