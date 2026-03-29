import { forwardRef, useId } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
    const id = useId();
    const errorId = `${id}-error`;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="w-4 h-4 text-surface-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    id={id}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    className={`
                        w-full px-3.5 py-2.5 rounded-lg border text-sm
                        bg-white text-surface-900 placeholder-surface-400
                        transition-all duration-200 ease-out
                        focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        hover:border-surface-400
                        ${Icon ? 'pl-10' : ''}
                        ${error
                            ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500'
                            : 'border-surface-300'
                        }
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p id={errorId} className="mt-1.5 text-sm text-danger-500" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
