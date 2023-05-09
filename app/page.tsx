"use client";
import MapComponent from "../components/map";

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-between">
      <MapComponent />
    </main>
  );
}
