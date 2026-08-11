import { create } from "zustand";
import { HelpRequest } from "@/types";
import { api } from "@/lib/api";

interface ChatMessage {
    id: string;
    requestId: string;
    sender: string;
    text: string;
    timestamp: string;
}

interface CommunityState {
    requests: HelpRequest[];
    loading: boolean;
    selectedChatId: string | null;
    chatMessages: ChatMessage[];
    fetchRequests: () => Promise<void>;
    createRequest: (data: Omit<HelpRequest, "id" | "createdAt" | "status">) => Promise<void>;
    upvoteRequest: (id: string) => Promise<void>;
    acceptMission: (id: string) => Promise<void>;
    resolveRequest: (id: string) => Promise<void>;
    openChat: (requestId: string) => void;
    closeChat: () => void;
    sendMessage: (text: string) => Promise<void>;
    fetchChatMessages: () => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
    requests: [],
    loading: false,
    selectedChatId: null,
    chatMessages: [],

    fetchRequests: async () => {
        set({ loading: true });
        const data = await api.getHelpRequests();
        set({ requests: data, loading: false });
    },

    createRequest: async (data) => {
        await api.createHelpRequest(data);
        await get().fetchRequests();
    },

    upvoteRequest: async (id) => {
        const req = get().requests.find(r => r.id === id);
        if (req) {
            await api.updateHelpRequest(id, { urgency: (req.urgency || 0) + 1 });
            await get().fetchRequests();
        }
    },

    acceptMission: async (id) => {
        await api.updateHelpRequest(id, { status: "assigned" });
        await get().fetchRequests();
    },

    resolveRequest: async (id) => {
        await api.updateHelpRequest(id, { status: "resolved" });
        await get().fetchRequests();
    },

    openChat: (requestId) => {
        set({ selectedChatId: requestId });
        get().fetchChatMessages();
    },

    closeChat: () => set({ selectedChatId: null, chatMessages: [] }),

    sendMessage: async (text) => {
        const { selectedChatId } = get();
        if (!selectedChatId) return;
        await api.sendChatMessage(selectedChatId, "You", text); // mock sender "You"
        await get().fetchChatMessages();
    },

    fetchChatMessages: async () => {
        const { selectedChatId } = get();
        if (!selectedChatId) return;
        const msgs = await api.getChatMessages(selectedChatId);
        set({ chatMessages: msgs });
    },
}));