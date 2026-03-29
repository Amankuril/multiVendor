import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/index';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getUsers({ limit: 100 })
            .then(r => { setUsers(r.data.data.users); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const toggle = async (id) => {
        try {
            const res = await adminService.toggleUser(id);
            setUsers(users.map(u => u._id === id ? { ...u, isActive: res.data.data.user.isActive } : u));
            toast.success('User updated.');
        } catch { toast.error('Failed.'); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl font-bold text-surface-900 mb-6 tracking-tight">User Management</h1>
            <div className="bg-white rounded-xl border border-surface-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface-50 border-b border-surface-200/60">
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">User</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Email</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Role</th>
                                <th className="text-left px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Status</th>
                                <th className="text-right px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <motion.tr
                                    key={u._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="border-b border-surface-100 hover:bg-surface-25 transition-colors"
                                >
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-surface-500" />
                                            </div>
                                            <span className="font-medium text-surface-900">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-surface-600">{u.email}</td>
                                    <td className="px-4 py-3.5"><Badge variant="info">{u.role}</Badge></td>
                                    <td className="px-4 py-3.5">
                                        <Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        {u.role !== 'ADMIN' && (
                                            <Button size="sm" variant={u.isActive ? 'danger' : 'primary'} onClick={() => toggle(u._id)}>
                                                {u.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        )}
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
