import { motion } from 'framer-motion';

export default function Loader({ size = 40, color = '#4B3621' }) {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                    width: size,
                    height: size,
                    border: `3px solid ${color}40`,
                    borderTop: `3px solid ${color}`,
                    borderRadius: '50%',
                }}
            />
        </div>
    );
}
