import MapView from "@/components/map/MapView";
import AlertFeed from "@/components/feed/AlertFeed";
import SOSFAB from "@/components/sos/SOSFAB";

export default function Dashboard() {
    return (
        <div className="relative h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)]">
            <MapView />
            <SOSFAB />
            <AlertFeed />
        </div>
    );
}