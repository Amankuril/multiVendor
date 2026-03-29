import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-surface-50" role="status" aria-label="Checking authentication">
            {/* Fake navbar skeleton */}
            <div className="h-16 bg-white/70 border-b border-surface-200/60 flex items-center px-6">
                <div className="h-8 w-32 rounded-lg animate-shimmer" />
                <div className="ml-auto flex gap-3">
                    <div className="h-8 w-20 rounded-lg animate-shimmer" />
                    <div className="h-8 w-24 rounded-lg animate-shimmer" />
                </div>
            </div>
            {/* Content skeleton */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="h-8 w-48 rounded-lg animate-shimmer mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-32 rounded-xl animate-shimmer" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProtectedRoute({ children, roles = [] }) {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
        if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
        if (user?.role === 'VENDOR') return <Navigate to="/vendor" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
}
