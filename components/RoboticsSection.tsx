
import React, { useState, useCallback } from 'react';
import { parseRoboticsCommand } from '../services/geminiService';
import { Card } from './common/Card';
import { Loader } from './common/Loader';

const RobotWorkspace: React.FC = () => (
    <div className="relative w-full aspect-video bg-slate-700/50 rounded-lg p-4 border border-slate-600 flex items-center justify-around">
        <div className="absolute top-2 left-2 text-xs text-slate-400">Simulation Area</div>
        {/* Red Cube */}
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-500 shadow-lg" style={{transform: 'rotateX(-20deg) rotateY(30deg)'}}></div>
            <p className="text-xs mt-2 text-slate-300">Red Cube</p>
        </div>
        {/* Green Sphere */}
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-500 rounded-full shadow-lg"></div>
            <p className="text-xs mt-2 text-slate-300">Green Sphere</p>
        </div>
        {/* Blue Cylinder */}
        <div className="flex flex-col items-center">
             <div className="w-12 h-16 bg-blue-500 rounded-t-full rounded-b-full shadow-lg" style={{ transform: 'perspective(100px) rotateX(-10deg)'}}></div>
            <p className="text-xs mt-2 text-slate-300">Blue Cylinder</p>
        </div>
    </div>
);


export const RoboticsSection: React.FC = () => {
    const [command, setCommand] = useState<string>('');
    const [actions, setActions] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleParseCommand = useCallback(async () => {
        if (!command.trim()) {
            setActions(JSON.stringify([{ action: "INFO", target: "Please enter a command.", destination: null }], null, 2));
            return;
        }
        setIsLoading(true);
        setActions('');
        try {
            const result = await parseRoboticsCommand(command);
            setActions(result);
        } catch (error) {
            setActions(JSON.stringify([{ action: "ERROR", target: "An unexpected error occurred.", destination: null }], null, 2));
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [command]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card>
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Robotics Command Parser</h2>
                <div className="space-y-4">
                   <RobotWorkspace />
                   <div>
                       <label htmlFor="command-input" className="block text-sm font-medium text-slate-400 mb-2">Enter Command</label>
                       <div className="flex space-x-2">
                            <input
                                id="command-input"
                                type="text"
                                className="flex-grow p-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors duration-200 text-slate-200"
                                placeholder="e.g., Pick up the red cube and place it on the green sphere"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleParseCommand()}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleParseCommand}
                                disabled={isLoading || !command}
                                className="bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Parse
                            </button>
                       </div>
                   </div>
                </div>
            </Card>
            <Card className="min-h-[400px]">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Parsed Action Plan (JSON)</h3>
                <div className="bg-slate-900/50 p-4 rounded-md min-h-[300px] text-slate-300 font-mono text-sm">
                    {isLoading ? <Loader /> : (
                        <pre><code>{actions || 'Parsed actions will appear here...'}</code></pre>
                    )}
                </div>
            </Card>
        </div>
    );
};
