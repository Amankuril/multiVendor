import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    BarChart3,
    Users,
    Store,
    ShieldCheck,
    ChevronLeft,
    LogOut,
    Menu,
    ChevronRight,
    Home,
} from 'lucide-react';

const vendorLinks = [
    { to: '/vendor', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/vendor/products', icon: Package, label: 'Products' },
    { to: '/vendor/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/vendor/analytics', icon: BarChart3, label: 'Analytics' },
];

const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/vendors', icon: Store, label: 'Vendors' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
];

/* Breadcrumb from current path */
function Breadcrumbs({ type }) {
    const location = useLocation();
    const base = type === 'admin' ? '/admin' : '/vendor';
    const segments = location.pathname.replace(base, '').split('/').filter(Boolean);

    return (
        <nav className="flex items-center gap-1.5 text-sm mb-6" aria-label="Breadcrumb">
            <Home className="w-3.5 h-3.5 text-surface-400" />
            <span className="text-surface-400">/</span>
            <NavLink to={base} className="text-surface-500 hover:text-surface-800 transition-colors capitalize font-medium">
                {type === 'admin' ? 'Admin' : 'Vendor'}
            </NavLink>
            {segments.map((seg, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <span className="text-surface-300">/</span>
                    <span className="text-surface-700 font-medium capitalize">{seg}</span>
                </span>
            ))}
        </nav>
    );
}

const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 72 },
};

const mobileSidebarVariants = {
    hidden: { x: -280, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 28 } },
    exit: { x: -280, opacity: 0, transition: { duration: 0.2 } },
};

export default function DashboardLayout({ type = 'vendor' }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const links = type === 'admin' ? adminLinks : vendorLinks;

    // Close mobile sidebar on route change
    useState(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const SidebarContent = () => (
        <>
            {/* Header */}
            <div className="p-4 border-b border-surface-200/60">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                        {type === 'admin' ? (
                            <ShieldCheck className="w-5 h-5 text-white" />
                        ) : (
                            <Store className="w-5 h-5 text-white" />
                        )}
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-surface-900 truncate">
                                {type === 'admin' ? 'Admin Panel' : 'Vendor Portal'}
                            </p>
                            <p className="text-xs text-surface-500 truncate">{user?.name}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Links */}
            <nav className="flex-1 p-3 space-y-0.5" aria-label="Sidebar navigation">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-primary-50 text-primary-700 border border-primary-100'
                                : 'text-surface-500 hover:bg-surface-50 hover:text-surface-800'
                            }`
                        }
                    >
                        <link.icon className="w-[18px] h-[18px] shrink-0" />
                        {!collapsed && <span>{link.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-surface-200/60">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-surface-500 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                >
                    <LogOut className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && <span>Sign out</span>}
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-surface-50">
            {/* Desktop Sidebar */}
            <motion.aside
                className="hidden lg:flex flex-col bg-white border-r border-surface-200/60 relative"
                variants={sidebarVariants}
                animate={collapsed ? 'collapsed' : 'expanded'}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
                <SidebarContent />
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center text-surface-400 hover:text-surface-700 shadow-xs cursor-pointer transition-colors z-10"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <motion.div
                        animate={{ rotate: collapsed ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </motion.div>
                </button>
            </motion.aside>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        <motion.div
                            className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            className="fixed left-0 top-0 bottom-0 w-64 bg-white flex flex-col z-50 border-r border-surface-200/60"
                            variants={mobileSidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar for mobile */}
                <div className="lg:hidden flex items-center gap-3 p-4 bg-white/70 backdrop-blur-xl border-b border-surface-200/60 sticky top-0 z-30">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 text-surface-500 hover:bg-surface-100 rounded-lg cursor-pointer transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-surface-900">
                        {type === 'admin' ? 'Admin Panel' : 'Vendor Portal'}
                    </span>
                </div>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Breadcrumbs type={type} />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
