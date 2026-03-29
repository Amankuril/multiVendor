import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary', index = 0 }) {
    const colors = {
        primary: 'bg-primary-50 text-primary-600 border-primary-100',
        accent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        warning: 'bg-amber-50 text-amber-600 border-amber-100',
        danger: 'bg-red-50 text-red-600 border-red-100',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-white rounded-xl p-5 border border-surface-200/60 hover:border-surface-300/80 transition-colors duration-200"
        >
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-[13px] text-surface-500 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-surface-900 tracking-tight">{value}</p>
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {trend >= 0 ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            <span>{Math.abs(trend)}% from last month</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
