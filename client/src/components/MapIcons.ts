import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const ICON_DEFAULTS = {
  shadowUrl: markerShadow,
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
};

export const targetIcon = new L.Icon({
  ...ICON_DEFAULTS,
  iconUrl: "/marker-icon-red.png",
});

export const captainIcon = new L.Icon({
  ...ICON_DEFAULTS,
  iconUrl: "/marker-icon-blue.png",
});

/** Alias for targetIcon — used in location picker for visual consistency */
export const pickIcon = targetIcon;
