import "mapbox-gl/dist/mapbox-gl.css";
import { ReactElement, createRef, useEffect } from "react";
import { calculateAQI, initializeMap } from "./utils";
import { useMapStore } from "./store";
import axios from "axios";
import { renderToString } from "react-dom/server";
import { Map, Marker, Popup } from "mapbox-gl";

interface IData {
  coordinates: [number, number];
  value: number;
  name: string;
}

const localData: Array<IData> = [
  {
    coordinates: [-75.59, 6.25],
    value: 12.1,
    name: "Esp-32 Andres",
  },
  {
    coordinates: [-75.57, 6.20],
    value: 36,
    name: "Esp-32 David",
  },
];

const MapComponent = () => {
  const mapContainerRef = createRef<HTMLDivElement>();
  const map = useMapStore((state) => state.map);
  const onCreateMarker = (data: IData) => {
    if (!map) return;
    const aqi = calculateAQI(data.value);
    createCustomMarker(
      {
        coordinates: data.coordinates,
        text: Math.round(data.value).toString(),
        color: aqi.color,
        description: (
          <div>
            <p>Este es el dispositivio: {data.name}</p>
            <p>
              AQI es de {aqi.aqi} siendo {aqi.category}
            </p>
          </div>
        ),
      },
      map
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        /*  const response = await axios.get(
          "https://f8f1-181-58-39-221.ngrok.io/results"
        ); */
        //console.log(response.data);
        localData.forEach((value: IData) => {
          onCreateMarker(value);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [map]);

  useEffect(() => {
    useMapStore.getState().setMapContainerRef(mapContainerRef);
    const cleanup = initializeMap();
    return cleanup;
  }, []);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      className="map-container w-full h-full"
    />
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
      className={`custom-marker w-8 h-8 rounded-full flex justify-center items-center text-[#3e3e3e] border-2 border-gray-100 text-sm font-bold ${"bg-[#9e9e9e]"}`}
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
      closeOnClick: false,
      className: "custom-popup",
      closeButton: false,
    })
      .setLngLat(coordinates)
      .setHTML(renderToString(description))
      .addTo(map);

    markerElement.addEventListener("mouseleave", () => {
      popup.remove();
    });
  });
};

export default MapComponent;
