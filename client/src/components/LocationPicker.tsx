import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const pickIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
  height?: string;
}

function ClickHandler({
  onLocationSelect,
  setPosition,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export function LocationPicker({
  onLocationSelect,
  initialPosition = [17.385, 78.486],
  height = "400px",
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition
  );

  return (
    <div className="space-y-2">
      <p className="text-sm text-surface-500">
        Click on the map to select the target location
      </p>
      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{ height, width: "100%" }}
        className="rounded-xl overflow-hidden border border-surface-200"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler
          onLocationSelect={onLocationSelect}
          setPosition={setPosition}
        />
        {position && <Marker position={position} icon={pickIcon} />}
      </MapContainer>
      {position && (
        <p className="text-xs text-surface-500 font-mono">
          📍 {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      )}
    </div>
  );
}
