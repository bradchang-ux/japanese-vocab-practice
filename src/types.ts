export interface VocabularyItem {
    id: number;
    japanese: string;
    reading: string;
    chinese: string;
    pos: string;
    category: string;
    level: string;
}

export type N5Word = VocabularyItem;
export type N4Word = VocabularyItem;
