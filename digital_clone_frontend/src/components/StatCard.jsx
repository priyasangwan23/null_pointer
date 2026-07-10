import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className="bg-card p-6 rounded-2xl border border-border shadow-soft flex flex-col gap-2"
        >
            <div className="flex items-center gap-2 text-body mb-2">
                {Icon && <Icon size={18} className="text-accent" />}
                <span className="font-medium text-sm">{label}</span>
            </div>
            <div className="text-3xl font-heading font-bold text-heading">
                {value}
            </div>
        </motion.div>
    );
}
