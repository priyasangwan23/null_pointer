import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && <label className="text-sm font-medium text-heading">{label}</label>}
            <input
                ref={ref}
                className={`px-4 py-2 rounded-xl border bg-card text-body focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${error ? 'border-warning focus:ring-warning' : 'border-border focus:ring-accent/50'
                    }`}
                {...props}
            />
            {error && <span className="text-xs text-warning mt-1">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
