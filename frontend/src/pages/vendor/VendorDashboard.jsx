import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { vendorService } from '../../services/index';
import StatCard from '../../components/ui/StatCard';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { Package, ShoppingBag, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function VendorDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        vendorService.getDashboard().then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
        </div>
    );

    if (!data) return null;
    const { stats, recentOrders, lowStockProducts, vendor } = data;

    return (
        <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Dashboard</h1>
                <p className="text-sm text-surface-500 mt-1">Welcome back, {vendor?.storeName}</p>
                {vendor?.status !== 'APPROVED' && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200/60 text-sm text-amber-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Your vendor account is {vendor?.status?.toLowerCase()}.
                    </div>
                )}
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Products" value={stats.totalProducts} icon={Package} color="primary" index={0} />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="accent" index={1} />
                <StatCard title="Net Revenue" value={`₹${stats.netRevenue?.toLocaleString()}`} icon={DollarSign} color="warning" index={2} />
                <StatCard title={`Commission (${stats.commissionRate}%)`} value={`₹${stats.commissionAmount?.toLocaleString()}`} icon={TrendingUp} color="danger" index={3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="bg-white rounded-xl border border-surface-200/60 p-5">
                    <h2 className="text-sm font-semibold text-surface-900 mb-4">Recent Orders</h2>
                    {recentOrders?.length === 0 ? <p className="text-sm text-surface-500">No orders yet.</p> : (
                        <div className="space-y-2">
                            {recentOrders?.map(o => (
                                <div key={o._id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-surface-900">{o.orderNumber}</p>
                                        <p className="text-xs text-surface-500">{o.buyer?.name} · {new Date(o.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold tabular-nums">₹{o.totalAmount?.toLocaleString()}</p>
                                        <Badge status={o.orderStatus} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-xl border border-surface-200/60 p-5">
                    <h2 className="text-sm font-semibold text-surface-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Alerts
                    </h2>
                    {lowStockProducts?.length === 0 ? <p className="text-sm text-surface-500">All products well stocked.</p> : (
                        <div className="space-y-2">
                            {lowStockProducts?.map(p => (
                                <div key={p._id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <span className="text-sm font-medium text-surface-900">{p.title}</span>
                                    <span className="text-sm font-bold text-amber-600 tabular-nums">{p.inventory} left</span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
