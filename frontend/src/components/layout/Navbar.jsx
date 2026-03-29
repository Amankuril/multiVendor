import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
    ShoppingCart,
    Menu,
    X,
    LogOut,
    LayoutDashboard,
    Store,
    ShieldCheck,
    Package,
    ChevronDown,
} from 'lucide-react';

const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -4 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.15 } },
};

const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

export default function Navbar() {
    const { user, isAuthenticated, logout, isVendor, isAdmin } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setProfileOpen(false);
    };

    const NavLink = ({ to, children, className = '' }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`text-sm font-medium transition-colors duration-200 ${isActive
                        ? 'text-surface-900'
                        : 'text-surface-500 hover:text-surface-800'
                    } ${className}`}
            >
                {children}
            </Link>
        );
    };

    return (
        <nav
            className="bg-white/70 backdrop-blur-xl border-b border-surface-200/60 sticky top-0 z-40"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group" aria-label="MarketPlace home">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-xs">
                            <Store className="w-4.5 h-4.5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-surface-900 tracking-tight">
                            MarketPlace
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/products" className="px-3 py-2 rounded-lg hover:bg-surface-100/80">
                            Products
                        </NavLink>

                        {isAuthenticated ? (
                            <>
                                {!isVendor && !isAdmin && (
                                    <NavLink to="/orders" className="px-3 py-2 rounded-lg hover:bg-surface-100/80">
                                        My Orders
                                    </NavLink>
                                )}

                                {/* Cart */}
                                {!isVendor && !isAdmin && (
                                    <Link
                                        to="/cart"
                                        className="relative p-2 ml-1 text-surface-500 hover:text-surface-800 transition-colors rounded-lg hover:bg-surface-100/80"
                                        aria-label={`Shopping cart with ${itemCount} items`}
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {itemCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold leading-none"
                                            >
                                                {itemCount > 9 ? '9+' : itemCount}
                                            </motion.span>
                                        )}
                                    </Link>
                                )}

                                {/* Profile Dropdown */}
                                <div className="relative ml-2" ref={profileRef}>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-100/80 transition-colors cursor-pointer"
                                        aria-expanded={profileOpen}
                                        aria-haspopup="true"
                                    >
                                        <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                            <span className="text-[11px] font-bold text-white leading-none">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-surface-700 hidden lg:block">
                                            {user?.name}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-surface-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-modal border border-surface-200/60 py-1.5 overflow-hidden"
                                                role="menu"
                                            >
                                                <div className="px-4 py-3 border-b border-surface-100">
                                                    <p className="text-sm font-semibold text-surface-900">{user?.name}</p>
                                                    <p className="text-xs text-surface-500 mt-0.5">{user?.email}</p>
                                                </div>

                                                {isVendor && (
                                                    <Link
                                                        to="/vendor"
                                                        onClick={() => setProfileOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
                                                        role="menuitem"
                                                    >
                                                        <LayoutDashboard className="w-4 h-4" />
                                                        Vendor Dashboard
                                                    </Link>
                                                )}

                                                {isAdmin && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setProfileOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
                                                        role="menuitem"
                                                    >
                                                        <ShieldCheck className="w-4 h-4" />
                                                        Admin Panel
                                                    </Link>
                                                )}

                                                {!isVendor && !isAdmin && (
                                                    <Link
                                                        to="/orders"
                                                        onClick={() => setProfileOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
                                                        role="menuitem"
                                                    >
                                                        <Package className="w-4 h-4" />
                                                        My Orders
                                                    </Link>
                                                )}

                                                <div className="border-t border-surface-100 mt-1 pt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                        role="menuitem"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Sign out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Link
                                    to="/login"
                                    className="px-3.5 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-100/80 transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-surface-900 text-white text-sm font-medium rounded-lg hover:bg-surface-800 transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg cursor-pointer transition-colors"
                        aria-expanded={mobileOpen}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden border-t border-surface-200/60 bg-white/95 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            <Link to="/products" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100">
                                Products
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    {!isVendor && !isAdmin && (
                                        <>
                                            <Link to="/cart" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100">
                                                Cart {itemCount > 0 && `(${itemCount})`}
                                            </Link>
                                            <Link to="/orders" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100">
                                                My Orders
                                            </Link>
                                        </>
                                    )}
                                    {isVendor && (
                                        <Link to="/vendor" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100">
                                            Vendor Dashboard
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <Link to="/admin" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100">
                                        Sign in
                                    </Link>
                                    <Link to="/register" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
