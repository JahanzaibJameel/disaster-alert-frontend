"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { Map, NavigationControl, Marker, Popup, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Supercluster from "supercluster";
import { useAlertStore } from "@/stores/useAlertStore";
import { useSOSStore } from "@/stores/useSOSStore";
import { motion } from "framer-motion";

type PointFeature = {
    type: "Feature";
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: {
        id: string;
        type: "alert" | "sos";
        severity?: string;
        sosType?: string;
        title?: string;
        description?: string;
        message?: string;
        cluster?: boolean;
        point_count?: number;
    };
};

function createSOSMarkerEl() {
    const el = document.createElement("div");
    el.className = "sos-marker";
    el.innerHTML = `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse-glow"></div>`;
    return el;
}

function createClusterMarkerEl(count: number) {
    const el = document.createElement("div");
    el.className = "cluster-marker";
    const size = Math.min(40 + count * 2, 60);
    el.innerHTML = `<div style="width:${size}px;height:${size}px" class="bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white">${count}</div>`;
    return el;
}

export default function MapView() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map | null>(null);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<{ name: string; lon: number; lat: number }[]>([]);
    const { alerts } = useAlertStore();
    const { sosList } = useSOSStore();

    const points: PointFeature[] = useMemo(() => {
        const alertPoints: PointFeature[] = alerts.map((alert) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: alert.coordinates },
            properties: {
                id: alert.id,
                type: "alert",
                severity: alert.severity,
                title: alert.title,
                description: alert.description,
            },
        }));
        const sosPoints: PointFeature[] = sosList.map((sos) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [sos.location.lng, sos.location.lat] },
            properties: {
                id: sos.id,
                type: "sos",
                sosType: sos.type,
                message: sos.message || "Help needed",
            },
        }));
        return [...alertPoints, ...sosPoints];
    }, [alerts, sosList]);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;
        setWorkerUrl("https://cdn.jsdelivr.net/npm/maplibre-gl@6.2.0/dist/maplibre-gl-worker.js");
        map.current = new Map({
            container: mapContainer.current,
            style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
            center: [-74.006, 40.7128],
            zoom: 10,
        });
        map.current.addControl(new NavigationControl(), "top-right");
    }, []);

    useEffect(() => {
        if (!map.current) return;
        document.querySelectorAll(".maplibregl-marker").forEach((m) => m.remove());

        const index = new Supercluster({ radius: 60, maxZoom: 16 });
        index.load(points);
        const bounds = map.current.getBounds();
        const bbox: [number, number, number, number] = [
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth(),
        ];
        const zoom = Math.floor(map.current.getZoom());
        const clusters = index.getClusters(bbox, zoom);

        clusters.forEach((cluster) => {
            const [lon, lat] = (cluster as PointFeature & { geometry: { coordinates: [number, number] } }).geometry.coordinates;
            const props = (cluster as PointFeature & { properties: PointFeature["properties"] }).properties;

            if (props.cluster) {
                const el = createClusterMarkerEl(props.point_count ?? 0);
                new Marker({ element: el })
                    .setLngLat([lon, lat])
                    .setPopup(
                        new Popup().setHTML(
                            `<div class="text-center"><strong>${props.point_count} incidents</strong></div>`
                        )
                    )
                    .addTo(map.current!);
            } else if (props.type === "alert") {
                const color = props.severity === "critical" ? "#ef4444" : "#f59e0b";
                new Marker({ color })
                    .setLngLat([lon, lat])
                    .setPopup(
                        new Popup().setHTML(`
                            <div>
                                <strong>${props.title}</strong>
                                <p class="text-sm text-gray-600 mt-1">${props.description}</p>
                                <button onclick="alert('I\\'m safe clicked')" class="mt-2 text-xs bg-green-500 text-white px-2 py-1 rounded">I'm safe</button>
                            </div>
                        `)
                    )
                    .addTo(map.current!);
            } else if (props.type === "sos") {
                const el = createSOSMarkerEl();
                new Marker({ element: el })
                    .setLngLat([lon, lat])
                    .setPopup(
                        new Popup().setHTML(`
                            <div>
                                <strong class="text-red-500">SOS: ${props.sosType}</strong>
                                <p class="text-sm text-gray-600 mt-1">${props.message}</p>
                                <button onclick="alert('Volunteer clicked')" class="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">Volunteer</button>
                            </div>
                        `)
                    )
                    .addTo(map.current!);
            }
        });
    }, [points]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        try {
            const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(search)}`);
            const data = await res.json();
            setSearchResults(data.features.slice(0, 5).map((f: { properties: { name: string }; geometry: { coordinates: [number, number] } }) => ({
                name: f.properties.name,
                lon: f.geometry.coordinates[0],
                lat: f.geometry.coordinates[1],
            })));
        } catch {
            setSearchResults([]);
        }
    };

    return (
        <div className="relative h-full w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                ref={mapContainer}
                className="h-full w-full rounded-2xl overflow-hidden shadow-2xl"
            />
            <form onSubmit={handleSearch} className="absolute top-4 left-4 z-10 w-72">
                <input
                    type="text"
                    placeholder="Search location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 rounded-lg glass border-0 shadow-lg text-sm focus:ring-2 focus:ring-red-500"
                />
                {searchResults.length > 0 && (
                    <div className="mt-1 rounded-lg glass shadow-lg overflow-hidden">
                        {searchResults.map((r, i) => (
                            <button
                                key={i}
                                type="button"
                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 border-b last:border-0"
                                onClick={() => {
                                    map.current?.flyTo({ center: [r.lon, r.lat], zoom: 14 });
                                    setSearchResults([]);
                                    setSearch("");
                                }}
                            >
                                {r.name}
                            </button>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
}
