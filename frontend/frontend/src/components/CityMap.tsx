import { useEffect, useRef } from "react";

import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import type { Camera } from "../types/detection";

interface CityMapProps {
  cameras: Camera[];
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

function CityMap({ cameras }: CityMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !MAPBOX_TOKEN) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [106.704, 10.774],
      zoom: 13,
    });

    cameras.forEach((camera) => {
      new mapboxgl.Marker()
        .setLngLat([camera.location.lng, camera.location.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<strong>${camera.name}</strong><br/>${camera.status}`,
          ),
        )
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [cameras]);

  if (!MAPBOX_TOKEN) {
    return <div className="map-placeholder">Add VITE_MAPBOX_TOKEN to .env</div>;
  }

  return <div ref={containerRef} className="city-map" />;
}

export default CityMap;
