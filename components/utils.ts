import mapboxgl, { Map } from "mapbox-gl";
import { useMapStore } from "./store";

export const initializeMap = () => {
  const mapContainerRef = useMapStore.getState().mapContainerRef;
  if (!mapContainerRef?.current) return () => {};

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? "";
  const map = new Map({
    container: mapContainerRef.current,
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-75.57, 6.25],
    zoom: 12,
  });

  useMapStore.getState().setMap(map);

  return () => {
    map.remove();
    useMapStore.getState().setMap(null);
  };
};

type AQIResult = {
  aqi: number,
  category: string,
  color: string,
};

export const calculateAQI = (pm25: number): AQIResult => {
  const breakpoints = [
    { bpLow: 0, bpHigh: 12.0, iLow: 0, iHigh: 50 },
    { bpLow: 12.1, bpHigh: 35.4, iLow: 51, iHigh: 100 },
    { bpLow: 35.5, bpHigh: 55.4, iLow: 101, iHigh: 150 },
    { bpLow: 55.5, bpHigh: 150.4, iLow: 151, iHigh: 200 },
    { bpLow: 150.5, bpHigh: 250.4, iLow: 201, iHigh: 300 },
    { bpLow: 250.5, bpHigh: 350.4, iLow: 301, iHigh: 400 },
    { bpLow: 350.5, bpHigh: 500.4, iLow: 401, iHigh: 500 },
  ];

  const breakpoint = breakpoints.find((bp) => pm25 >= bp.bpLow && pm25 <= bp.bpHigh);

  if (!breakpoint) {
    throw new Error("PM2.5 value out of range");
  }

  const aqi =
    ((breakpoint.iHigh - breakpoint.iLow) / (breakpoint.bpHigh - breakpoint.bpLow)) *
      (pm25 - breakpoint.bpLow) +
    breakpoint.iLow;

  const category =
    aqi <= 50
      ? "Bueno"
      : aqi <= 100
      ? "Moderado"
      : aqi <= 150
      ? "Dañino para grupos sensibles"
      : aqi <= 200
      ? "Dañino para la salud"
      : aqi <= 300
      ? "Muy dañino para la salud"
      : "Peligroso";

  const color =
    aqi <= 50
      ? "#abd162"
      : aqi <= 100
      ? "#f7d460"
      : aqi <= 150
      ? "#fc9956"
      : aqi <= 200
      ? "#f6676b"
      : aqi <= 300
      ? "#a37db8"
      : "#a07684";

  return { aqi: Math.round(aqi), category, color };
};
