"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import { ReactElement, createRef, useEffect, useState } from "react";
import { calculateAQI, initializeMap } from "./utils";
import { useMapStore } from "./store";
import { renderToString } from "react-dom/server";
import { Map, Marker, Popup } from "mapbox-gl";
import { getLastResults } from "./services";

interface IData {
  location: {
    x: number;
    y: number;
  };
  data: {
    pm25: number;
    quality: number;
    time: number;
  };
  name: string;
}

const MapComponent = () => {
  const mapContainerRef = createRef<HTMLDivElement>();
  const map = useMapStore((state) => state.map);
  const [responseData, setResponseData] = useState<Array<any>>([]);
  const onCreateMarker = (data: IData) => {
    if (!map) return;
    const aqi = calculateAQI(data.data.pm25);
    const lastUpdate = new Date(data.data.time);
    lastUpdate.setHours(+1, 15);
    const formatHour = (date: Date): string =>
      date
        .toLocaleString(undefined, {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", "");
    createCustomMarker(
      {
        coordinates: [data.location.x, data.location.y],
        text: Math.round(data.data.pm25).toString(),
        color: aqi.color,
        description: (
          <div className="bg-slate-200 text-gray-950 text-sm">
            <h2 className="text-lg font-semibold mb-2">{data.name}</h2>
            <p>
              <span className="font-semibold">Porcentaje de calidad: </span>
              {(data.data.quality * 100).toFixed(1)}%
            </p>
            <p>
              <span className="font-semibold">AQI:</span> {aqi.aqi}{" "}
              {aqi.category}
            </p>
            <p className="font-semibold">Recomendación:</p>
            <p>{aqi.description}</p>
            <p className="mt-2 text-xs">{formatHour(lastUpdate)}</p>
          </div>
        ),
      },
      map
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setResponseData(await getLastResults());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [map]);

  useEffect(() => {
    useMapStore.getState().setMapContainerRef(mapContainerRef);
    const cleanup = initializeMap();
    return cleanup;
  }, []);

  useEffect(() => {
    try {
      responseData.forEach((value: IData) => {
        onCreateMarker(value);
      });
    } catch (error) {
      console.error(error);
    }
  }, [responseData, setResponseData]);

  return (
    <>
      <div
        ref={mapContainerRef}
        id="map"
        className="map-container w-full h-full"
      />
      <div className="fixed p-2 flex flex-col items-start justify-start bottom-8 right-4 w-40 h-48 z-10 bg-[#164e6ba0] rounded-md text-slate-50">
        <h2 className="text-md font-bold">AQI PM2.5</h2>
        <ul className="text-xs flex flex-col gap-1">
          <li className="flex items-center pl-1 gap-1">
            <div className="w-2 h-2 rounded-full bg-[#abd162]" />
            <p>Bueno</p>
          </li>
          <li className="flex items-center pl-1 gap-1">
            <div className="w-2 h-2 rounded-full bg-[#f7d460]" />
            <p>Moderado</p>
          </li>
          <li className="flex items-center pl-1 gap-1">
            <div className="w-2 h-2 rounded-full bg-[#fc9956]" />
            <p>Dañino para grupos sensibles</p>
          </li>
          <li className="flex items-center pl-1 gap-1">
            <div className="w-2 h-2 rounded-full bg-[#f6676b]" />
            <p>Dañino para la salud</p>
          </li>
          <li className="flex items-center pl-1 gap-1">
            <div className="w-2 h-2 rounded-full bg-[#a37db8]" />
            <p>Muy dañino para la salud</p>
          </li>
          <li className="flex items-center pl-1 gap-1">
            <div className="w-2 h-2 rounded-full bg-[#a07684]" />
            <p>Peligroso</p>
          </li>
        </ul>
      </div>
    </>
  );
};

interface CreateCustomMarkerProps {
  coordinates: [number, number];
  color: string;
  text: string;
  description: ReactElement;
}

const createCustomMarker = (
  { coordinates, text, color, description }: CreateCustomMarkerProps,
  map: Map
) => {
  if (!map) return;
  const markerContainer = document.createElement("div");
  markerContainer.innerHTML = renderToString(
    <div
      className="custom-marker w-8 h-8 rounded-full flex justify-center items-center text-[#3e3e3e] border-2 border-gray-100 text-sm font-bold bg-[#9e9e9e]"
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  );
  const markerElement = markerContainer.firstChild as HTMLDivElement;
  new Marker({
    element: markerElement,
  })
    .setLngLat(coordinates)
    .addTo(map);

  markerElement.addEventListener("mouseenter", () => {
    const popup = new Popup({
      offset: 25,
      closeOnClick: true,
      className: "custom-popup",
      closeButton: false,
    })
      .setLngLat(coordinates)
      .setHTML(renderToString(description))
      .addTo(map);
  });
};

export default MapComponent;
