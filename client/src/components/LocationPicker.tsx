import { useRef, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

function ClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationSelect,
  height = "350px",
}: LocationPickerProps) {
  const defaultCenter: [number, number] = [17.385, 78.486];
  const position = latitude !== null && longitude !== null ? [latitude, longitude] as [number, number] : null;

  const markerRef = useRef<L.Marker | null>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          onLocationSelect(latLng.lat, latLng.lng);
        }
      },
    }),
    [onLocationSelect]
  );

  return (
    <div className="space-y-2">
      <MapContainer
        center={position || defaultCenter}
        zoom={13}
        style={{ height, width: "100%" }}
        className="rounded-xl overflow-hidden border border-surface-200"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onLocationSelect={onLocationSelect} />
        {position && (
          <>
            <ChangeView center={position} />
            <Marker
              draggable={true}
              eventHandlers={eventHandlers}
              position={position}
              ref={markerRef}
              icon={pickIcon}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
