'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: any | null;
    token: string | null;
    login: (token: string, refreshToken: string, userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Sync with localStorage on load
        const savedToken = localStorage.getItem('vaabhi_token');
        const savedUser = localStorage.getItem('vaabhi_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (token: string, refreshToken: string, userData: any) => {
        localStorage.setItem('vaabhi_token', token);
        localStorage.setItem('vaabhi_refresh_token', refreshToken);
        localStorage.setItem('vaabhi_user', JSON.stringify(userData));

        // Set cookies for middleware and RSCs (expires in 7 days)
        document.cookie = `vaabhi_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `vaabhi_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('vaabhi_token');
        localStorage.removeItem('vaabhi_refresh_token');
        localStorage.removeItem('vaabhi_user');
        document.cookie = 'vaabhi_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
        document.cookie = 'vaabhi_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
