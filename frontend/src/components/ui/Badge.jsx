const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    danger: 'bg-red-50 text-red-700 border-red-200/60',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    neutral: 'bg-surface-100 text-surface-600 border-surface-200/60',
};

const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-indigo-500',
    neutral: 'bg-surface-400',
};

const statusMap = {
    APPROVED: 'success',
    ACTIVE: 'success',
    DELIVERED: 'success',
    PAID: 'success',
    PENDING: 'warning',
    PLACED: 'warning',
    PROCESSING: 'info',
    CONFIRMED: 'info',
    SHIPPED: 'info',
    SUSPENDED: 'danger',
    REJECTED: 'danger',
    CANCELLED: 'danger',
    FAILED: 'danger',
    REFUNDED: 'neutral',
};

export default function Badge({ children, variant, status, className = '', dot = true }) {
    const resolvedVariant = variant || statusMap[status] || 'neutral';

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                text-xs font-medium border
                ${badgeStyles[resolvedVariant]} ${className}
            `}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[resolvedVariant]}`} />
            )}
            {children || status}
        </span>
    );
}
