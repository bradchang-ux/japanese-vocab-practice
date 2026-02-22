export interface VocabularyItem {
    id: number;
    japanese: string;
    reading: string;
    chinese: string;
    tags: string[];
}

export type N5Word = VocabularyItem;
export type N4Word = VocabularyItem;
