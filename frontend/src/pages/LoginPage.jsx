import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success(`Welcome back, ${user.name}!`);
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'VENDOR') navigate('/vendor');
            else navigate(from);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
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
                        <Store className="w-6 h-6 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Welcome back</h1>
                    <p className="text-sm text-surface-500 mt-1">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-surface-200/60 p-6 space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        icon={Mail}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        icon={Lock}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" loading={loading} className="w-full" size="lg">
                        Sign In
                    </Button>
                </form>

                <p className="text-center text-sm text-surface-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
