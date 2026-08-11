export interface SOS {
    id: string;
    userId: string;
    location: { lat: number; lng: number };
    type: "medical" | "fire" | "flood" | "other";
    message?: string;
    createdAt: string;
    status: "active" | "responded" | "cancelled";
}

export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    type: "flood" | "earthquake" | "wildfire" | "storm";
    coordinates: [number, number];
    radius: number;
    startTime: string;
    endTime?: string;
}

export interface HelpRequest {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: "water" | "medical" | "shelter" | "rescue";
    location: { lat: number; lng: number };
    status: "open" | "assigned" | "resolved";
    urgency: number;
    createdAt: string;
}