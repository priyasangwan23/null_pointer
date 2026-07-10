import { MessageSquare, Calendar, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConversationCard({ title, date, snippet, onDelete }) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-card p-5 rounded-2xl border border-border shadow-soft flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-1">
                    <MessageSquare size={18} />
                </div>
                <div>
                    <h4 className="font-heading font-medium text-heading mb-1">{title}</h4>
                    <p className="text-body text-sm line-clamp-1">{snippet}</p>
                    <div className="flex items-center gap-1 text-xs text-body/80 mt-2">
                        <Calendar size={12} />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-warning/70 hover:text-warning hover:bg-warning/10 rounded-lg shrink-0"
                aria-label="Delete conversation"
            >
                <Trash2 size={18} />
            </button>
        </motion.div>
    );
}
