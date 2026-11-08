export type Lesson = {
  id: string;
  level: "beginner" | "intermediate" | "advanced";
  domain?: string;
  objective?: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string[];
  bodyEn: string[];
  quiz: { qAr: string; qEn: string; options: string[]; answer: number }[];
};

export type TroubleshootingScenario = {
  id: string;
  titleAr: string;
  titleEn: string;
  infoAr: string;
  infoEn: string;
  optionsAr: string[];
  optionsEn: string[];
  answer: number;
  explainAr: string;
  explainEn: string;
};
