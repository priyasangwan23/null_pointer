import { motion } from 'framer-motion';

export default function ChatBubble({ message, isAI, timestamp }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
        >
            <div className={`max-w-[75%] rounded-2xl p-4 ${isAI
                    ? 'bg-card border border-border text-heading shadow-sm rounded-tl-none'
                    : 'bg-primary text-card rounded-tr-none'
                }`}>
                <p className="whitespace-pre-wrap">{message}</p>
                {timestamp && (
                    <span className={`text-xs mt-2 block ${isAI ? 'text-body text-left' : 'text-card/70 text-right'}`}>
                        {timestamp}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
