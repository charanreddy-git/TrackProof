import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useLiveLocation } from "../hooks/useSocket";

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
      map.fitBounds(bounds, { padding: [60, 60] });
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (liveLocation) {
      setTimeout(() => {
        setCaptainPos([liveLocation.latitude, liveLocation.longitude]);
        setLastUpdated(new Date());
      }, 0);
    }
  }, [liveLocation]);

  const targetPos: [number, number] = [targetLat, targetLng];

  return (
    <div className="flex flex-col">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100">
        <div className="flex items-center gap-4 text-[12.5px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
            <span className="text-surface-600 font-medium">Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-surface-600 font-medium">Captain</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {captainPos ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11.5px] font-semibold rounded-full ring-1 ring-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
              Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-100 text-surface-500 text-[11.5px] font-medium rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-pulse-soft" />
              Waiting
            </span>
          )}
          {lastUpdated && (
            <span className="text-[11px] text-surface-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={targetPos}
        zoom={15}
        style={{ height, width: "100%" }}
        className="flex-1"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={targetPos} icon={targetIcon}>
          <Popup>Target Location</Popup>
        </Marker>
        <Circle
          center={targetPos}
          radius={100}
          pathOptions={{
            color: "#ef4444",
            fillColor: "#ef4444",
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: "6, 4",
          }}
        />

        {captainPos && (
          <Marker position={captainPos} icon={captainIcon}>
            <Popup>
              Captain is here
              {liveLocation && (
                <span className="block text-[11px] text-gray-500 mt-1">
                  Updated: {new Date(liveLocation.timestamp).toLocaleTimeString()}
                </span>
              )}
            </Popup>
          </Marker>
        )}

        <FitBounds target={targetPos} captain={captainPos} />
      </MapContainer>

      {/* Waiting state */}
      {!captainPos && (
        <div className="px-4 py-3 border-t border-surface-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-surface-300 animate-pulse-soft flex-shrink-0" />
          <p className="text-[12.5px] text-surface-500">
            Waiting for captain's location — updates appear automatically
          </p>
        </div>
      )}
    </div>
  );
}
