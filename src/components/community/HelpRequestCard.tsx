"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommunityStore } from "@/stores/useCommunityStore";
import { HelpRequest } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ArrowUp, CheckCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function HelpRequestCard({ request }: { request: HelpRequest }) {
    const { upvoteRequest, acceptMission, resolveRequest, openChat } = useCommunityStore();

    const statusColor = {
        open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        assigned: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }[request.status];

    return (
        <motion.div layout whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <Card className="glass">
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">{request.description}</p>
                        </div>
                        <Badge className={statusColor}>{request.status}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="capitalize">{request.category}</span>
                        <span>{formatDistanceToNow(new Date(request.createdAt))} ago</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        {request.status === "open" && (
                            <>
                                <Button variant="outline" size="sm" onClick={() => upvoteRequest(request.id)}>
                                    <ArrowUp className="h-4 w-4 mr-1" /> {request.urgency || 0}
                                </Button>
                                <Button variant="default" size="sm" onClick={() => acceptMission(request.id)}>
                                    <Shield className="h-4 w-4 mr-1" /> Accept Mission
                                </Button>
                            </>
                        )}
                        {request.status === "assigned" && (
                            <Button variant="outline" size="sm" onClick={() => resolveRequest(request.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" /> Mark Resolved
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => openChat(request.id)}>
                            <MessageCircle className="h-4 w-4 mr-1" /> Chat
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}