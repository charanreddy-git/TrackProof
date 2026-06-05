import https from "https";
import http from "http";
import { URL } from "url";

/**
 * Parses coordinates (latitude & longitude) from a Google Maps URL.
 * Supports multiple URL formats:
 * - https://www.google.com/maps/@12.9716,77.5946,15z
 * - https://maps.google.com/?q=12.9716,77.5946
 * - https://www.google.com/maps/place/12.9716,77.5946
 * - https://www.google.com/maps/...data=!3m1!4b1!4m5!3m4!1s...!8m2!3d12.9715987!4d77.5945627
 */
export function parseCoordinates(url: string): { latitude: number; longitude: number } | null {
  // Regex 1: Matches /@12.9716,77.5946
  const regex1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match1 = url.match(regex1);
  if (match1) {
    const lat = parseFloat(match1[1]);
    const lng = parseFloat(match1[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // Regex 2: Matches ?q=12.9716,77.5946 or ll=12.9716,77.5946
  const regex2 = /[?&](q|ll|cbll)=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match2 = url.match(regex2);
  if (match2) {
    const lat = parseFloat(match2[2]);
    const lng = parseFloat(match2[3]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // Regex 3: Matches /place/12.9716,77.5946
  const regex3 = /\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match3 = url.match(regex3);
  if (match3) {
    const lat = parseFloat(match3[1]);
    const lng = parseFloat(match3[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // Regex 4: Matches !3d12.9715987!4d77.5945627
  const regex4 = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
  const match4 = url.match(regex4);
  if (match4) {
    const lat = parseFloat(match4[1]);
    const lng = parseFloat(match4[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  return null;
}

/**
 * Follows HTTP redirects recursively using Node's native HTTP/HTTPS modules.
 * Stops after maxRedirects to avoid infinite redirect loops.
 */
export async function followRedirects(urlStr: string, maxRedirects = 6): Promise<string> {
  let currentUrl = urlStr;
  
  for (let i = 0; i < maxRedirects; i++) {
    // If it doesn't start with http/https, we cannot follow it
    if (!currentUrl.startsWith("http://") && !currentUrl.startsWith("https://")) {
      break;
    }

    const parsed = new URL(currentUrl);
    const client = parsed.protocol === "https:" ? https : http;

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    const res = await new Promise<any>((resolve, reject) => {
      const req = client.get(currentUrl, { headers }, (response) => {
        req.destroy();
        resolve(response);
      });
      req.on("error", (err) => reject(err));
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });
    });

    const status = res.statusCode;
    if (status >= 300 && status < 400 && res.headers.location) {
      currentUrl = new URL(res.headers.location, currentUrl).toString();
    } else {
      break;
    }
  }
  
  return currentUrl;
}
