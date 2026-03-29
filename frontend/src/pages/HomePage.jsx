import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService } from '../services/index';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, ArrowRight, Zap, Shield, Truck, Store } from 'lucide-react';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAdd = (e) => {
        e.preventDefault();
        addToCart(product);
        toast.success('Added to cart!');
    };

    const discount = product.compareAtPrice > product.price
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    return (
        <Link to={`/products/${product._id}`} className="group">
            <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 bg-surface-100 overflow-hidden">
                    <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount > 0 && (
                        <span className="absolute top-3 left-3 bg-danger-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                            -{discount}%
                        </span>
                    )}
                    {product.inventory <= 5 && product.inventory > 0 && (
                        <span className="absolute top-3 right-3 bg-warning-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                            Low Stock
                        </span>
                    )}
                </div>
                <div className="p-4">
                    <p className="text-xs text-primary-600 font-medium mb-1">{product.vendor?.storeName || 'Vendor'}</p>
                    <h3 className="text-sm font-semibold text-surface-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                        {product.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-3">
                        <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
                        <span className="text-xs text-surface-600">{product.ratings?.average || 0} ({product.ratings?.count || 0})</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-surface-900">₹{product.price.toLocaleString()}</span>
                            {discount > 0 && (
                                <span className="text-sm text-surface-400 line-through">₹{product.compareAtPrice.toLocaleString()}</span>
                            )}
                        </div>
                        <button
                            onClick={handleAdd}
                            className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

const categories = [
    { name: 'Electronics', icon: '⚡', color: 'bg-blue-50 text-blue-600' },
    { name: 'Clothing', icon: '👕', color: 'bg-pink-50 text-pink-600' },
    { name: 'Sports', icon: '⚽', color: 'bg-green-50 text-green-600' },
    { name: 'Books', icon: '📚', color: 'bg-amber-50 text-amber-600' },
    { name: 'Health & Beauty', icon: '💄', color: 'bg-purple-50 text-purple-600' },
    { name: 'Home & Garden', icon: '🏡', color: 'bg-emerald-50 text-emerald-600' },
];

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.getAll({ limit: 8, sortBy: 'createdAt', order: 'desc' });
                setProducts(res.data.data.products);
            } catch {
                // silent fail on home
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="page-enter">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                            <Zap className="w-3.5 h-3.5" /> Premium Multi-Vendor Marketplace
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Discover Unique
                            <span className="text-accent-400"> Products</span> from
                            Top Vendors
                        </h1>
                        <p className="text-lg text-primary-100 mb-8 max-w-lg">
                            Shop from hundreds of independent sellers offering quality products at competitive prices.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                            >
                                Shop Now <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                            >
                                <Store className="w-4 h-4" /> Become a Vendor
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: Truck, title: 'Free Delivery', desc: 'On orders over ₹999' },
                        { icon: Shield, title: 'Secure Payments', desc: 'Protected checkout' },
                        { icon: Zap, title: 'Fast Processing', desc: 'Quick order fulfillment' },
                    ].map((f) => (
                        <div key={f.title} className="bg-white rounded-xl p-5 shadow-card flex items-center gap-4">
                            <div className="p-3 bg-primary-50 rounded-lg">
                                <f.icon className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-surface-900">{f.title}</p>
                                <p className="text-xs text-surface-500">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl font-bold text-surface-900 mb-8">Shop by Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            className="group bg-white rounded-xl p-5 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 text-center"
                        >
                            <span className="text-3xl block mb-3">{cat.icon}</span>
                            <span className="text-sm font-medium text-surface-700 group-hover:text-primary-600 transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-surface-900">Latest Products</h2>
                    <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                        : products.map((p) => <ProductCard key={p._id} product={p} />)
                    }
                </div>
            </section>
        </div>
    );
}
