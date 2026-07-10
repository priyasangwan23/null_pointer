import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Cpu, Smile } from 'lucide-react';
import Button from '../components/Button';

export default function Landing() {
    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-24 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-5xl md:text-7xl font-bold font-heading text-heading mb-6 tracking-tight">
                    Digital Clone
                </h1>
                <p className="text-xl md:text-2xl text-body mb-10 max-w-2xl mx-auto font-medium">
                    "Your Communication. Your Personality. Your AI."
                </p>
                <Link to="/upload">
                    <Button variant="primary" className="text-lg px-8 py-4">
                        Try It Now
                    </Button>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                <div className="bg-card p-8 rounded-3xl shadow-soft border border-border flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-heading mb-3">Upload Chats</h3>
                    <p className="text-body text-center">Easily export and upload your conversations from popular messaging apps.</p>
                </div>
                <div className="bg-card p-8 rounded-3xl shadow-soft border border-border flex flex-col items-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                        <Cpu size={32} />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-heading mb-3">AI Analysis</h3>
                    <p className="text-body text-center">Our advanced models analyze your vocabulary, tone, and emoji usage.</p>
                </div>
                <div className="bg-card p-8 rounded-3xl shadow-soft border border-border flex flex-col items-center">
                    <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center text-success mb-6">
                        <Smile size={32} />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-heading mb-3">Talk to Yourself</h3>
                    <p className="text-body text-center">Interact with an AI clone that talks exactly like you do in real life.</p>
                </div>
            </motion.div>
        </div>
    );
}
