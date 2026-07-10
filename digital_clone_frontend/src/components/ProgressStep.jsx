import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

export default function ProgressStep({ title, description, isComplete, isActive, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isActive || isComplete ? 1 : 0.5, x: 0 }}
            transition={{ duration: 0.4, delay }}
            className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${isActive ? 'bg-primary/5 border border-primary/10' : 'bg-transparent'
                }`}
        >
            <div className="mt-1 shrink-0">
                {isComplete ? (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-success"
                    >
                        <CheckCircle2 size={24} />
                    </motion.div>
                ) : isActive ? (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-accent"
                    >
                        <Circle size={24} className="fill-accent/20" />
                    </motion.div>
                ) : (
                    <div className="text-border">
                        <Circle size={24} />
                    </div>
                )}
            </div>
            <div>
                <h4 className={`font-heading font-medium text-lg ${isActive || isComplete ? 'text-heading' : 'text-body'}`}>
                    {title}
                </h4>
                {description && (
                    <p className="text-body text-sm mt-1">{description}</p>
                )}
            </div>
        </motion.div>
    );
}
