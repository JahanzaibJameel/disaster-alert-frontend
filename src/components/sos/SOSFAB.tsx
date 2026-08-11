"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSOSStore } from "@/stores/useSOSStore";
import useLocation from "@/hooks/useLocation";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { db } from "@/lib/db";
import { toast } from "react-hot-toast";
import { AlertTriangle, Heart, Flame, Waves, HelpCircle, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useMounted from "@/hooks/useMounted";

const emergencyTypes = [
    { id: "medical", label: "Medical", icon: Heart, color: "rose" },
    { id: "fire", label: "Fire", icon: Flame, color: "orange" },
    { id: "flood", label: "Flood", icon: Waves, color: "blue" },
    { id: "other", label: "Other", icon: HelpCircle, color: "gray" },
] as const;

const SAFETY_TIMER_SECONDS = 10;

export default function SOSFAB() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"type" | "confirm" | "timer" | "sent" | "queued">("type");
    const [selectedType, setSelectedType] = useState<typeof emergencyTypes[number]["id"]>("medical");
    const [countdown, setCountdown] = useState(SAFETY_TIMER_SECONDS);
    const { location } = useLocation();
    const { isOnline } = useNetworkStatus();
    const sendSOS = useSOSStore((s) => s.sendSOS);
    const mounted = useMounted();

    const handleSend = useCallback(async () => {
        if (!location) {
            toast.error("Location not available");
            setStep("confirm");
            return;
        }
        try {
            if (!isOnline) {
                await db.sosQueue.add({
                    userId: "mock-user",
                    location,
                    type: selectedType,
                    message: "",
                });
                setStep("queued");
                toast.success("SOS queued for when you're back online.");
                setTimeout(() => {
                    setOpen(false);
                    setStep("type");
                }, 3000);
                return;
            }
            await sendSOS({ userId: "mock-user", location, type: selectedType, message: "" });
            setStep("sent");
            toast.success("SOS sent! Help is on the way.");
            setTimeout(() => {
                setOpen(false);
                setStep("type");
            }, 3000);
        } catch {
            toast.error("Failed to send SOS");
            setStep("confirm");
        }
    }, [location, isOnline, selectedType, sendSOS]);

    useEffect(() => {
        if (step !== "timer") return;
        const timer = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) {
                    handleSend();
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [step, handleSend]);

    const handleConfirm = () => {
        setCountdown(SAFETY_TIMER_SECONDS);
        setStep("timer");
    };

    const cancelTimer = () => {
        setStep("confirm");
        setCountdown(SAFETY_TIMER_SECONDS);
    };

    return (
        <>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                className="fixed bottom-20 right-4 z-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-red-500 to-red-700 animate-pulse-glow"
                    size="icon"
                    aria-label="Send SOS"
                    onClick={() => setOpen(true)}
                >
                    <AlertTriangle className="h-8 w-8 text-white drop-shadow-lg" />
                </Button>
                <span className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping" />
            </motion.div>

            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setStep("type"); }}>
                <DialogContent className="sm:max-w-md glass border-0">
                    <DialogTitle className="sr-only">Send Emergency SOS</DialogTitle>
                    <AnimatePresence mode="wait">
                        {step === "type" && (
                            <motion.div
                                key="type"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-bold text-center">What&apos;s the emergency?</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {emergencyTypes.map((t) => (
                                        <motion.button
                                            key={t.id}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setSelectedType(t.id)}
                                            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-colors ${selectedType === t.id
                                                    ? `border-${t.color}-500 bg-${t.color}-50 dark:bg-${t.color}-950`
                                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <t.icon className={`h-8 w-8 text-${t.color}-500`} />
                                            <span className="mt-2 font-medium">{t.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                                <Button className="w-full" onClick={() => setStep("confirm")}>
                                    Continue
                                </Button>
                            </motion.div>
                        )}

                        {step === "confirm" && (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const TypeIcon = emergencyTypes.find(t => t.id === selectedType)?.icon ?? AlertTriangle;
                                        return <TypeIcon className="h-10 w-10 text-red-500" />;
                                    })()}
                                    <div>
                                        <h3 className="font-semibold capitalize">{selectedType} Emergency</h3>
                                        {mounted && location && (
                                            <p className="text-sm text-muted-foreground">
                                                📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm">Your location will be shared with responders. Confirm to send SOS.</p>
                                <div className="flex gap-2">
                                    <Button variant="destructive" className="flex-1" onClick={handleConfirm}>
                                        <Send className="h-4 w-4 mr-2" /> Send SOS
                                    </Button>
                                    <Button variant="outline" onClick={() => setStep("type")}>Back</Button>
                                </div>
                            </motion.div>
                        )}

                        {step === "timer" && (
                            <motion.div
                                key="timer"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center space-y-4 py-8"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
                                >
                                    <span className="text-2xl font-bold text-red-600">{countdown}</span>
                                </motion.div>
                                <h3 className="text-xl font-bold">Sending in {countdown}s</h3>
                                <p className="text-muted-foreground">Cancel if this was accidental.</p>
                                <Button variant="outline" onClick={cancelTimer} className="gap-2">
                                    <X className="h-4 w-4" /> Cancel
                                </Button>
                            </motion.div>
                        )}

                        {step === "sent" && (
                            <motion.div
                                key="sent"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center space-y-4 py-8"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
                                >
                                    <Heart className="h-8 w-8 text-green-600" />
                                </motion.div>
                                <h3 className="text-xl font-bold">Help is on the way!</h3>
                                <p className="text-muted-foreground">Stay calm. Responders have been notified.</p>
                            </motion.div>
                        )}

                        {step === "queued" && (
                            <motion.div
                                key="queued"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center space-y-4 py-8"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="mx-auto h-16 w-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center"
                                >
                                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                                </motion.div>
                                <h3 className="text-xl font-bold">SOS Queued</h3>
                                <p className="text-muted-foreground">You are offline. SOS will be sent when you reconnect.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DialogContent>
            </Dialog>
        </>
    );
}
