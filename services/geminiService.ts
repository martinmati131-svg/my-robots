import { GoogleGenAI, Type } from "@google/genai";
import { NlpTask } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptForNlpTask = (task: NlpTask, text: string, targetLanguage?: string): string => {
    switch (task) {
        case NlpTask.SUMMARIZE:
            return `Summarize the following text concisely in 1-3 sentences:\n\n"${text}"`;
        case NlpTask.SENTIMENT:
            return `Analyze the sentiment of the following text. Respond with only one word: POSITIVE, NEGATIVE, or NEUTRAL.\n\nText: "${text}"`;
        case NlpTask.KEYWORDS:
            return `Extract the main keywords from the following text. Return them as a comma-separated list.\n\nText: "${text}"`;
        case NlpTask.TRANSLATE:
            return `Translate the following text to ${targetLanguage || 'Spanish'}:\n\n"${text}"`;
        case NlpTask.NER:
            return `Extract named entities (like people, organizations, locations, dates) from the following text. List each entity and its type.\n\nText: "${text}"`;
        case NlpTask.GENERATE:
            return `You are a creative assistant. Please continue the following text or fulfill the instruction given:\n\n"${text}"`;
        default:
            throw new Error('Unknown NLP task');
    }
};

export const analyzeText = async (text: string, task: NlpTask, targetLanguage?: string): Promise<string> => {
    try {
        const prompt = getPromptForNlpTask(task, text, targetLanguage);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const resultText = response.text?.trim();
        if (!resultText) {
            throw new Error("The model returned an empty response. This may be due to the prompt, or the content violating safety policies.");
        }
        return resultText;

    } catch (error) {
        console.error("Error in analyzeText:", error);
        if (error instanceof Error) {
            // Propagate the original error which might have specific details.
            throw error;
        }
        // Fallback for non-standard errors
        throw new Error("An unexpected issue occurred while contacting the AI service.");
    }
};


export const describeImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
            },
        };
        const textPart = {
            text: "Describe this image in detail. What objects are present, what is happening, and what is the overall mood or style of the image?"
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error in describeImage:", error);
        return "Sorry, I couldn't analyze that image. Please try another one.";
    }
};

export const parseRoboticsCommand = async (command: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse this command: "${command}"`,
            config: {
                systemInstruction: `You are a robotics control system. Your task is to translate natural language commands into a structured list of actions. The available objects are: 'red cube', 'green sphere', 'blue cylinder'. The only actions are 'PICK' and 'PLACE'. If a command cannot be parsed, use the 'UNKNOWN' action and describe the issue in the target field.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            action: {
                                type: Type.STRING,
                                description: 'The action to perform: "PICK", "PLACE", or "UNKNOWN".',
                            },
                            target: {
                                type: Type.STRING,
                                description: 'The object to interact with (e.g., "red cube").',
                            },
                            destination: {
                                type: Type.STRING,
                                description: 'The destination for the PLACE action (e.g., "blue cylinder"). Can be null for PICK actions.',
                            },
                        },
                        required: ["action", "target"]
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        // The response should be a JSON string, let's pretty-print it for display
        return JSON.stringify(JSON.parse(jsonStr), null, 2);

    } catch (error) {
        console.error("Error parsing robotics command:", error);
        return JSON.stringify([{ action: "ERROR", target: "Failed to parse command due to an API error.", destination: null }], null, 2);
    }
};