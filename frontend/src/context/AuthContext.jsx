import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/index';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await authService.getMe();
            setUser(res.data.data.user);
            setVendor(res.data.data.vendor);
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            setVendor(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email, password) => {
        const res = await authService.login({ email, password });
        const { user: userData, token: newToken } = res.data.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        // Fetch vendor info if vendor
        if (userData.role === 'VENDOR') {
            const meRes = await authService.getMe();
            setVendor(meRes.data.data.vendor);
        }
        return userData;
    };

    const register = async (data) => {
        const res = await authService.register(data);
        const { user: userData, token: newToken } = res.data.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const vendorRegister = async (data) => {
        const res = await authService.vendorRegister(data);
        const { user: userData, vendor: vendorData, token: newToken } = res.data.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setVendor(vendorData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setVendor(null);
    };

    const value = {
        user,
        vendor,
        token,
        loading,
        login,
        register,
        vendorRegister,
        logout,
        refreshUser: fetchUser,
        isAuthenticated: !!user,
        isBuyer: user?.role === 'BUYER',
        isVendor: user?.role === 'VENDOR',
        isAdmin: user?.role === 'ADMIN',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
