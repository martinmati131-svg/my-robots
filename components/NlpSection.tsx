import React, { useState, useCallback } from 'react';
import { analyzeText } from '../services/geminiService';
import { Card } from './common/Card';
import { Loader } from './common/Loader';
import { NlpTask } from '../types';

// Helper to strip HTML for task switching or validation
const stripHtml = (html: string): string => {
    try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    } catch (e) {
        console.error("Error stripping HTML", e);
        return html; // fallback
    }
};

// A simple toolbar component for the editor
const EditorToolbar: React.FC<{ disabled: boolean }> = ({ disabled }) => {
    const handleFormat = (command: string) => {
        if (disabled) return;
        // Keep focus on the editor after command execution
        document.execCommand(command, false);
    };

    return (
        <div className="bg-slate-700 p-1.5 rounded-t-md flex items-center space-x-2 border-b border-slate-600">
            <button
                type="button"
                onClick={() => handleFormat('bold')}
                className="w-8 h-8 flex items-center justify-center font-bold text-slate-200 hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Bold (Ctrl+B)"
                disabled={disabled}
            >
                B
            </button>
            <button
                type="button"
                onClick={() => handleFormat('italic')}
                className="w-8 h-8 flex items-center justify-center italic font-serif text-lg text-slate-200 hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Italic (Ctrl+I)"
                disabled={disabled}
            >
                I
            </button>
        </div>
    );
};


export const NlpSection: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [task, setTask] = useState<NlpTask>(NlpTask.SUMMARIZE);
    const [targetLanguage, setTargetLanguage] = useState<string>('Spanish');
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const handleTaskChange = (newTaskId: NlpTask) => {
        if (task === NlpTask.GENERATE && newTaskId !== NlpTask.GENERATE) {
            setInputText(stripHtml(inputText));
        }
        setTask(newTaskId);
    };

    const handleAnalyze = useCallback(async () => {
        if (!stripHtml(inputText).trim()) {
            setResult('Please enter some text to analyze.');
            return;
        }
        setIsLoading(true);
        setResult('');
        try {
            const analysisResult = await analyzeText(inputText, task, targetLanguage);
            setResult(analysisResult);
        } catch (error) {
            if (error instanceof Error) {
                setResult(`Analysis Failed: ${error.message}`);
            } else {
                 setResult('An unexpected error occurred while analyzing the text.');
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [inputText, task, targetLanguage]);
    
    const generationExamples = [
        { title: 'Write a story', prompt: 'Write a short story about a robot who discovers music.' },
        { title: 'Draft an email', prompt: 'Draft a professional email to a client asking for feedback on a recent project delivery.' },
        { title: 'Create a poem', prompt: 'Compose a short poem about the city at night.' },
        { title: 'Explain a concept', prompt: 'Explain the concept of photosynthesis in simple terms, as if to a 10-year-old.' },
    ];

    const handleExampleClick = (prompt: string) => {
        setInputText(prompt);
    };

    const taskOptions = [
        { id: NlpTask.SUMMARIZE, label: 'Summarize', tooltip: 'Condenses the input text into a concise summary.' },
        { id: NlpTask.SENTIMENT, label: 'Sentiment Analysis', tooltip: "Determines if the text's sentiment is positive, negative, or neutral." },
        { id: NlpTask.KEYWORDS, label: 'Extract Keywords', tooltip: 'Pulls out the most important keywords from the text.' },
        { id: NlpTask.TRANSLATE, label: 'Translate', tooltip: 'Translates the text to a selected language.' },
        { id: NlpTask.NER, label: 'Recognize Entities', tooltip: 'Identifies named entities like people, places, and organizations.' },
        { id: NlpTask.GENERATE, label: 'Generate Text', tooltip: 'Generates text based on your prompt or instruction.' },
    ];

    const languageOptions = ['Spanish', 'French', 'German', 'Italian', 'Japanese'];

    const getButtonText = () => {
        if (isLoading) {
            return task === NlpTask.GENERATE ? 'Generating...' : 'Analyzing...';
        }
        return task === NlpTask.GENERATE ? 'Generate Text' : 'Analyze Text';
    };

    const getPlaceholderText = () => {
        if (task === NlpTask.GENERATE) {
            return 'Enter a prompt for the generator, or try an example below...';
        }
        return 'Enter text here...';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card>
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Text Analyzer & Generator</h2>
                <div className="space-y-4">
                     {task === NlpTask.GENERATE ? (
                        <div>
                            <div className="relative">
                                <EditorToolbar disabled={isLoading} />
                                <style>{`
                                    .rich-text-editor:empty:before {
                                        content: attr(data-placeholder);
                                        color: #64748b; /* Tailwind slate-500 */
                                        pointer-events: none;
                                        position: absolute;
                                    }
                                `}</style>
                                <div
                                    className="rich-text-editor w-full h-48 p-3 bg-slate-900 border border-slate-600 rounded-b-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors duration-200 text-slate-200 overflow-y-auto resize-y"
                                    data-placeholder={getPlaceholderText()}
                                    contentEditable={!isLoading}
                                    onInput={(e) => setInputText(e.currentTarget.innerHTML)}
                                    dangerouslySetInnerHTML={{ __html: inputText }}
                                />
                            </div>
                             <div className="mt-3">
                                <h4 className="text-sm font-medium text-slate-400 mb-2">Try an example:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {generationExamples.map((example, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleExampleClick(example.prompt)}
                                            className="bg-slate-700 text-slate-300 hover:bg-slate-600 text-xs px-3 py-1 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isLoading}
                                            title={`Prompt: "${example.prompt}"`}
                                        >
                                            {example.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <textarea
                            className="w-full h-48 p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors duration-200 text-slate-200 resize-none"
                            placeholder={getPlaceholderText()}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={isLoading}
                        />
                    )}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-400">Select Task</label>
                        <div className="flex flex-wrap gap-3">
                            {taskOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => handleTaskChange(option.id)}
                                    className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${task === option.id ? 'bg-cyan-600 text-white font-semibold' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                                    title={option.tooltip}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {task === NlpTask.TRANSLATE && (
                        <div className="space-y-2">
                            <label htmlFor="language-select" className="block text-sm font-medium text-slate-400">Select Target Language</label>
                            <select
                                id="language-select"
                                title="Choose the language to translate the text into."
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                                className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors duration-200 text-slate-200"
                                disabled={isLoading}
                            >
                                {languageOptions.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                    )}
                     <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !stripHtml(inputText).trim()}
                        className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                    >
                       {getButtonText()}
                    </button>
                </div>
            </Card>
            <Card className="min-h-[380px]">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Result</h3>
                <div className="bg-slate-900/50 p-4 rounded-md min-h-[280px] text-slate-300 whitespace-pre-wrap">
                    {isLoading ? <Loader /> : result || 'Analysis results will appear here...'}
                </div>
            </Card>
        </div>
    );
};