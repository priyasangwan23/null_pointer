import { User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileCard({ name, status, score }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center transition-shadow hover:shadow-md"
        >
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-card mb-4 relative shadow-[0_4px_12px_rgba(75,54,33,0.15)] rotate-3 hover:rotate-0 transition-transform duration-300">
                <User size={36} />
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-success rounded-full border-2 border-card shadow-sm" />
            </div>
            
            <h3 className="font-heading font-semibold text-lg text-heading tracking-tight">{name}'s Clone</h3>
            <p className="text-body text-xs mt-1 font-medium bg-background px-3 py-1 rounded-full border border-border/50 inline-block">{status}</p>

            <div className="w-full mt-6 bg-background/50 rounded-xl p-4 border border-border/60">
                <div className="text-xs text-heading font-medium mb-2.5 flex justify-between items-center">
                    <span>Clone Accuracy</span>
                    <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{score}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2 overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="bg-primary h-full rounded-full relative"
                    >
                        <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ mixBlendMode: 'overlay' }}></div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
