import { useState } from 'react';
import { UploadCloud, File, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadCard({ onUpload }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (file && onUpload) {
            onUpload(file);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
            <div
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    } ${file ? 'border-success/50 bg-success/5' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".json,.txt,.csv"
                    className="hidden"
                    id="file-upload"
                    onChange={handleChange}
                />

                {file ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success mb-2">
                            <CheckCircle2 size={32} />
                        </div>
                        <p className="font-heading font-medium text-heading text-lg">{file.name}</p>
                        <p className="text-body text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button
                            onClick={() => setFile(null)}
                            className="text-accent hover:underline text-sm mt-2"
                        >
                            Remove
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4 pointer-events-none">
                            <UploadCloud size={32} />
                        </div>
                        <p className="font-heading font-medium text-heading text-lg mb-2">Drag & Drop your chat file</p>
                        <p className="text-body text-sm mb-6">Supports WhatsApp, Telegram, or generic JSON exports</p>

                        <label
                            htmlFor="file-upload"
                            className="bg-primary text-card hover:bg-secondary px-6 py-2.5 rounded-xl font-medium transition-colors cursor-pointer"
                        >
                            Browse Files
                        </label>
                    </>
                )}
            </div>

            {file && (
                <button
                    onClick={handleUploadClick}
                    className="w-full bg-accent text-card hover:bg-accent/90 py-3 rounded-xl font-medium font-heading transition-colors"
                >
                    Start Processing
                </button>
            )}
        </div>
    );
}
