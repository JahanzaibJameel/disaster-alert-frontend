import { useState, useEffect } from "react";

export default function useLocation() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(() => {
        if (!navigator.geolocation) {
            return "Geolocation not supported";
        }
        return null;
    });

    useEffect(() => {
        if (!navigator.geolocation || error) return;
        const watcher = navigator.geolocation.watchPosition(
            (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => setError(err.message),
            { enableHighAccuracy: true, timeout: 10000 }
        );
        return () => navigator.geolocation.clearWatch(watcher);
    }, [error]);

    return { location, error };
}