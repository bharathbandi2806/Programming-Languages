export type LanguageCategory = 'Systems' | 'Web' | 'Mobile' | 'AI' | 'Data Science' | 'Game Dev';

export interface Language {
  id: string;
  name: string;
  year: number;
  creator: string;
  category: LanguageCategory[];
  description: string;
  strength: string[];
  weakness: string[];
  helloWorld: string;
  paradigms: string[];
  rating: {
    learningCurve: number; // 1-5
    performance: number;   // 1-5
    ecosystem: number;     // 1-5
  };
}

export interface ComparisonState {
  isComparing: boolean;
  selectedIds: string[];
}
