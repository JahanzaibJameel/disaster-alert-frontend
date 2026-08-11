"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCommunityStore } from "@/stores/useCommunityStore"; 
import { X, Send } from "lucide-react";
import { format } from "date-fns";

export default function ChatWindow({ requestId, onClose }: { requestId: string; onClose: () => void }) {
    const { chatMessages, sendMessage, fetchChatMessages } = useCommunityStore();
    const bottomRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");

    useEffect(() => {
        fetchChatMessages();
        // Simulate incoming messages every 10 seconds
        const interval = setInterval(() => {
            const mockSender = "Responder";
            const texts = ["I'm on my way!", "Can you share your exact location?", "Help is arriving soon."];
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            // Directly push to api.chatMessages to simulate real‑time
            import("@/lib/api").then(({ api }) => {
                api.chatMessages.push({
                    id: Date.now().toString(),
                    requestId,
                    sender: mockSender,
                    text: randomText,
                    timestamp: new Date().toISOString(),
                });
                fetchChatMessages();
            });
        }, 8000);
        return () => clearInterval(interval);
    }, [requestId, fetchChatMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-50 w-80 md:w-96 glass rounded-2xl shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex justify-between items-center p-3 bg-red-500 text-white">
                <h3 className="font-semibold">Live Chat</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-red-600">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-3 space-y-2">
                {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.sender === "You"
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-200 dark:bg-gray-700 rounded-bl-none"
                            }`}>
                            <p>{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                                {format(new Date(msg.timestamp), "HH:mm")}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 flex gap-2">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1"
                />
                <Button size="icon" onClick={handleSend} className="bg-red-500 hover:bg-red-600">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
}