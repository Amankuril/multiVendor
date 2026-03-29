import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/index';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminVendors() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getVendors({ limit: 100 })
            .then(r => { setVendors(r.data.data.vendors); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const updateVendor = async (id, status) => {
        try {
            await adminService.updateVendor(id, { status });
            setVendors(vendors.map(v => v._id === id ? { ...v, status } : v));
            toast.success(`Vendor ${status.toLowerCase()}.`);
        } catch { toast.error('Action failed.'); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-bold text-surface-900 mb-6 tracking-tight">Vendor Management</h1>
            <div className="bg-white rounded-xl border border-surface-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface-50 border-b border-surface-200/60">
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Store</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Owner</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Products</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Sales</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Status</th>
                                <th className="text-right px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((v, i) => (
                                <motion.tr
                                    key={v._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="border-b border-surface-100 hover:bg-surface-25 transition-colors"
                                >
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center border border-primary-100">
                                                <Store className="w-4 h-4 text-primary-600" />
                                            </div>
                                            <span className="font-medium text-surface-900">{v.storeName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-surface-600">{v.user?.name || 'N/A'}</td>
                                    <td className="px-4 py-3.5 tabular-nums">{v.totalProducts}</td>
                                    <td className="px-4 py-3.5 font-medium tabular-nums">₹{v.totalSales?.toLocaleString()}</td>
                                    <td className="px-4 py-3.5"><Badge status={v.status} /></td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex justify-end gap-1.5">
                                            {v.status === 'PENDING' && (
                                                <>
                                                    <Button size="sm" onClick={() => updateVendor(v._id, 'APPROVED')}>Approve</Button>
                                                    <Button size="sm" variant="danger" onClick={() => updateVendor(v._id, 'REJECTED')}>Reject</Button>
                                                </>
                                            )}
                                            {v.status === 'APPROVED' && (
                                                <Button size="sm" variant="danger" onClick={() => updateVendor(v._id, 'SUSPENDED')}>Suspend</Button>
                                            )}
                                            {v.status === 'SUSPENDED' && (
                                                <Button size="sm" onClick={() => updateVendor(v._id, 'APPROVED')}>Reactivate</Button>
                                            )}
                                        </div>
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
