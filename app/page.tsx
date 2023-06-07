"use client";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-between">
      <MapComponent />
    </main>
  );
}
