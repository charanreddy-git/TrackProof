import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useLiveLocation } from "../hooks/useSocket";
import { Badge } from "./ui/Badge";

const targetIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const captainIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LiveTrackerProps {
  taskId: string;
  targetLat: number;
  targetLng: number;
  height?: string;
}

function FitBounds({
  target,
  captain,
}: {
  target: [number, number];
  captain: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (captain) {
      const bounds = L.latLngBounds([target, captain]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [captain, target, map]);

  return null;
}

export function LiveTracker({
  taskId,
  targetLat,
  targetLng,
  height = "500px",
}: LiveTrackerProps) {
  const liveLocation = useLiveLocation(taskId);
  const [captainPos, setCaptainPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (liveLocation) {
      setCaptainPos([liveLocation.latitude, liveLocation.longitude]);
    }
  }, [liveLocation]);

  const targetPos: [number, number] = [targetLat, targetLng];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-surface-600">Target Location</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-surface-600">Captain Location</span>
        </div>
        {captainPos && (
          <Badge variant="success" dot>Live</Badge>
        )}
      </div>

      <MapContainer
        center={targetPos}
        zoom={15}
        style={{ height, width: "100%" }}
        className="rounded-xl overflow-hidden border border-surface-200"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Target location with 100m radius circle */}
        <Marker position={targetPos} icon={targetIcon}>
          <Popup>Target Location</Popup>
        </Marker>
        <Circle
          center={targetPos}
          radius={100}
          pathOptions={{
            color: "#ef4444",
            fillColor: "#ef4444",
            fillOpacity: 0.1,
            weight: 2,
            dashArray: "5, 5",
          }}
        />

        {/* Captain position (live) */}
        {captainPos && (
          <Marker position={captainPos} icon={captainIcon}>
            <Popup>
              Captain is here
              <br />
              <span className="text-xs text-gray-500">
                Last update:{" "}
                {liveLocation
                  ? new Date(liveLocation.timestamp).toLocaleTimeString()
                  : "N/A"}
              </span>
            </Popup>
          </Marker>
        )}

        <FitBounds target={targetPos} captain={captainPos} />
      </MapContainer>

      {!captainPos && (
        <div className="text-center py-4">
          <p className="text-sm text-surface-500 animate-pulse-soft">
            Waiting for captain's location updates...
          </p>
        </div>
      )}
    </div>
  );
}
