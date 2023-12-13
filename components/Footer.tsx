'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  return (
    <>
      <div className="fixed flex justify-between bottom-0 w-full max-w-[768px] min-w-[375px] m-auto">
        <Link
          href={"/"}
          className={
            pathname === "/"
              ? "w-full flex justify-center bg-indigo-600 p-2"
              : "w-full flex justify-center bg-green-600 p-2"
          }
        >
          <span className="text-white text-base font-bold">予約状況</span>
        </Link>
        <Link
          href={"/create"}
          className={
            pathname === "/create"
              ? "w-full flex justify-center bg-indigo-600 p-2"
              : "w-full flex justify-center bg-green-600 p-2"
          }
        >
          <span className="text-white text-base font-bold">予約する</span>
        </Link>
      </div>
    </>
  );
};

export default Footer;
