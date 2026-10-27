import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { pickIcon } from "./MapIcons";

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    label?: string;
    icon?: L.Icon | L.DivIcon;
  }>;
  className?: string;
  height?: string;
  children?: React.ReactNode;
}

export function MapView({
  center = [17.385, 78.486],
  zoom = 13,
  markers = [],
  className = "",
  height = "400px",
  children,
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`overflow-hidden ${className}`}
      style={{ height, width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={marker.position} icon={(marker.icon ?? pickIcon) as L.Icon}>
          {marker.label && <Popup>{marker.label}</Popup>}
        </Marker>
      ))}
      {children}
    </MapContainer>
  );
}

