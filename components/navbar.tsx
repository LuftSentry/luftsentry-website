import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between px-8 md:px-10 py-2 z-50 absolute w-full rounded-b-xl bg-[#164e6b60] text-gray-50">
      <Link href="/" className="text-xl font-bold tracking-widest">
        LUFTSENTRY
      </Link>
      <div className="p-1 border border-[#164e6b] bg-[#164e6ba0] rounded-md hover:shadow-md">
        <Link href="/user" className="text-md cursor-pointer">
          Mis dispositivos
        </Link>
      </div>
    </div>
  );
};
