import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/index';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { MapPin, CreditCard, Check, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const stepContentVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'India' });
    const [paymentMethod, setPaymentMethod] = useState('COD');

    if (items.length === 0) { navigate('/cart'); return null; }

    const payments = [
        { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
        { value: 'CARD', label: 'Credit/Debit Card', icon: '💳' },
        { value: 'UPI', label: 'UPI Payment', icon: '📱' },
        { value: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await orderService.create({
                items: items.map(i => ({ product: i._id, quantity: i.quantity })),
                shippingAddress: address, paymentMethod,
            });
            clearCart();
            toast.success('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order.');
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-surface-900 mb-8 tracking-tight"
            >
                Checkout
            </motion.h1>

            {/* Steps indicator */}
            <div className="flex items-center gap-2 mb-8">
                {[{ n: 1, l: 'Address' }, { n: 2, l: 'Payment' }, { n: 3, l: 'Confirm' }].map(s => (
                    <div key={s.n} className="flex items-center gap-2 flex-1">
                        <motion.div
                            animate={{
                                backgroundColor: step >= s.n ? '#4f46e5' : '#e2e8f0',
                                color: step >= s.n ? '#ffffff' : '#64748b',
                            }}
                            transition={{ duration: 0.3 }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        >
                            {step > s.n ? <Check className="w-4 h-4" /> : s.n}
                        </motion.div>
                        <span className={`text-sm font-medium hidden sm:block transition-colors ${step >= s.n ? 'text-primary-600' : 'text-surface-400'}`}>{s.l}</span>
                        {s.n < 3 && <div className={`flex-1 h-0.5 rounded transition-colors ${step > s.n ? 'bg-primary-500' : 'bg-surface-200'}`} />}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step-1" variants={stepContentVariants} initial="enter" animate="center" exit="exit" className="bg-white rounded-xl border border-surface-200/60 p-6">
                                <h2 className="text-lg font-semibold text-surface-900 mb-5 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary-600" /> Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2"><Input label="Street" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} required /></div>
                                    <Input label="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} required />
                                    <Input label="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} required />
                                    <Input label="Zip Code" value={address.zipCode} onChange={e => setAddress({ ...address, zipCode: e.target.value })} required />
                                    <Input label="Country" value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} />
                                </div>
                                <Button onClick={() => { if (!address.street || !address.city || !address.state || !address.zipCode) { toast.error('Fill all required fields'); return; } setStep(2); }} className="mt-6" size="lg">Continue</Button>
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div key="step-2" variants={stepContentVariants} initial="enter" animate="center" exit="exit" className="bg-white rounded-xl border border-surface-200/60 p-6">
                                <h2 className="text-lg font-semibold text-surface-900 mb-5 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary-600" /> Payment Method
                                </h2>
                                <div className="space-y-3">
                                    {payments.map(pm => (
                                        <button
                                            key={pm.value}
                                            onClick={() => setPaymentMethod(pm.value)}
                                            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === pm.value ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:border-surface-300'}`}
                                        >
                                            <span className="text-xl">{pm.icon}</span>
                                            <span className="text-sm font-medium">{pm.label}</span>
                                            {paymentMethod === pm.value && <Check className="w-4 h-4 text-primary-600 ml-auto" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <Button variant="secondary" onClick={() => setStep(1)} icon={ArrowLeft}>Back</Button>
                                    <Button onClick={() => setStep(3)} size="lg">Review</Button>
                                </div>
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div key="step-3" variants={stepContentVariants} initial="enter" animate="center" exit="exit" className="bg-white rounded-xl border border-surface-200/60 p-6">
                                <h2 className="text-lg font-semibold text-surface-900 mb-5">Review Order</h2>
                                <div className="space-y-2 mb-4">
                                    {items.map(i => (
                                        <div key={i._id} className="flex items-center gap-3 bg-surface-50 rounded-lg p-3">
                                            <img src={i.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=40'} className="w-10 h-10 rounded object-cover" alt="" />
                                            <div className="flex-1"><p className="text-sm font-medium truncate">{i.title}</p><p className="text-xs text-surface-500">Qty: {i.quantity}</p></div>
                                            <span className="text-sm font-bold tabular-nums">₹{(i.price * i.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-surface-50 rounded-lg p-4 text-sm space-y-1 mb-4">
                                    <p><b className="text-surface-700">Ship to:</b> <span className="text-surface-600">{address.street}, {address.city}, {address.state} {address.zipCode}</span></p>
                                    <p><b className="text-surface-700">Payment:</b> <span className="text-surface-600">{payments.find(p => p.value === paymentMethod)?.label}</span></p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="secondary" onClick={() => setStep(2)} icon={ArrowLeft}>Back</Button>
                                    <Button onClick={handleSubmit} loading={loading} size="lg" variant="accent">Place Order — ₹{total.toLocaleString()}</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Summary */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="bg-white rounded-xl border border-surface-200/60 p-6 sticky top-24">
                        <h2 className="text-sm font-semibold mb-3 text-surface-900">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            {items.map(i => (
                                <div key={i._id} className="flex justify-between text-surface-600">
                                    <span className="truncate max-w-[60%]">{i.title} × {i.quantity}</span>
                                    <span className="tabular-nums">₹{(i.price * i.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="border-t border-surface-200/60 pt-2 flex justify-between font-semibold text-surface-900">
                                <span>Total</span><span className="tabular-nums">₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
