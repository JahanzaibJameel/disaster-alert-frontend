import { useEffect, useRef, useCallback } from "react";

type EventCallback = (data: unknown) => void;

interface RealtimeOptions {
    onAlert?: EventCallback;
    onSOS?: EventCallback;
    onChat?: EventCallback;
}

export default function useRealtime({ onAlert, onSOS, onChat }: RealtimeOptions) {
    const callbacksRef = useRef({ onAlert, onSOS, onChat });

    useEffect(() => {
        callbacksRef.current = { onAlert, onSOS, onChat };
    }, [onAlert, onSOS, onChat]);

    const simulateEvent = useCallback((type: "alert" | "sos" | "chat", data: unknown) => {
        if (type === "alert" && callbacksRef.current.onAlert) {
            callbacksRef.current.onAlert(data);
        } else if (type === "sos" && callbacksRef.current.onSOS) {
            callbacksRef.current.onSOS(data);
        } else if (type === "chat" && callbacksRef.current.onChat) {
            callbacksRef.current.onChat(data);
        }
    }, []);

    return { simulateEvent };
}
