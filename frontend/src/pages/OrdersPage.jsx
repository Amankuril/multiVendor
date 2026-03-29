import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../services/index';
import Badge from '../components/ui/Badge';
import { TableRowSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Package } from 'lucide-react';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await orderService.getMyOrders({ limit: 50 });
                setOrders(res.data.data.orders);
            } catch { } finally { setLoading(false); }
        };
        fetch();
    }, []);

    if (!loading && orders.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <EmptyState title="No orders yet" description="Start shopping to see your orders here." icon={Package} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-surface-900 mb-8 tracking-tight"
            >
                My Orders
            </motion.h1>
            <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {loading ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-surface-200/60 p-4">
                        <table className="w-full"><tbody><TableRowSkeleton cols={4} /></tbody></table>
                    </div>
                )) : orders.map((order) => (
                    <motion.div key={order._id} variants={itemVariants}>
                        <Link to={`/orders/${order._id}`} className="block bg-white rounded-xl border border-surface-200/60 p-5 hover:border-surface-300 hover:shadow-elevated transition-all duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                <div>
                                    <span className="text-sm font-semibold text-surface-900">{order.orderNumber}</span>
                                    <span className="text-xs text-surface-500 ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Badge status={order.orderStatus} />
                                    <Badge status={order.paymentStatus} />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 shrink-0 bg-surface-50 rounded-lg p-2">
                                        <img src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=40'} className="w-10 h-10 object-cover rounded" alt="" />
                                        <div>
                                            <p className="text-xs font-medium text-surface-900 line-clamp-1">{item.title || item.product?.title}</p>
                                            <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-surface-100">
                                <span className="text-sm text-surface-500">{order.items?.length} item(s)</span>
                                <span className="text-sm font-bold text-surface-900 tabular-nums">₹{order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
