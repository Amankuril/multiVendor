import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/index';
import StatCard from '../../components/ui/StatCard';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import { Users, Store, ShoppingBag, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashRes = await adminService.getDashboard();
                const dashData = dashRes.data.data;
                let trend = [];
                try {
                    const trendRes = await adminService.getRevenueTrend();
                    trend = trendRes.data.data.trend || [];
                } catch { /* revenue-trend may not have data */ }
                setData({ ...dashData.stats, trend });
            } catch { } finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <motion.h1 variants={itemVariants} className="text-2xl font-bold text-surface-900 tracking-tight">Admin Dashboard</motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={data.totalUsers} icon={Users} color="primary" index={0} />
                <StatCard title="Active Vendors" value={data.approvedVendors ?? data.activeVendors} icon={Store} color="accent" index={1} />
                <StatCard title="Total Orders" value={data.totalOrders} icon={ShoppingBag} color="warning" index={2} />
                <StatCard title="Revenue" value={`₹${(data.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} color="danger" index={3} />
            </div>

            {data.trend && data.trend.length > 0 && (
                <motion.div variants={itemVariants} className="bg-white rounded-xl border border-surface-200/60 p-5">
                    <h2 className="text-sm font-semibold text-surface-900 mb-4">Revenue Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.trend}>
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip formatter={v => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                            <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </motion.div>
    );
}

