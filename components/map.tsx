import React, { createRef, useEffect } from "react";
import { initializeMap, useMapStore } from "./mapHooks";
import axios from "axios";

interface MapProps {}

const MapComponent: React.FC<MapProps> = () => {
  const mapContainerRef = createRef<HTMLDivElement>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://f8f1-181-58-39-221.ngrok.io/results"
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    useMapStore.getState().setMapContainerRef(mapContainerRef);
    const cleanup = initializeMap();
    return cleanup;
  }, [mapContainerRef]);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      className="map-container w-screen h-screen"
    />
  );
};

export default MapComponent;
