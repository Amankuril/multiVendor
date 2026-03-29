import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
    primary:
        'bg-primary-600 text-white hover:bg-primary-700 shadow-xs hover:shadow-elevated',
    secondary:
        'bg-surface-100 text-surface-700 hover:bg-surface-200 border border-surface-200',
    danger:
        'bg-danger-500 text-white hover:bg-danger-600 shadow-xs hover:shadow-elevated',
    ghost:
        'bg-transparent text-surface-600 hover:bg-surface-100',
    outline:
        'border border-surface-300 text-surface-700 hover:bg-surface-50 hover:border-surface-400',
    accent:
        'bg-accent-500 text-white hover:bg-accent-600 shadow-xs hover:shadow-elevated',
};

const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1.5',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    icon: Icon,
    ...props
}) {
    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            disabled={disabled || loading}
            aria-busy={loading}
            aria-disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center font-medium rounded-lg
                transition-all duration-200 ease-out cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                active:scale-[0.97]
                ${variants[variant]} ${sizes[size]} ${className}
            `}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : Icon ? (
                <Icon className="w-4 h-4 shrink-0" />
            ) : null}
            {children}
        </motion.button>
    );
}
