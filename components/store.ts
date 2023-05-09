import mapboxgl, { Map, Marker, Popup } from "mapbox-gl";
import { create } from "zustand";

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
