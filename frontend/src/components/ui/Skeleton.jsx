export default function Skeleton({ className = '', count = 1 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    role="status"
                    aria-label="Loading"
                    className={`rounded-lg animate-shimmer ${className}`}
                />
            ))}
        </>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-surface-200/60" role="status" aria-label="Loading product">
            <div className="h-52 animate-shimmer" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-16 rounded animate-shimmer" />
                <div className="h-4 w-3/4 rounded animate-shimmer" />
                <div className="h-3 w-1/2 rounded animate-shimmer" />
                <div className="flex justify-between items-center pt-2">
                    <div className="h-6 w-20 rounded animate-shimmer" />
                    <div className="h-9 w-9 rounded-lg animate-shimmer" />
                </div>
            </div>
        </div>
    );
}

export function TableRowSkeleton({ cols = 5 }) {
    return (
        <tr role="status" aria-label="Loading row">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3.5">
                    <div className="h-4 w-full rounded animate-shimmer" />
                </td>
            ))}
        </tr>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 border border-surface-200/60" role="status" aria-label="Loading stat">
            <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                    <div className="h-3 w-24 rounded animate-shimmer" />
                    <div className="h-8 w-28 rounded animate-shimmer" />
                    <div className="h-3 w-20 rounded animate-shimmer" />
                </div>
                <div className="h-11 w-11 rounded-xl animate-shimmer" />
            </div>
        </div>
    );
}
