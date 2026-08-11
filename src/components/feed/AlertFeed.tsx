"use client";
import { useEffect, useState } from "react";
import { useAlertStore } from "@/stores/useAlertStore";
import AlertCard from "./AlertCard";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const shimmer = `before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent`;

export default function AlertFeed() {
    const { alerts, loading, fetchAlerts } = useAlertStore();
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        if (alerts.length === 0) {
            const mock = [
                { id: "1", title: "Flood Warning", description: "River levels rising.", severity: "high", type: "flood", coordinates: [-74.006, 40.7128], radius: 5, startTime: new Date().toISOString() },
                { id: "2", title: "Earthquake Aftershock", description: "M3.5 aftershock.", severity: "medium", type: "earthquake", coordinates: [-122.4194, 37.7749], radius: 10, startTime: new Date().toISOString() },
            ];
            localStorage.setItem("alerts", JSON.stringify(mock));
        }
        fetchAlerts();
    }, [fetchAlerts, alerts.length]);

    // Simulated real‑time
    useEffect(() => {
        const interval = setInterval(() => {
            const newAlert = {
                id: Date.now().toString(),
                title: "New Alert " + new Date().toLocaleTimeString(),
                description: "Simulated real‑time alert.",
                severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)],
                type: ["flood", "earthquake", "wildfire", "storm"][Math.floor(Math.random() * 4)],
                coordinates: [-74.006 + Math.random() * 0.1, 40.7128 + Math.random() * 0.1],
                radius: 2,
                startTime: new Date().toISOString(),
            };
            const current = JSON.parse(localStorage.getItem("alerts") || "[]");
            current.push(newAlert);
            localStorage.setItem("alerts", JSON.stringify(current));
            fetchAlerts();
        }, 15000);
        return () => clearInterval(interval);
    }, [fetchAlerts]);

    const filtered = filter === "all" ? alerts : alerts.filter(a => a.severity === filter);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-0 left-0 right-0 md:relative md:w-80 max-h-64 overflow-y-auto glass m-4 rounded-xl p-4"
        >
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Live Alerts</h2>
                <div className="flex gap-1">
                    {["all", "critical", "high", "medium", "low"].map(sev => (
                        <Badge
                            key={sev}
                            variant={filter === sev ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                            onClick={() => setFilter(sev)}
                        >
                            {sev}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                {loading ? (
                    // Shimmer loading placeholders
                    <div className="space-y-2">
                        <div className={`h-20 bg-gray-200 dark:bg-gray-800 rounded-lg relative overflow-hidden ${shimmer}`} />
                        <div className={`h-20 bg-gray-200 dark:bg-gray-800 rounded-lg relative overflow-hidden ${shimmer}`} />
                    </div>
                ) : (
                    <AnimatePresence>
                        {filtered.map((alert, index) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                <AlertCard alert={alert} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
}