import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService, reviewService } from '../services/index';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { Star, ShoppingCart, Minus, Plus, Store, Package, Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();
    const { isAuthenticated, isBuyer } = useAuth();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await productService.getById(id);
                setProduct(res.data.data.product);
                setReviews(res.data.data.reviews || []);
            } catch {
                toast.error('Failed to load product.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        toast.success('Added to cart!');
        setTimeout(() => setAdded(false), 2000);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await reviewService.create({ productId: id, ...reviewForm });
            setReviews([res.data.data.review, ...reviews]);
            setReviewForm({ rating: 5, comment: '' });
            toast.success('Review submitted!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Skeleton className="h-96 rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" count={3} />
                        <Skeleton className="h-12 w-40 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const discount = product.compareAtPrice > product.price
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="bg-white rounded-2xl overflow-hidden border border-surface-200/60"
                >
                    <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                        alt={product.title}
                        className="w-full h-80 sm:h-[28rem] object-cover"
                    />
                </motion.div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Store className="w-4 h-4 text-primary-600" />
                        <span className="text-sm text-primary-600 font-medium">{product.vendor?.storeName}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-3 tracking-tight">{product.title}</h1>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.round(product.ratings?.average || 0) ? 'text-amber-500 fill-amber-500' : 'text-surface-300'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-surface-500">({product.ratings?.count || 0} reviews)</span>
                    </div>

                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-3xl font-bold text-surface-900 tracking-tight">₹{product.price.toLocaleString()}</span>
                        {discount > 0 && (
                            <>
                                <span className="text-lg text-surface-400 line-through">₹{product.compareAtPrice.toLocaleString()}</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{discount}% off</span>
                            </>
                        )}
                    </div>

                    <p className="text-surface-600 mb-6 leading-relaxed">{product.description}</p>

                    <div className="flex items-center gap-4 mb-6">
                        {product.inventory > 0 ? (
                            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                                <Package className="w-4 h-4" /> In Stock ({product.inventory})
                            </span>
                        ) : (
                            <span className="text-sm text-red-500 font-medium">Out of Stock</span>
                        )}
                        <span className="text-sm text-surface-400">SKU: {product.sku || 'N/A'}</span>
                    </div>

                    {/* Quantity + Add to Cart */}
                    {product.inventory > 0 && (
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center border border-surface-300 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2.5 hover:bg-surface-50 transition-colors cursor-pointer rounded-l-lg"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-sm font-semibold w-12 text-center tabular-nums">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                                    className="p-2.5 hover:bg-surface-50 transition-colors cursor-pointer rounded-r-lg"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <Button
                                onClick={handleAddToCart}
                                icon={added ? Check : ShoppingCart}
                                size="lg"
                                variant={added ? 'accent' : 'primary'}
                                className="flex-1 sm:flex-none"
                            >
                                {added ? 'Added!' : 'Add to Cart'}
                            </Button>
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-surface-400 pt-5 border-t border-surface-200/60">
                        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Secure Checkout</span>
                        <span>Category: {product.category}</span>
                    </div>
                </motion.div>
            </div>

            {/* Reviews Section */}
            <motion.div
                className="mt-14"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
            >
                <h2 className="text-xl font-bold text-surface-900 tracking-tight mb-6">Customer Reviews</h2>

                {isAuthenticated && isBuyer && (
                    <form onSubmit={handleReviewSubmit} className="bg-white rounded-xl border border-surface-200/60 p-6 mb-8">
                        <h3 className="text-sm font-semibold text-surface-900 mb-4">Write a Review</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-surface-600">Rating:</span>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        className="cursor-pointer p-0.5"
                                        aria-label={`Rate ${star} stars`}
                                    >
                                        <Star className={`w-5 h-5 ${star <= reviewForm.rating ? 'text-amber-500 fill-amber-500' : 'text-surface-300'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            rows={3}
                            placeholder="Share your experience..."
                            className="w-full px-3.5 py-2.5 rounded-lg border border-surface-300 hover:border-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm mb-4 transition-all"
                            aria-label="Review comment"
                        />
                        <Button type="submit" loading={submitting} size="sm">Submit Review</Button>
                    </form>
                )}

                <div className="space-y-3">
                    {reviews.length === 0 ? (
                        <p className="text-sm text-surface-500 text-center py-10">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((r, i) => (
                            <motion.div
                                key={r._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl border border-surface-200/60 p-5"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">{r.user?.name?.charAt(0)}</span>
                                        </div>
                                        <span className="text-sm font-medium text-surface-900">{r.user?.name}</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-500 fill-amber-500' : 'text-surface-300'}`} />
                                        ))}
                                    </div>
                                </div>
                                {r.comment && <p className="text-sm text-surface-600 leading-relaxed">{r.comment}</p>}
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
