
import React, { useState, useCallback, ChangeEvent } from 'react';
import { describeImage } from '../services/geminiService';
import { Card } from './common/Card';
import { Loader } from './common/Loader';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the header: 'data:image/png;base64,'
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

export const ImageRecognitionSection: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setDescription('');
        }
    };

    const handleDescribe = useCallback(async () => {
        if (!imageFile) {
            setDescription('Please select an image first.');
            return;
        }
        setIsLoading(true);
        setDescription('');
        try {
            const base64Data = await fileToBase64(imageFile);
            const result = await describeImage(base64Data, imageFile.type);
            setDescription(result);
        } catch (error) {
            setDescription('An error occurred while analyzing the image.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card>
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Image Analyzer</h2>
                <div className="space-y-4">
                    <div className="w-full h-64 bg-slate-900 border-2 border-dashed border-slate-600 rounded-md flex items-center justify-center overflow-hidden">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
                        ) : (
                            <span className="text-slate-500">Image preview</span>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
                    />
                    <button
                        onClick={handleDescribe}
                        disabled={isLoading || !imageFile}
                        className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? 'Analyzing...' : 'Describe Image'}
                    </button>
                </div>
            </Card>
            <Card className="min-h-[444px]">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Description</h3>
                <div className="bg-slate-900/50 p-4 rounded-md min-h-[350px] text-slate-300 whitespace-pre-wrap">
                    {isLoading ? <Loader /> : description || 'Image description will appear here...'}
                </div>
            </Card>
        </div>
    );
};
