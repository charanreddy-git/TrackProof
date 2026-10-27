import L from "leaflet";

const PIN_TEMPLATE = (fill: string, dot: string, ring: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44" fill="none" style="filter: drop-shadow(0 4px 6px rgba(22,30,24,.28))">
  <path d="M17 2.5c-8 0-14.5 6.3-14.5 14 0 10.4 14.5 24 14.5 24s14.5-13.6 14.5-24c0-7.7-6.5-14-14.5-14Z" fill="${fill}" stroke="${ring}" stroke-width="2"/>
  <circle cx="17" cy="16.5" r="6" fill="${dot}"/>
</svg>`;

/**
 * Brand map pins. Leaflet expects an L.Icon; a divIcon keeps the marker crisp
 * at any pixel density without shipping extra image assets.
 */
export const targetIcon = L.divIcon({
  className: "tp-map-pin",
  html: PIN_TEMPLATE("#0f4a30", "#ffc400", "#ffffff"),
  iconSize: [34, 44],
  iconAnchor: [17, 43],
  popupAnchor: [0, -38],
});

export const captainIcon = L.divIcon({
  className: "tp-map-pin",
  html: PIN_TEMPLATE("#ffc400", "#0f4a30", "#ffffff"),
  iconSize: [34, 44],
  iconAnchor: [17, 43],
  popupAnchor: [0, -38],
});

/** Alias for targetIcon — used in location picker for visual consistency */
export const pickIcon = targetIcon;
