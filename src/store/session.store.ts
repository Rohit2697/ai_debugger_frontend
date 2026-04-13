import { create } from 'zustand';
import { api } from '../api/axios';


export interface Session {
    _id: string;
    title: string;
    errorMessage: string;
    codeSnippet: string;
    context?: string;
    language?: string | null;
};

interface SessionState {
    sessions: Session[];
    selectedSession: Session | null;
    fetchSessions: () => Promise<void>;
    createSession: (data: any) => Promise<void>;
    selectSession: (session: Session) => void;
    deleteSession: (sessionId: string) => Promise<void>;

}


export const useSessionStore = create<SessionState>((set) => ({
    sessions: [],
    selectedSession: null,
    fetchSessions: async () => {
        try {
            const response = await api.get('/sessions');
            set({ sessions: response.data });
            set({ selectedSession: response.data.length > 0 ? response.data[0] : null });
        } catch (error) {
            console.error('Error fetching sessions:', error);
            throw error
        }
    },

    createSession: async (data) => {
        try {
            const response = await api.post('/sessions', data);
            set((state) => ({ sessions: [...state.sessions, response.data] }));
        } catch (error) {
            console.error('Error creating session:', error);
            throw error
        }
    },
    selectSession: (session) => set({ selectedSession: session }),
    deleteSession: async (sessionId) => {
        try {
            await api.delete(`/sessions/${sessionId}`);
            set((state) => ({
                sessions: state.sessions.filter((s) => s._id !== sessionId),
                selectedSession: state.selectedSession?._id === sessionId ? null : state.selectedSession,
            }));
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error
        }
    }
}));