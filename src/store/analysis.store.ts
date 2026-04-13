import { create } from 'zustand'
import { api } from '../api/axios';

export interface Analysis {
    sessionId: string;
    explanation?: string | null;
    rootCause?: string | null;
    fix?: string | null;
    improvedCode?: string | null;
}


interface AnalysisState {
    analysis: Analysis | null;
    fetchAnalysis: (sessionId: string) => Promise<Analysis | null>;
    createAnalysis: (sessionId: string) => Promise<void>;
    deleteAnalysis: (sessionId: string) => Promise<void>;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
    analysis: null,
    fetchAnalysis: async (sessionId) => {
        try {
            const response = await api.get(`/ai/analyze/${sessionId}`);
            set({ analysis: response.data });
            return response.data
        } catch (error) {
            console.error('Error fetching analysis:', error);
            set({ analysis: null });
            return null
        }
    },
    createAnalysis: async (sessionId) => {
        try {
            const fetchAnalysys = useAnalysisStore.getState().fetchAnalysis
            const existinganalysis = await fetchAnalysys(sessionId);
            if (existinganalysis) {
                set({ analysis: existinganalysis })
                return
            }
            const response = await api.post(`/ai/analyze/${sessionId}`);
            set({ analysis: response.data });
        } catch (error) {
            console.error('Error creating analysis:', error);
            set({ analysis: null });
        }
    },
    deleteAnalysis: async (sessionId) => {
        try {
            await api.delete(`/ai/analyze/${sessionId}`);
            set({ analysis: null });
        } catch (error) {
            console.error('Error deleting analysis:', error);
        }
    }
}))

