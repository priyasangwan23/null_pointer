import { motion } from 'framer-motion';

export default function ChartCard({ title, children, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            className="bg-card p-6 rounded-2xl border border-border shadow-soft flex flex-col h-full"
        >
            <h3 className="text-lg font-heading font-semibold text-heading mb-6">{title}</h3>
            <div className="flex-1 w-full relative min-h-[300px]">
                {children}
            </div>
        </motion.div>
    );
}
