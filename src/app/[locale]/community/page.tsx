"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCommunityStore } from "@/stores/useCommunityStore";
import HelpRequestCard from "@/components/community/HelpRequestCard";
import ChatWindow from "@/components/community/ChatWindow";
import { Plus, X } from "lucide-react";

export default function CommunityPage() {
    const {
        requests,
        loading,
        fetchRequests,
        createRequest,
        selectedChatId,
        closeChat,
    } = useCommunityStore();
    const seededRef = useRef(false);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState<"water" | "medical" | "shelter" | "rescue">("water");
    const [filter, setFilter] = useState<"all" | "open" | "assigned" | "resolved">("all");

    useEffect(() => {
        fetchRequests();
        if (!seededRef.current && requests.length === 0) {
            seededRef.current = true;
            const mock = [
                { userId: "user1", title: "Need drinking water", description: "Family of 4 stranded.", category: "water" as const, location: { lat: 40.7128, lng: -74.006 }, urgency: 3 },
                { userId: "user2", title: "Medical assistance", description: "Elderly person needs insulin.", category: "medical" as const, location: { lat: 40.7130, lng: -74.005 }, urgency: 5 },
            ];
            mock.forEach(req => createRequest(req));
        }
    }, [createRequest, fetchRequests, requests.length]);

    const handleSubmit = async () => {
        if (!title.trim()) return;
        await createRequest({
            userId: "mock-user",
            title,
            description: desc,
            category,
            location: { lat: 40.7128, lng: -74.006 },
            urgency: 1,
        });
        setTitle("");
        setDesc("");
        setShowForm(false);
    };

    const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6 relative">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center"
            >
                Community Help Board
            </motion.h1>

            {/* Filter & Create Button */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {(["all", "open", "assigned", "resolved"] as const).map(f => (
                        <Badge
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </Badge>
                    ))}
                </div>
                <Button onClick={() => setShowForm(true)} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Ask for Help
                </Button>
            </div>

            {/* New Request Form (Slide‑in) */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">New Help Request</h3>
                                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                            <Input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
                            <select
                                className="w-full p-2 rounded-lg border bg-background"
                                value={category}
                                onChange={e => setCategory(e.target.value as "water" | "medical" | "shelter" | "rescue")}
                            >
                                <option value="water">Water</option>
                                <option value="medical">Medical</option>
                                <option value="shelter">Shelter</option>
                                <option value="rescue">Rescue</option>
                            </select>
                            <Button onClick={handleSubmit} className="w-full">Post Request</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Requests List */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-muted-foreground">Loading...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-center text-muted-foreground">No requests yet.</p>
                ) : (
                    <AnimatePresence>
                        {filtered.map((req, index) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <HelpRequestCard request={req} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Chat Window Overlay */}
            <AnimatePresence>
                {selectedChatId && (
                    <ChatWindow requestId={selectedChatId} onClose={closeChat} />
                )}
            </AnimatePresence>
        </div>
    );
}