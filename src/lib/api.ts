import { Alert, SOS, HelpRequest } from "@/types";
import { v4 as uuid } from "uuid";

export const api = {
    getAlerts: async (): Promise<Alert[]> => {
        return JSON.parse(localStorage.getItem("alerts") || "[]");
    },
    createSOS: async (data: Omit<SOS, "id" | "createdAt" | "status">): Promise<SOS> => {
        const sos: SOS = {
            ...data,
            id: uuid(),
            createdAt: new Date().toISOString(),
            status: "active",
        };
        const existing = JSON.parse(localStorage.getItem("sosList") || "[]");
        existing.push(sos);
        localStorage.setItem("sosList", JSON.stringify(existing));
        return sos;
    },
    getSOSList: async (): Promise<SOS[]> => {
        return JSON.parse(localStorage.getItem("sosList") || "[]");
    },
    // Community Help Board
    getHelpRequests: async (): Promise<HelpRequest[]> => {
        return JSON.parse(localStorage.getItem("helpRequests") || "[]");
    },
    createHelpRequest: async (data: Omit<HelpRequest, "id" | "createdAt" | "status">): Promise<HelpRequest> => {
        const req: HelpRequest = { ...data, id: uuid(), createdAt: new Date().toISOString(), status: "open" };
        const list = JSON.parse(localStorage.getItem("helpRequests") || "[]");
        list.push(req);
        localStorage.setItem("helpRequests", JSON.stringify(list));
        return req;
    },
    updateHelpRequest: async (id: string, updates: Partial<HelpRequest>): Promise<HelpRequest> => {
        const list = JSON.parse(localStorage.getItem("helpRequests") || "[]");
        const index = list.findIndex((r: HelpRequest) => r.id === id);
        if (index === -1) throw new Error("Not found");
        list[index] = { ...list[index], ...updates };
        localStorage.setItem("helpRequests", JSON.stringify(list));
        return list[index];
    },
    // Simulated real‑time chat (in‑memory for demo)
    chatMessages: [] as { id: string; requestId: string; sender: string; text: string; timestamp: string }[],
    sendChatMessage: async (requestId: string, sender: string, text: string) => {
        const msg = { id: uuid(), requestId, sender, text, timestamp: new Date().toISOString() };
        api.chatMessages.push(msg);
        return msg;
    },
    getChatMessages: async (requestId: string) => {
        return api.chatMessages.filter(m => m.requestId === requestId);
    },

};