import { create } from 'zustand'
import { api } from '../api/axios';

interface AuthState {
    token: string | null;
    expiresAt: string;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    expiresAt: localStorage.getItem('expiresAt') || '',
    login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        
        localStorage.setItem('token', res.data.accessToken)
        localStorage.setItem('expiresAt', res.data.expriresAT)
        set({ token: res.data.accessToken, expiresAt: res.data.expriresAT })
    },
    signup: async (email, password) => {
        await api.post('/auth/signup', { email, password })
    },
    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('expiresAt')
        set({ token: null, expiresAt: '' })
    }
})
)


