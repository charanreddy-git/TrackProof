import https from "https";
import http from "http";
import type { IncomingMessage } from "http";
import { URL } from "url";
import { ApiError } from "./api-error";

/**
 * Parses coordinates (latitude & longitude) from a Google Maps URL.
 * Supports multiple URL formats:
 * - https://www.google.com/maps/@12.9716,77.5946,15z
 * - https://maps.google.com/?q=12.9716,77.5946
 * - https://www.google.com/maps/place/12.9716,77.5946
 * - https://www.google.com/maps/...!3d12.9715987!4d77.5945627
 */
export function parseCoordinates(
  url: string
): { latitude: number; longitude: number } | null {
  const patterns: RegExp[] = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&](?:q|ll|cbll)=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
  }

  return null;
}

/**
 * Follows HTTP redirects recursively using Node's native HTTP/HTTPS modules.
 * Stops after maxRedirects to prevent infinite redirect loops.
 */
export async function followRedirects(
  urlStr: string,
  maxRedirects = 6
): Promise<string> {
  let currentUrl = urlStr;

  for (let i = 0; i < maxRedirects; i++) {
    if (
      !currentUrl.startsWith("http://") &&
      !currentUrl.startsWith("https://")
    ) {
      break;
    }

    const parsed = new URL(currentUrl);
    const client = parsed.protocol === "https:" ? https : http;

    const response = await new Promise<IncomingMessage>((resolve, reject) => {
      const req = client.get(
        currentUrl,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; InstantLocate/1.0; +https://instantlocate.app)",
          },
        },
        (res) => {
          req.destroy();
          resolve(res);
        }
      );
      req.on("error", reject);
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error("Request timeout following redirect"));
      });
    });

    const { statusCode, headers } = response;
    if (statusCode !== undefined && statusCode >= 300 && statusCode < 400 && headers.location) {
      currentUrl = new URL(headers.location, currentUrl).toString();
    } else {
      break;
    }
  }

  return currentUrl;
}

/**
 * Resolves a Google Maps URL to coordinates.
 * Validates the URL is a Google Maps link, attempts direct parsing,
 * then falls back to following redirects for shortened URLs.
 *
 * @throws {ApiError} if URL is not a Google Maps link or coordinates cannot be extracted
 */
export async function resolveGoogleMapsUrl(
  url: string
): Promise<{ latitude: number; longitude: number }> {
  const isGoogleMaps =
    url.includes("maps.google.com") ||
    url.includes("google.com/maps") ||
    url.includes("goo.gl/maps") ||
    url.includes("maps.app.goo.gl");

  if (!isGoogleMaps) {
    throw ApiError.badRequest(
      "Invalid URL. Only Google Maps links are supported."
    );
  }

  const direct = parseCoordinates(url);
  if (direct) return direct;

  let resolvedUrl: string;
  try {
    resolvedUrl = await followRedirects(url);
  } catch {
    throw ApiError.badRequest(
      "Unable to resolve Google Maps link. Verify the URL is publicly accessible."
    );
  }

  const fromRedirect = parseCoordinates(resolvedUrl);
  if (!fromRedirect) {
    throw ApiError.badRequest(
      "Could not extract coordinates from the provided Google Maps link."
    );
  }

  return fromRedirect;
}
