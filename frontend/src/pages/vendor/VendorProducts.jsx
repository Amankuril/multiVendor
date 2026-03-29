import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { vendorService, productService } from '../../services/index';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VendorProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetch = async () => {
        try {
            const res = await vendorService.getProducts({ limit: 100 });
            setProducts(res.data.data.products);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, []);

    const handleDelete = async () => {
        try {
            await productService.delete(deleteId);
            setProducts(products.filter(p => p._id !== deleteId));
            toast.success('Product deleted.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete.');
        }
        setDeleteId(null);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Products</h1>
                <Link to="/vendor/products/new">
                    <Button icon={Plus} size="sm">Add Product</Button>
                </Link>
            </div>

            {!loading && products.length === 0 ? (
                <EmptyState title="No products" description="Add your first product to start selling." icon={Package} />
            ) : (
                <div className="bg-white rounded-xl border border-surface-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface-50 border-b border-surface-200/60">
                                    <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Product</th>
                                    <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Category</th>
                                    <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Price</th>
                                    <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Stock</th>
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
                                                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=40'} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                <span className="font-medium text-surface-900 truncate max-w-[200px]">{p.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-surface-600">{p.category}</td>
                                        <td className="px-4 py-3.5 font-medium tabular-nums">₹{p.price?.toLocaleString()}</td>
                                        <td className="px-4 py-3.5">
                                            <span className={p.inventory <= 5 ? 'text-amber-600 font-bold' : 'text-surface-600'}>{p.inventory}</span>
                                        </td>
                                        <td className="px-4 py-3.5"><Badge status={p.isActive ? 'ACTIVE' : 'SUSPENDED'} /></td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link to={`/vendor/products/edit/${p._id}`}>
                                                    <button className="p-2 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer" aria-label="Edit product">
                                                        <Edit className="w-4 h-4 text-surface-500" />
                                                    </button>
                                                </Link>
                                                <button onClick={() => setDeleteId(p._id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" aria-label="Delete product">
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
                <p className="text-sm text-surface-600 mb-4">Are you sure? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
            </Modal>
        </motion.div>
    );
}
