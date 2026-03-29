import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description = '', icon: Icon = PackageOpen, action }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            <div className="p-4 bg-surface-100 rounded-2xl mb-4">
                <Icon className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-700 mb-1">{title}</h3>
            {description && <p className="text-sm text-surface-500 max-w-md">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </motion.div>
    );
}
