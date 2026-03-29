import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User, Store, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const formVariants = {
    enter: { opacity: 0, y: 8 },
    center: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function RegisterPage() {
    const [isVendor, setIsVendor] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', storeName: '', storeDescription: '' });
    const [loading, setLoading] = useState(false);
    const { register, vendorRegister } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isVendor) {
                await vendorRegister(form);
                toast.success('Vendor account created! Awaiting admin approval.');
                navigate('/vendor');
            } else {
                await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
                toast.success('Account created successfully!');
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-xl mb-4 border border-primary-100">
                        <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Create Account</h1>
                    <p className="text-sm text-surface-500 mt-1">Join the marketplace today</p>
                </div>

                {/* Toggle Buyer/Vendor */}
                <div className="flex bg-surface-100 rounded-lg p-1 mb-6 relative">
                    <motion.div
                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-xs"
                        animate={{ left: isVendor ? 'calc(50% + 2px)' : '4px' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                    <button
                        type="button"
                        onClick={() => setIsVendor(false)}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer relative z-10 ${!isVendor ? 'text-surface-900' : 'text-surface-500'}`}
                    >
                        Buyer Account
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsVendor(true)}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer relative z-10 ${isVendor ? 'text-surface-900' : 'text-surface-500'}`}
                    >
                        Vendor Account
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-surface-200/60 p-6 space-y-4">
                    <Input label="Full Name" name="name" icon={User} placeholder="John Doe" value={form.name} onChange={handleChange} required />
                    <Input label="Email" type="email" name="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                    <Input label="Password" type="password" name="password" icon={Lock} placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
                    <Input label="Phone" name="phone" icon={Phone} placeholder="9876543210" value={form.phone} onChange={handleChange} />

                    <AnimatePresence mode="wait">
                        {isVendor && (
                            <motion.div
                                key="vendor-fields"
                                variants={formVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-4"
                            >
                                <Input label="Store Name" name="storeName" icon={Store} placeholder="My Awesome Store" value={form.storeName} onChange={handleChange} required />
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Store Description</label>
                                    <textarea
                                        name="storeDescription"
                                        value={form.storeDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-surface-300 hover:border-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm text-surface-900 placeholder-surface-400 transition-all"
                                        placeholder="Describe your store..."
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button type="submit" loading={loading} className="w-full" size="lg">
                        {isVendor ? 'Register as Vendor' : 'Create Account'}
                    </Button>
                </form>

                <p className="text-center text-sm text-surface-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
}
