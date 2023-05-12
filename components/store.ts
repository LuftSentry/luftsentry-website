import { Map } from "mapbox-gl";
import { create } from "zustand";

interface MapState {
  map: Map | null;
  mapContainerRef: React.RefObject<HTMLDivElement> | null;
  session: any | null;
  setMap: (map: Map | null) => void;
  setMapContainerRef: (
    mapContainerRef: React.RefObject<HTMLDivElement> | null
  ) => void;
  setSession: (session: any) => void;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  mapContainerRef: null,
  session: null,
  setMap: (map) => set({ map }),
  setMapContainerRef: (mapContainerRef) => set({ mapContainerRef }),
  setSession: (session) => set({ session }),
}));
