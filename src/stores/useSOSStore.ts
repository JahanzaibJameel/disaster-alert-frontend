import { create } from "zustand";
import { SOS } from "@/types";
import { api } from "@/lib/api";
import { db } from "@/lib/db";

interface SOSState {
    sosList: SOS[];
    sendSOS: (data: Omit<SOS, "id" | "createdAt" | "status">) => Promise<void>;
    fetchSOSList: () => Promise<void>;
    syncQueuedSOS: () => Promise<void>;
}

export const useSOSStore = create<SOSState>((set) => ({
    sosList: [],
    sendSOS: async (data) => {
        const sos = await api.createSOS(data);
        set((state) => ({ sosList: [...state.sosList, sos] }));
    },
    fetchSOSList: async () => {
        const list = await api.getSOSList();
        set({ sosList: list });
    },
    syncQueuedSOS: async () => {
        const queued = await db.sosQueue.toArray();
        for (const item of queued) {
            try {
                const sos = await api.createSOS(item);
                await db.sosQueue.delete(item.id!);
                set((state) => ({ sosList: [...state.sosList, sos] }));
            } catch {
                break;
            }
        }
    },
}));