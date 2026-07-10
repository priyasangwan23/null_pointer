import { motion } from 'framer-motion';

export default function ChatBubble({ message, isAI, timestamp }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
        >
            <div className={`max-w-[75%] rounded-[18px] p-3.5 px-4 shadow-sm ${isAI
                    ? 'bg-card border border-border text-heading rounded-tl-sm'
                    : 'bg-primary text-card rounded-tr-sm border border-primary/20'
                }`}>
                <p className="whitespace-pre-wrap leading-relaxed text-[14px]">{message}</p>
                {timestamp && (
                    <span className={`text-[10px] mt-1.5 block font-medium uppercase tracking-wider ${isAI ? 'text-body/60 text-left' : 'text-card/70 text-right'}`}>
                        {timestamp}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
