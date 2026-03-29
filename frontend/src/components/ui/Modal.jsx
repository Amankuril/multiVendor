import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.97, y: 5 },
};

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                        aria-hidden="true"
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                        className={`relative bg-white rounded-2xl border border-surface-200/60 shadow-modal w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-surface-100">
                            <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer text-surface-400 hover:text-surface-600"
                                aria-label="Close dialog"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
