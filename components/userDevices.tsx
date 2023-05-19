"use client";
import { useEffect, useMemo, useState } from "react";
import { getDevices, getUsers } from "./services";

interface IUser {
  id: number;
  name: string;
  devices: number;
}

const userDevices = [
  {
    id: 1,
    name: "ESP_32_01_andres",
    type: "esp32",
    location: [-75.25, 6.2],
    version: "0.0.1",
  },
];

export const UserDevices = () => {
  const [pickedUser, setPickedUser] = useState<number>(0);
  const [pickedDevice, setPickedDevice] = useState<number>(0);
  const [devicesData, setDevicesData] = useState<Array<any>>([]);
  const [usersData, setUsersData] = useState<Array<IUser>>([]);

  const onUserClick = (id: number) => {
    setPickedUser(pickedUser === id ? 0 : id);
  };

  const onDeviceClick = (id: number) => {
    setPickedDevice(pickedDevice === id ? 0 : id);
  };
  useEffect(() => {
    if (pickedUser != 0) {
      getDevices().then((res) => {
        setDevicesData([res]);
      });
    } else {
      setDevicesData([]);
    }
  }, [pickedUser]);
  useMemo(async () => {
    setUsersData([await getUsers()]);
  }, []);
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
              <p>Dispositivos vinculados: {user.devices}</p>
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
              className={`bg-slate-100 rounded-lg p-4 shadow flex flex-col min-w-[16rem] w-80 h-24 transition-all cursor-pointer ${
                pickedDevice === device.id
                  ? "bg-slate-300 pl-3 pt-3 shadow-md"
                  : ""
              }`}
              onClick={() => onDeviceClick(device.id)}
            >
              <h2 className="text-xl font-semibold">{device.name}</h2>
              <div className="grid grid-cols-2">
                <p>Tipo: {device.type}</p>
                <p>Latitud: {device.location.x.toFixed(2)}</p>
                <p>Version: {device.version}</p>
                <p>Longitud: {device.location.y.toFixed(2)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {pickedDevice != 0 && (
        <iframe
          className="w-full h-96 border-none"
          src="https://lookerstudio.google.com/embed/reporting/fa3c0f69-ff3f-4955-8863-fb21b1390659/page/p_lfzqyhh2vc"
          allowFullScreen
        />
      )}
    </>
  );
};
