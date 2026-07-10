import { User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileCard({ name, status, score }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-soft flex flex-col items-center text-center"
        >
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-card mb-4 relative">
                <User size={40} />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-2 border-card" />
            </div>
            <h3 className="font-heading font-bold text-xl text-heading">{name}'s Clone</h3>
            <p className="text-body text-sm mt-1">{status}</p>

            <div className="w-full mt-6 bg-background rounded-xl p-4 border border-border">
                <div className="text-xs text-body mb-2 flex justify-between">
                    <span>Clone Accuracy</span>
                    <span className="font-bold text-primary">{score}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-primary h-full"
                    />
                </div>
            </div>
        </motion.div>
    );
}
