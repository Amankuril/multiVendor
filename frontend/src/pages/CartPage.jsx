import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const itemVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0, transition: { duration: 0.25 } },
};

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <EmptyState
                    title="Your cart is empty"
                    description="Looks like you haven't added anything yet."
                    icon={ShoppingBag}
                    action={<Button onClick={() => navigate('/products')} icon={ArrowRight}>Browse Products</Button>}
                />
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
                Shopping Cart ({items.length})
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-3">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                            <motion.div
                                key={item._id}
                                variants={itemVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                layout
                                className="bg-white rounded-xl border border-surface-200/60 p-4 flex gap-4"
                            >
                                <img
                                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80'}
                                    alt={item.title}
                                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <Link to={`/products/${item._id}`} className="text-sm font-semibold text-surface-900 hover:text-primary-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </Link>
                                    <p className="text-xs text-surface-500 mt-1">{item.vendor?.storeName || 'Vendor'}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center border border-surface-300 rounded-lg">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1.5 hover:bg-surface-50 cursor-pointer rounded-l-lg transition-colors" aria-label="Decrease quantity">
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="px-3 py-1 text-sm font-medium tabular-nums">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1.5 hover:bg-surface-50 cursor-pointer rounded-r-lg transition-colors" aria-label="Increase quantity">
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-surface-900 tabular-nums">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-1.5 text-surface-400 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                                                aria-label={`Remove ${item.title} from cart`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <div className="bg-white rounded-xl border border-surface-200/60 p-6 sticky top-24">
                        <h2 className="text-lg font-semibold text-surface-900 mb-4">Order Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-surface-600">
                                <span>Subtotal ({items.length} items)</span>
                                <span className="tabular-nums">₹{total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-surface-600">
                                <span>Shipping</span>
                                <span className="text-emerald-600 font-medium">Free</span>
                            </div>
                            <div className="border-t border-surface-200/60 pt-3 flex justify-between font-semibold text-surface-900 text-base">
                                <span>Total</span>
                                <span className="tabular-nums">₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <Button onClick={() => navigate('/checkout')} className="w-full mt-6" size="lg" icon={ArrowRight}>
                            Proceed to Checkout
                        </Button>
                        <button
                            onClick={clearCart}
                            className="w-full mt-3 text-sm text-surface-500 hover:text-red-500 transition-colors text-center cursor-pointer"
                        >
                            Clear Cart
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
