import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((product, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i._id === product._id);
            if (existing) {
                return prev.map((i) =>
                    i._id === product._id
                        ? { ...i, quantity: Math.min(i.quantity + quantity, product.inventory) }
                        : i
                );
            }
            return [...prev, { ...product, quantity: Math.min(quantity, product.inventory) }];
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setItems((prev) => prev.filter((i) => i._id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i._id !== productId));
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i._id === productId ? { ...i, quantity } : i))
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
