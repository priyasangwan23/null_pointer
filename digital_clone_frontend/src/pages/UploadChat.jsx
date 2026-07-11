import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadCard from '../components/UploadCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { uploadChat } from '../services/api';
import Loader from '../components/Loader';
import { CheckCircle2 } from 'lucide-react';

export default function UploadChat() {
    const navigate = useNavigate();
    const [senderName, setSenderName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleUpload = async (file) => {
        setIsUploading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const data = await uploadChat(file, senderName, 'casual');
            setSuccessMessage(data.message);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full flex flex-col pt-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold font-heading text-heading mb-4">Upload Chat History</h1>
                <p className="text-body max-w-xl mx-auto">
                    Export your favorite WhatsApp chat logs and upload them here. We will extract your messages to capture your unique tone.
                </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-start w-full gap-8 max-w-xl mx-auto">
                {!successMessage && !isUploading && (
                    <div className="w-full bg-card border border-border p-6 rounded-2xl">
                        <Input
                            label="Your Name in the Chat (Optional)"
                            placeholder="e.g. Priya"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                        />
                        <p className="text-xs text-secondary mt-2">
                            Leave blank to automatically pick the most frequent sender.
                        </p>
                    </div>
                )}

                {isUploading && (
                    <div className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-card rounded-2xl border border-border">
                        <Loader size={48} color="#4B3621" />
                        <h3 className="text-lg font-heading font-semibold text-heading">Analyzing chat...</h3>
                        <p className="text-body text-sm text-center max-w-xs">Reading file and parsing your message style. This may take a moment.</p>
                    </div>
                )}

                {!isUploading && !successMessage && (
                    <UploadCard onUpload={handleUpload} />
                )}

                {error && (
                    <div className="w-full p-4 bg-error/10 border border-error/20 text-error rounded-xl text-center text-sm font-medium">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="w-full p-8 bg-card border border-success/20 rounded-2xl flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold font-heading text-heading">Success!</h2>
                        <p className="text-body">{successMessage}</p>

                        <div className="mt-4 flex gap-4 w-full">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setSuccessMessage(null);
                                    setSenderName('');
                                }}
                            >
                                Upload Another
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1"
                                onClick={() => navigate('/chat')}
                            >
                                Go to Chat
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
