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
  aqi: number;
  category: string;
  color: string;
  description: string;
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

  const breakpoint = breakpoints.find(
    (bp) => pm25 >= bp.bpLow && pm25 <= bp.bpHigh
  );

  if (!breakpoint) {
    throw new Error("PM2.5 value out of range");
  }

  const aqi =
    ((breakpoint.iHigh - breakpoint.iLow) /
      (breakpoint.bpHigh - breakpoint.bpLow)) *
      (pm25 - breakpoint.bpLow) +
    breakpoint.iLow;

  const response =
    aqi <= 50
      ? {
          category: "Bueno",
          color: "#abd162",
          description: "Se puede realizar cualquier actividad al aire libre.",
        }
      : aqi <= 100
      ? {
          category: "Moderado",
          color: "#f7d460",
          description:
            "Los grupos sensibles deben considerar limitar los esfuerzos prolongados al aire libre.",
        }
      : aqi <= 150
      ? {
          category: "Dañino para grupos sensibles",
          color: "#fc9956",
          description:
            "Los grupos sensibles deben limitar los esfuerzos prolongados al aire libre.",
        }
      : aqi <= 200
      ? {
          category: "Dañino para la salud",
          color: "#f6676b",
          description:
            "Los grupos sensibles deben evitar los esfuerzos prolongados al aire libre. La población en general deben limitar los esfuerzos prolongados al aire libre.",
        }
      : aqi <= 300
      ? {
          category: "Muy dañino para la salud",
          color: "#a37db8",
          description: "",
        }
      : {
          category: "Peligroso",
          color: "#a07684",
          description:
            "La población en general deben suspender los esfuerzos prolongados al aire libre.",
        };

  return { aqi: Math.round(aqi), ...response };
};
