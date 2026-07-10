import { motion } from 'framer-motion';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyles = "px-4 py-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background";

    const variants = {
        primary: "bg-primary text-card hover:bg-secondary",
        secondary: "bg-border text-heading hover:bg-border/80",
        accent: "bg-accent text-card hover:bg-accent/90",
        ghost: "bg-transparent text-body hover:bg-border/50 hover:text-heading"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
}
