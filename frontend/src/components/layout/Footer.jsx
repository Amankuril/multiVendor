import { Store, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-surface-950 text-surface-400 mt-auto border-t border-surface-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                                <Store className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">MarketPlace</span>
                        </div>
                        <p className="text-sm text-surface-500 max-w-sm leading-relaxed">
                            Your premium multi-vendor marketplace. Discover unique products from independent sellers worldwide.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            <a href="#" className="p-2 rounded-lg bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-800 transition-colors" aria-label="Twitter">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-800 transition-colors" aria-label="GitHub">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
                        <div className="space-y-2.5">
                            <Link to="/products" className="block text-sm hover:text-white transition-colors">All Products</Link>
                            <Link to="/register" className="block text-sm hover:text-white transition-colors">Become a Vendor</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
                        <div className="space-y-2.5">
                            <span className="block text-sm">help@marketplace.com</span>
                            <span className="block text-sm">+91 9876543210</span>
                        </div>
                    </div>
                </div>
                <div className="border-t border-surface-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-surface-600">© 2026 MarketPlace. All rights reserved.</p>
                    <div className="flex gap-4 text-xs text-surface-600">
                        <a href="#" className="hover:text-surface-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-surface-400 transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
