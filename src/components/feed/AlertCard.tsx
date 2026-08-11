import { Alert } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function AlertCard({ alert }: { alert: Alert }) {
    const severityColor = {
        low: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-orange-100 text-orange-800",
        critical: "bg-red-100 text-red-800",
    }[alert.severity];

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{alert.title}</h3>
                    <Badge className={severityColor}>{alert.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(alert.startTime))} ago
                </p>
            </CardContent>
        </Card>
    );
}