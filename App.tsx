
import React, { useState, useCallback } from 'react';
import { NlpSection } from './components/NlpSection';
import { ImageRecognitionSection } from './components/ImageRecognitionSection';
import { RoboticsSection } from './components/RoboticsSection';
import type { ActiveTab } from './types';
import { Tab } from './types';

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>(Tab.NLP);

    const renderContent = useCallback(() => {
        switch (activeTab) {
            case Tab.NLP:
                return <NlpSection />;
            case Tab.VISION:
                return <ImageRecognitionSection />;
            case Tab.ROBOTICS:
                return <RoboticsSection />;
            default:
                return null;
        }
    }, [activeTab]);

    const getTabClass = (tab: ActiveTab) => {
        return activeTab === tab
            ? 'bg-slate-700 text-cyan-400 border-b-2 border-cyan-400'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white';
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-2">
                           <svg className="h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v-1.5m0 18v-1.5M15.75 21v-1.5m-6-1.5H12m6.364-11.636 1.06-1.06M6.343 17.657l-1.06 1.06M17.657 6.343l1.06 1.06M6.343 6.343l-1.06-1.06" />
                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5Z" />
                           </svg>

                            <h1 className="text-2xl font-bold text-slate-100">AI Playground</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-8">
                    <div className="border-b border-slate-700">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            <button onClick={() => setActiveTab(Tab.NLP)} className={`flex items-center py-4 px-3 font-medium text-sm transition-colors duration-200 ${getTabClass(Tab.NLP)}`}>
                                <BrainIcon /> Natural Language
                            </button>
                            <button onClick={() => setActiveTab(Tab.VISION)} className={`flex items-center py-4 px-3 font-medium text-sm transition-colors duration-200 ${getTabClass(Tab.VISION)}`}>
                                <EyeIcon /> Image Recognition
                            </button>
                            <button onClick={() => setActiveTab(Tab.ROBOTICS)} className={`flex items-center py-4 px-3 font-medium text-sm transition-colors duration-200 ${getTabClass(Tab.ROBOTICS)}`}>
                                <CogIcon /> Robotics Command
                            </button>
                        </nav>
                    </div>
                </div>
                <div>{renderContent()}</div>
            </main>
        </div>
    );
};

export default App;
