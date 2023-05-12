"use client";
import { useEffect, useState } from "react";

const usersData = [
  { id: 1, name: "Andres", devies: 4 },
  { id: 2, name: "Andres", devies: 4 },
];

export const UserDevices = () => {
  const [pickedUser, setPickedUser] = useState<number>(0);
  const [devicesData, setDevicesData] = useState<Array<any>>([]);
  function onUserClick(id: number) {
    setPickedUser(pickedUser === id ? 0 : id);
  }
  useEffect(() => {
    setDevicesData(
      pickedUser === 0
        ? []
        : [
            {
              id: 1,
              name: "ESP_32_01_andres",
              type: "esp32",
              location: [-75.25, 6.2],
              version: "0.0.1",
            },
          ]
    );
  }, [pickedUser]);
  return (
    <>
      <h2 className="text-3xl font-semibold">Usuarios</h2>
      <ul className="flex flex-row flex-nowrap overflow-auto gap-2 py-1">
        {usersData.map((user) => (
          <li key={`user-${user.id}`}>
            <div
              className={`bg-slate-100 rounded-lg p-4 shadow flex flex-col cursor-pointer min-w-[16rem] w-64 h-24 transition-all ${
                pickedUser === user.id ? "bg-slate-300 pl-3 pt-3 shadow-md" : ""
              }`}
              onClick={() => onUserClick(user.id)}
            >
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p>Dispositivos vinculados: {user.devies}</p>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="text-3xl font-semibold">Dispositivos</h2>
      <ul className="flex flex-row flex-nowrap overflow-auto gap-2 py-1">
        {devicesData.length < 1 && (
          <p>Selecciona un usuario para consultar sus dispositivos</p>
        )}
        {devicesData.map((device) => (
          <li key={`device-${device.id}`}>
            <div
              className={`bg-slate-100 rounded-lg p-4 shadow flex flex-col min-w-[16rem] w-64 h-24 transition-all`}
            >
              <h2 className="text-xl font-semibold">{device.name}</h2>
              <div className="grid grid-cols-2">
                <p>Tipo: {device.type}</p>
                <p>Latitud: {device.location[0]}</p>
                <p>Version: {device.version}</p>
                <p>Longitud: {device.location[1]}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};