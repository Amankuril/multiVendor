import { useId } from 'react';

export default function Select({ label, error, options = [], className = '', ...props }) {
    const id = useId();
    const errorId = `${id}-error`;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-1.5">
                    {label}
                </label>
            )}
            <select
                id={id}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                className={`
                    w-full px-3.5 py-2.5 rounded-lg border text-sm
                    bg-white text-surface-900
                    transition-all duration-200 ease-out
                    focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                    hover:border-surface-400
                    ${error ? 'border-danger-500' : 'border-surface-300'}
                    ${className}
                `}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value ?? opt} value={opt.value ?? opt}>
                        {opt.label ?? opt}
                    </option>
                ))}
            </select>
            {error && (
                <p id={errorId} className="mt-1.5 text-sm text-danger-500" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
