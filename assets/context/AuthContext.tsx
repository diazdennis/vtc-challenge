import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await authApi.getCurrentUser();
            if (response.success && response.user) {
                setUser(response.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            if (response.success && response.user) {
                setUser(response.user);
                return { success: true };
            }
            return { success: false, message: response.message || 'Login failed' };
        } catch (error) {
            return { success: false, message: 'An error occurred during login' };
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const response = await authApi.register({ email, password });
            return { success: response.success, message: response.message };
        } catch (error) {
            return { success: false, message: 'An error occurred during registration' };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
