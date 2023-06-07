"use client";
import { getLastResults } from "@/components/services";
import dynamic from "next/dynamic";
//import { getLastResults } from "./services";
import { useEffect, useMemo, useState } from "react";

const MapComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function Home() {
  const [responseData, setResponseData] = useState<Array<any>>([]);
  useMemo(() => {
    const fetchData = async () => {
      try {
        setResponseData(await getLastResults());
      } catch (error) {
        setResponseData([
          {
            device: "esp32_14969200",
            location: { x: 6.15442, y: -75.60834 },
            data: { pm25: 10.7119, quality: 1, time: 1686142800000 },
          },
        ]);
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-between">
      {responseData.length > 0 && <MapComponent responseData={responseData} />}
    </main>
  );
}
