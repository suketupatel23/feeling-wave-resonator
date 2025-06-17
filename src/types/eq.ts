
export interface EQQuestion {
  q: string;
  domain: string;
  reverse: boolean;
}

export interface EQOption {
  label: string;
  value: number;
}

export type EQAnswers = Record<number, number>;

export interface EQScores {
  [domain: string]: number;
}

export interface EQInsights {
  [domain: string]: string[];
}
