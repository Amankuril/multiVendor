import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/index';
import Badge from '../../components/ui/Badge';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getOrders({ limit: 100 })
            .then(r => { setOrders(r.data.data.orders); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-bold text-surface-900 mb-6 tracking-tight">All Orders</h1>
            <div className="bg-white rounded-xl border border-surface-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface-50 border-b border-surface-200/60">
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Order #</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Buyer</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Items</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Total</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Payment</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o, i) => (
                                <motion.tr
                                    key={o._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="border-b border-surface-100 hover:bg-surface-25 transition-colors"
                                >
                                    <td className="px-4 py-3.5 font-medium text-surface-900">{o.orderNumber}</td>
                                    <td className="px-4 py-3.5 text-surface-600">{o.buyer?.name}</td>
                                    <td className="px-4 py-3.5 tabular-nums">{o.items?.length}</td>
                                    <td className="px-4 py-3.5 font-medium tabular-nums">₹{o.totalAmount?.toLocaleString()}</td>
                                    <td className="px-4 py-3.5"><Badge status={o.orderStatus} /></td>
                                    <td className="px-4 py-3.5"><Badge status={o.paymentStatus} /></td>
                                    <td className="px-4 py-3.5 text-surface-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
