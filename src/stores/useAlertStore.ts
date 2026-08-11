import { create } from "zustand";
import { Alert } from "@/types";
import { api } from "@/lib/api";

interface AlertState {
    alerts: Alert[];
    loading: boolean;
    fetchAlerts: () => Promise<void>;
}

export const useAlertStore = create<AlertState>((set) => ({
    alerts: [],
    loading: false,
    fetchAlerts: async () => {
        set({ loading: true });
        const data = await api.getAlerts();
        set({ alerts: data, loading: false });
    },
}));