import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { orderService } from '../../services/index';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function VendorOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        orderService.getVendorOrders({ limit: 100 })
            .then(r => { setOrders(r.data.data.orders); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const updateStatus = async (orderId, itemId, status) => {
        try {
            await orderService.updateItemStatus(orderId, itemId, { status });
            setOrders(orders.map(o => {
                if (o._id === orderId) {
                    return { ...o, items: o.items.map(i => i._id === itemId ? { ...i, status } : i) };
                }
                return o;
            }));
            toast.success('Status updated.');
        } catch { toast.error('Failed to update.'); }
    };

    if (!loading && orders.length === 0) {
        return <EmptyState title="No orders" description="Orders will appear here." icon={ShoppingBag} />;
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <h1 className="text-2xl font-bold text-surface-900 mb-6 tracking-tight">Orders</h1>
            <div className="space-y-3">
                {orders.map(o => (
                    <motion.div key={o._id} variants={itemVariants} className="bg-white rounded-xl border border-surface-200/60 p-5 hover:border-surface-300 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <div>
                                <span className="text-sm font-semibold text-surface-900">{o.orderNumber}</span>
                                <span className="text-xs text-surface-500 ml-2">{new Date(o.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-surface-500">Buyer: </span>
                                <span className="font-medium text-surface-900">{o.buyer?.name}</span>
                            </div>
                        </div>
                        {o.items?.map(item => (
                            <div key={item._id} className="flex items-center justify-between py-3 border-t border-surface-100">
                                <div className="flex items-center gap-3">
                                    <img src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=32'} className="w-8 h-8 rounded object-cover" alt="" />
                                    <div>
                                        <p className="text-sm font-medium text-surface-900">{item.title || item.product?.title}</p>
                                        <p className="text-xs text-surface-500">Qty: {item.quantity} · ₹{item.price?.toLocaleString()}</p>
                                    </div>
                                </div>
                                <select
                                    value={item.status}
                                    onChange={(e) => updateStatus(o._id, item._id, e.target.value)}
                                    className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-300 hover:border-surface-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all cursor-pointer bg-white"
                                    aria-label="Update order status"
                                >
                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        ))}
                        <div className="flex justify-end pt-3 border-t border-surface-100 mt-2">
                            <span className="text-sm font-bold tabular-nums">₹{o.totalAmount?.toLocaleString()}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
