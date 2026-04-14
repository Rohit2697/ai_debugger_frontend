import { create } from 'zustand';
import { api } from '../api/axios';

interface Message {
    from: "assistant" | "user";
    text: string;
}


interface ChatState {
    messages: Message[];
    fetchChatHistory: (sessionId: string) => Promise<void>;
    sendMessage: (sessionId: string, message: string) => Promise<void>;
    deleteChatHistory: (sessionId: string) => Promise<void>;
    clearChatHistory: () => void;
}


export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    fetchChatHistory: async (sessionId) => {
        if (!sessionId) return
        try {
            const result = await api.get(`/chat/${sessionId}`)
            result.data.forEach((data: { role: "user" | "assistant", message: string }) => {
                const prevMessages = useChatStore.getState().messages;
                set({ messages: [...prevMessages, { from: data.role, text: data.message }] });
            });
        } catch (error) {
            console.error("Error fetching chat history:", error);
            set({ messages: [] })
        }
    },
    sendMessage: async (sessionId, message) => {
        if (!message.trim()) return;
        set({ messages: [...useChatStore.getState().messages, { from: "user", text: message.trim() }, { from: "assistant", text: "thinking..." }] });
        try {
            const result = await api.post(`/chat/${sessionId}`, { message });
            set({ messages: [...useChatStore.getState().messages.slice(0, -1), { from: "assistant", text: result.data.reply }] });
        }
        catch (error) {
            console.error("Error sending message:", error);
            set({ messages: [...useChatStore.getState().messages.slice(0, -1), { from: "assistant", text: "Sorry, there was an error processing your message." }] });
        }
    },
    deleteChatHistory: async (sessionId) => {
        try {
            await api.delete(`/chat/${sessionId}`);
            set({ messages: [] })
        } catch (error) {
            console.error('Error deleting chat history:', error);
            throw error
        }
    },
    clearChatHistory: () => set({ messages: [] })
}))
