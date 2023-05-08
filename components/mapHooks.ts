import mapboxgl, { Map, Marker, Popup } from "mapbox-gl";
import { create } from "zustand";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapState {
  map: Map | null;
  mapContainerRef: React.RefObject<HTMLDivElement> | null;
  setMap: (map: Map | null) => void;
  setMapContainerRef: (
    mapContainerRef: React.RefObject<HTMLDivElement> | null
  ) => void;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  mapContainerRef: null,
  setMap: (map) => set({ map }),
  setMapContainerRef: (mapContainerRef) => set({ mapContainerRef }),
}));

export const initializeMap = () => {
  const mapContainerRef = useMapStore.getState().mapContainerRef;

  if (mapContainerRef && mapContainerRef.current) {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? "";
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-75.573553, 6.253041],
      zoom: 12,
    });

    useMapStore.getState().setMap(map);

    return () => {
      map.remove();
      useMapStore.getState().setMap(null);
    };
  }

  return () => {};
};

interface CustomMarkerProps {
  coordinates: [number, number];
  color?: string;
  text?: string;
}

export const createCustomMarker = (
  { coordinates, color, text }: CustomMarkerProps,
  map: Map
) => {
  if (!map) return;
  const markerElement = document.createElement("div");
  markerElement.className = "custom-marker";
  markerElement.style.backgroundColor = color ?? "gray";
  markerElement.style.width = `2.5rem`;
  markerElement.style.height = `2.5rem`;
  markerElement.style.borderRadius = "50%";
  markerElement.style.display = "flex";
  markerElement.style.justifyContent = "center";
  markerElement.style.alignItems = "center";
  markerElement.style.color = "#3e3e3e";
  markerElement.style.fontSize = "16px";
  markerElement.style.fontWeight = "bold";
  markerElement.innerHTML = text ?? "";

  new Marker({
    element: markerElement,
  })
    .setLngLat(coordinates)
    .addTo(map);
  markerElement.addEventListener("mouseenter", () => {
    const popup = new Popup({
      offset: 25,
      closeOnClick: false,
      className: "custom-popup",
      closeButton: false,
    })
      .setLngLat(coordinates)
      .setHTML("<p>¡Hola! Este es mi mensaje.</p>")
      .addTo(map);

    markerElement.addEventListener("mouseleave", () => {
      popup.remove();
    });
  });
};

export const calculateAQI = (pm25: number) => {
  const I_high = 500;
  const I_low = 0;
  const BP_high = 500.4;
  const BP_low = 0;
  const C = pm25;

  const AQI = ((I_high - I_low) / (BP_high - BP_low)) * (C - BP_low) + I_low;
  return Math.round(AQI);
};
