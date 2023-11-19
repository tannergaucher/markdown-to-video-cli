export type FourNobleTruths = {
  title: string;
  intro: string;
  dukkha: {
    title: string;
    text: string;
  };
  samudaya: {
    title: string;
    text: string;
  };
  noridha: {
    title: string;
    text: string;
  };
  magga: {
    title: string;
    text: string;
  };
  outro: string;
};

export const script: FourNobleTruths = {
  title: "The Four Noble Truths",
  intro:
    "The Four Noble Truths are foundational teachings in Buddhism that were first articulated by Siddhartha Gautama, who later became known as the Buddha. These truths form the core of Buddhist philosophy and practice. Here they are",
  dukkha: {
    title: "The Truth of Suffering - Dukkha",
    text: "Life is characterized by suffering, dissatisfaction, and unease. Suffering can take various forms, including physical and emotional pain, but also more subtle forms such as discontentment and dissatisfaction.",
  },
  samudaya: {
    title: "The Truth of the Cause of Suffering (Samudaya):",
    text: "The cause of suffering is craving (tanha) and attachment. It is the insatiable desire for pleasure, material possessions, and a continued existence. Craving leads to attachment, and attachment leads to suffering.",
  },
  noridha: {
    title: "The Truth of the End of Suffering (Nirodha):",
    text: "It is possible to end suffering by eliminating its root cause, which is craving and attachment. This state of freedom from suffering is called Nirvana. Nirvana is often described as a state of perfect peace, liberation, and the cessation of the cycle of birth and death (samsara).",
  },
  magga: {
    title: "The Truth of the Path to the End of Suffering (Magga):",
    text: "The path to the end of suffering is the Eightfold Path, which consists of right understanding, right intention, right speech, right action, right livelihood, right effort, right mindfulness, and right concentration. Following this path leads to the cessation of craving and the attainment of Nirvana",
  },
  outro:
    "These Four Noble Truths provide a framework for understanding the nature of human existence and offer guidance on how to overcome the inherent suffering in life.",
};
