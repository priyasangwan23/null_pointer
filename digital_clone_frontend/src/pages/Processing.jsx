import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressStep from '../components/ProgressStep';

export default function Processing() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: "Reading Chat", description: "Parsing uploaded file formats..." },
        { title: "Extracting Messages", description: "Cleaning data and identifying participants..." },
        { title: "Analyzing Personality", description: "Calculating emoji usage and vocabulary..." },
        { title: "Building Communication Profile", description: "Creating tone guidelines from data..." },
        { title: "Preparing Digital Clone", description: "Finalizing AI setup..." }
    ];

    useEffect(() => {
        if (currentStep < steps.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 1500 + Math.random() * 1000); // 1.5 - 2.5s per step
            return () => clearTimeout(timer);
        } else {
            setTimeout(() => {
                navigate('/personality');
            }, 1000);
        }
    }, [currentStep, navigate, steps.length]);

    return (
        <div className="w-full max-w-2xl mx-auto py-12 px-6">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold font-heading text-heading mb-4">Processing AI Clone</h1>
                <p className="text-body max-w-lg mx-auto">
                    Please wait while our models analyze the chat history. This might take a few moments.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                {steps.map((step, index) => (
                    <ProgressStep
                        key={index}
                        title={step.title}
                        description={step.description}
                        isComplete={index < currentStep}
                        isActive={index === currentStep}
                        delay={index * 0.1}
                    />
                ))}
            </div>
        </div>
    );
}
