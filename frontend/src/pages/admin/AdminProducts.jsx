import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/index';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getProducts({ limit: 100 })
            .then(r => { setProducts(r.data.data.products); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const toggle = async (id) => {
        try {
            const res = await adminService.toggleProduct(id);
            setProducts(products.map(p => p._id === id ? { ...p, isActive: res.data.data.product.isActive } : p));
            toast.success('Product updated.');
        } catch { toast.error('Failed.'); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-bold text-surface-900 mb-6 tracking-tight">Product Moderation</h1>
            <div className="bg-white rounded-xl border border-surface-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface-50 border-b border-surface-200/60">
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Product</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Vendor</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Price</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Category</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Status</th>
                                <th className="text-right px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => (
                                <motion.tr
                                    key={p._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="border-b border-surface-100 hover:bg-surface-25 transition-colors"
                                >
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=32'} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                            <span className="font-medium text-surface-900 truncate max-w-[200px]">{p.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-surface-600">{p.vendor?.storeName}</td>
                                    <td className="px-4 py-3.5 font-medium tabular-nums">₹{p.price?.toLocaleString()}</td>
                                    <td className="px-4 py-3.5 text-surface-600">{p.category}</td>
                                    <td className="px-4 py-3.5">
                                        <Badge variant={p.isActive ? 'success' : 'danger'}>{p.isActive ? 'Active' : 'Hidden'}</Badge>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <Button size="sm" variant={p.isActive ? 'danger' : 'primary'} onClick={() => toggle(p._id)}>
                                            {p.isActive ? 'Hide' : 'Unhide'}
                                        </Button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
