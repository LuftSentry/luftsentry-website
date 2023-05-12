import { UserDevices } from "@/components/userDevices";

const User = async () => {
  return (
    <main className="flex p-4 pt-14 gap-2 h-screen w-screen flex-col text-gray-950">
      <UserDevices />
    </main>
  );
};

export default User;
