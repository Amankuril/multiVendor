import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { vendorService } from '../../services/index';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function VendorAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        vendorService.getAnalytics()
            .then(r => { setData(r.data.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
    );

    if (!data) return null;

    return (
        <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1 variants={itemVariants} className="text-2xl font-bold text-surface-900 tracking-tight">Analytics</motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="bg-white rounded-xl border border-surface-200/60 p-5">
                    <h2 className="text-sm font-semibold text-surface-900 mb-4">Monthly Revenue</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data.monthlyRevenue}>
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip formatter={v => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                            <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-xl border border-surface-200/60 p-5">
                    <h2 className="text-sm font-semibold text-surface-900 mb-4">Category Breakdown</h2>
                    {data.categoryBreakdown?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={data.categoryBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                                    {data.categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-sm text-surface-500">No data yet.</p>}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {data.categoryBreakdown?.map((c, i) => (
                            <span key={c._id} className="flex items-center gap-1.5 text-xs text-surface-600">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                {c._id} ({c.count})
                            </span>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-xl border border-surface-200/60 p-5 lg:col-span-2">
                    <h2 className="text-sm font-semibold text-surface-900 mb-4">Top Products</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-200/60">
                                    <th className="text-left py-2.5 font-medium text-surface-500 text-xs uppercase tracking-wider">Product</th>
                                    <th className="text-left py-2.5 font-medium text-surface-500 text-xs uppercase tracking-wider">Sales</th>
                                    <th className="text-left py-2.5 font-medium text-surface-500 text-xs uppercase tracking-wider">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.topProducts?.map(p => (
                                    <tr key={p._id} className="border-b border-surface-100 hover:bg-surface-25 transition-colors">
                                        <td className="py-2.5 font-medium text-surface-900">{p.title}</td>
                                        <td className="py-2.5 text-surface-600 tabular-nums">{p.totalQuantity}</td>
                                        <td className="py-2.5 font-medium tabular-nums">₹{p.totalRevenue?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
