"use client";
import { createCustomMarker, useMapStore } from "@/components/mapHooks";
import MapComponent from "../components/map";

/* const ButtonAdd = () => {
  const map = useMapStore((state) => state.map);
  const onCreateMarker = () => {
    if (map)
      createCustomMarker(
        {
          coordinates: [-75.573553, 6.253041],
          color: "#f7d460",
          text: "22",
        },
        map
      );
  };
  return (
    <div className="sticky bottom-10 right-10">
      <button onClick={onCreateMarker}>Add</button>
    </div>
  );
}; */

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <ButtonAdd /> */}
      <MapComponent />
    </main>
  );
}
