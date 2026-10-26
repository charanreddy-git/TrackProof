import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { targetIcon, captainIcon } from "./MapIcons";
import { useLiveLocation } from "../hooks";
import { MapPinIcon, NavigationIcon } from "./Icons";

interface LiveTrackerProps {
  taskId: string;
  targetLat: number;
  targetLng: number;
  height?: string;
}

function distanceMetres(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(metres: number): string {
  if (metres < 100) return "At the property";
  if (metres < 1000) return `${Math.round(metres)} m away`;
  return `${(metres / 1000).toFixed(1)} km away`;
}

function FitBounds({
  target,
  captain,
}: {
  target: [number, number];
  captain: [number, number] | null;
}) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (captain && !hasFitted.current) {
      map.fitBounds(L.latLngBounds([target, captain]), { padding: [56, 56], maxZoom: 16 });
      hasFitted.current = true;
    }
    if (!captain) hasFitted.current = false;
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
  const captainPos: [number, number] | null = liveLocation
    ? [liveLocation.latitude, liveLocation.longitude]
    : null;
  const lastUpdated = liveLocation ? new Date(liveLocation.timestamp) : null;

  const targetPos: [number, number] = [targetLat, targetLng];
  const distance = captainPos
    ? distanceMetres(targetLat, targetLng, captainPos[0], captainPos[1])
    : null;

  return (
    <div className="flex flex-col">
      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-150 px-4 py-3">
        <div className="flex items-center gap-4 text-[12px]">
          <span className="inline-flex items-center gap-1.5 font-medium text-surface-600">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Property
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-surface-600">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Inspector
          </span>
        </div>

        <div className="flex items-center gap-2">
          {captainPos ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-semibold text-success-700 ring-1 ring-success-100">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-success-500" />
              Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-medium text-surface-500">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-surface-400" />
              Waiting
            </span>
          )}
          {lastUpdated && (
            <span className="text-[11px] text-surface-500">
              {lastUpdated.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      {/* Distance strip */}
      {distance !== null && (
        <div className="flex items-center gap-2 border-b border-surface-150 bg-surface-50 px-4 py-2.5">
          <NavigationIcon size={14} className="flex-shrink-0 text-primary-700" />
          <p className="text-[12px] font-medium text-surface-700">
            {formatDistance(distance)}
            {distance > 100 && (
              <span className="ml-1 font-normal text-surface-500">
                · a photo can only be taken within 100 m
              </span>
            )}
          </p>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={targetPos}
        zoom={15}
        style={{ height, width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={targetPos} icon={targetIcon}>
          <Popup>Property location</Popup>
        </Marker>
        <Circle
          center={targetPos}
          radius={100}
          pathOptions={{
            color: "#dc2626",
            fillColor: "#dc2626",
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: "6, 4",
          }}
        />

        {captainPos && (
          <Marker position={captainPos} icon={captainIcon}>
            <Popup>
              Inspector location
              {liveLocation && (
                <span className="mt-1 block text-[11px] text-gray-500">
                  Updated:{" "}
                  {new Date(liveLocation.timestamp).toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </Popup>
          </Marker>
        )}

        <FitBounds target={targetPos} captain={captainPos} />
      </MapContainer>

      {/* Waiting state */}
      {!captainPos && (
        <div className="flex items-start gap-2 border-t border-surface-150 px-4 py-3">
          <MapPinIcon size={14} className="mt-0.5 flex-shrink-0 text-surface-500" />
          <p className="text-[12px] leading-relaxed text-surface-500">
            Waiting for the inspector to start sharing their location. This page
            updates automatically — no need to refresh.
          </p>
        </div>
      )}
    </div>
  );
}
