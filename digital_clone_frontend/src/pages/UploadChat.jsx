import { useNavigate } from 'react-router-dom';
import UploadCard from '../components/UploadCard';

export default function UploadChat() {
    const navigate = useNavigate();

    const handleUpload = (file) => {
        // In a real scenario you would set this in a global context or pass it via state
        navigate('/processing', { state: { fileName: file.name, fileSize: file.size } });
    };

    return (
        <div className="w-full flex flex-col pt-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold font-heading text-heading mb-4">Upload Chat History</h1>
                <p className="text-body max-w-xl mx-auto">
                    Export your favorite chat logs and upload them here. We will analyze the data to create your custom digital persona.
                </p>
            </div>

            <div className="flex-1 flex justify-center w-full">
                <UploadCard onUpload={handleUpload} />
            </div>
        </div>
    );
}
