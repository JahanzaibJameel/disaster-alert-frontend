"use client";
import { useEffect } from "react";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { useSOSStore } from "@/stores/useSOSStore";

export default function OfflineSync() {
    const { isOnline } = useNetworkStatus();
    const syncQueuedSOS = useSOSStore((s) => s.syncQueuedSOS);

    useEffect(() => {
        if (isOnline) {
            syncQueuedSOS();
        }
    }, [isOnline, syncQueuedSOS]);

    return null;
}
