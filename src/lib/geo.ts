// Turns ZIP codes and "City, ST" into map coordinates, and measures distances.
// Coordinates are the center of the ZIP or town, never a street address.
import zipcodes from "zipcodes";

export type Point = { lat: number; lng: number };
export type Place = Point & { label: string };

export function locate({ zip, city, state }: { zip?: string; city?: string; state?: string }): Point | null {
  const byZip = zip ? zipcodes.lookup(zip.slice(0, 5)) : undefined;
  if (byZip) return { lat: byZip.latitude, lng: byZip.longitude };
  if (city && state) {
    const matches = zipcodes.lookupByName(city.trim(), state.trim().toUpperCase());
    if (matches.length > 0) {
      // A city has many ZIPs; average them to get roughly the middle of town.
      const lat = matches.reduce((s, m) => s + m.latitude, 0) / matches.length;
      const lng = matches.reduce((s, m) => s + m.longitude, 0) / matches.length;
      return { lat, lng };
    }
  }
  return null;
}

// Understands "97477", "Eugene, OR" and "Eugene OR". Returns null if it can't tell where.
export function parseNear(text: string): Place | null {
  const t = text.trim();
  const zip = t.match(/^\d{5}$/)?.[0];
  if (zip) {
    const info = zipcodes.lookup(zip);
    return info ? { lat: info.latitude, lng: info.longitude, label: `${info.city}, ${info.state} ${zip}` } : null;
  }
  const m = t.match(/^(.+?)[,\s]+([A-Za-z]{2})$/);
  if (m) {
    const point = locate({ city: m[1], state: m[2] });
    if (point) return { ...point, label: `${m[1].trim()}, ${m[2].toUpperCase()}` };
  }
  return null;
}

export function milesBetween(a: Point, b: Point): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

export const RADIUS_OPTIONS = [5, 10, 25, 50, 100];
export const DEFAULT_RADIUS = 25;
