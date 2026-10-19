"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export type MapPoint = { id: string; name: string; lat: number; lng: number; place: string };

// OpenStreetMap map. Businesses show as soft circles around their town/ZIP center,
// not pins on a street address, since we only know the general area.
export default function BusinessMap({ points, center, className = "" }: {
  points: MapPoint[];
  center?: { lat: number; lng: number };
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const key = JSON.stringify([points.map((p) => p.id), center]);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    // Leaflet touches `window`, so load it only in the browser.
    import("leaflet").then((L) => {
      if (cancelled || !box.current) return;
      map = L.map(box.current, { scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const brand = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#1f7a54";
      for (const p of points) {
        const popup = document.createElement("div");
        const link = document.createElement("a");
        link.href = `/b/${p.id}`;
        link.textContent = p.name;
        link.style.fontWeight = "600";
        const place = document.createElement("div");
        place.textContent = p.place;
        popup.append(link, place);
        L.circleMarker([p.lat, p.lng], {
          radius: 9,
          color: "#fff",
          weight: 2,
          fillColor: brand,
          fillOpacity: 0.9,
        })
          .bindPopup(popup)
          .addTo(map);
      }

      if (points.length > 1) {
        map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), { padding: [40, 40], maxZoom: 12 });
      } else {
        const c = center ?? points[0] ?? { lat: 39.8, lng: -98.6 }; // middle of the US
        map.setView([c.lat, c.lng], points.length || center ? 11 : 4);
      }
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <div ref={box} className={`z-0 overflow-hidden rounded-xl bg-subtle ${className}`} />;
}
