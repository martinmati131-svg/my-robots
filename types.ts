export enum Tab {
    NLP = 'nlp',
    VISION = 'vision',
    ROBOTICS = 'robotics',
}

export type ActiveTab = Tab;

export enum NlpTask {
    SUMMARIZE = 'summarize',
    SENTIMENT = 'sentiment',
    KEYWORDS = 'keywords',
    TRANSLATE = 'translate',
    NER = 'ner',
    GENERATE = 'generate',
}

export interface RobotAction {
    action: 'PICK' | 'PLACE' | 'UNKNOWN';
    target: string;
    destination: string | null;
}