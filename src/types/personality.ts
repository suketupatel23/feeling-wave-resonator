
export interface PersonalityQuestion {
  q: string;
  trait: string;
  reverse: boolean;
}

export interface PersonalityOption {
  label: string;
  value: number;
}

export type Answers = Record<number, number>;

export interface PersonalityScores {
  [trait: string]: number;
}
