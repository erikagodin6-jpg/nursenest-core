export type CardType = "question" | "term";

export type Flashcard = {
  id: string;
  type: CardType;
  question: string;
  options?: string[];
  correctIndex?: number;
  answer: string;
  category: string;
  image?: string;
  detailedRationale?: string;
  optionRationales?: string[];
  clinicalPearl?: string;
};
