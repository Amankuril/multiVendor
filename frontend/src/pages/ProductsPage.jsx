import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../services/index';
import { useCart } from '../context/CartContext';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { Search, SlidersHorizontal, ShoppingCart, Star, X, Check } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Health & Beauty', 'Automotive', 'Food & Beverages', 'Other'];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

function ProductGridCard({ product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const discount = product.compareAtPrice > product.price ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        toast.success('Added to cart!');
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <motion.div variants={cardVariants} layout>
            <Link to={`/products/${product._id}`} className="group block">
                <div className="bg-white rounded-xl overflow-hidden border border-surface-200/60 hover:border-surface-300 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-52 bg-surface-100 overflow-hidden">
                        <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                        {discount > 0 && <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">-{discount}%</span>}
                    </div>
                    <div className="p-4">
                        <p className="text-xs text-primary-600 font-medium mb-1">{product.vendor?.storeName || 'Vendor'}</p>
                        <h3 className="text-sm font-semibold text-surface-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">{product.title}</h3>
                        <div className="flex items-center gap-1 mb-3">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs text-surface-500 font-medium">{product.ratings?.average || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-surface-900 tracking-tight">₹{product.price.toLocaleString()}</span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleAdd}
                                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${added ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-100 text-surface-500 hover:bg-primary-50 hover:text-primary-600'
                                    }`}
                                aria-label={`Add ${product.title} to cart`}
                            >
                                {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [sortBy, setSortBy] = useState('createdAt');
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page: searchParams.get('page') || 1, limit: 12, sortBy, order: sortBy === 'price' ? 'asc' : 'desc' };
            if (category && category !== 'All') params.category = category;
            if (debouncedSearch) params.search = debouncedSearch;
            const res = await productService.getAll(params);
            setProducts(res.data.data.products);
            setPagination(res.data.data.pagination);
        } catch {
            toast.error('Failed to load products.');
        } finally {
            setLoading(false);
        }
    }, [category, sortBy, debouncedSearch, searchParams]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Products</h1>
                    <p className="text-sm text-surface-500 mt-1">{pagination.total || 0} products found</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-300 hover:border-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all bg-white"
                            aria-label="Search products"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-2.5 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors sm:hidden cursor-pointer"
                        aria-label="Toggle filters"
                    >
                        <SlidersHorizontal className="w-4 h-4 text-surface-600" />
                    </button>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Filters */}
                <AnimatePresence>
                    <div className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-52 shrink-0`}>
                        <div className="bg-white rounded-xl border border-surface-200/60 p-4 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-surface-900">Categories</h3>
                                <button className="sm:hidden cursor-pointer" onClick={() => setShowFilters(false)} aria-label="Close filters">
                                    <X className="w-4 h-4 text-surface-500" />
                                </button>
                            </div>
                            <div className="space-y-0.5">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${category === cat
                                            ? 'bg-primary-50 text-primary-700 font-medium border border-primary-100'
                                            : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-surface-200/60 mt-4 pt-4">
                                <h3 className="text-sm font-semibold text-surface-900 mb-3">Sort By</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white transition-all"
                                    aria-label="Sort products"
                                >
                                    <option value="createdAt">Newest</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="ratings.average">Top Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </AnimatePresence>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                        </div>
                    ) : products.length === 0 ? (
                        <EmptyState title="No products found" description="Try adjusting your search or filters." />
                    ) : (
                        <>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                            >
                                {products.map((p) => (
                                    <ProductGridCard key={p._id} product={p} />
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="flex justify-center gap-2 mt-10">
                                    {Array.from({ length: pagination.pages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSearchParams({ page: i + 1, category: category !== 'All' ? category : '', search })}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer ${pagination.page === i + 1
                                                ? 'bg-surface-900 text-white'
                                                : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
