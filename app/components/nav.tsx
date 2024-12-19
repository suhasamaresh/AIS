import React from "react";
import Image from "next/image";
import drait from "@/assets/full_logo-wide.png";

const Header = ({ title } : any ) => {
  return (
    <header className="bg-gradient-to-r from-white from-25% via-blue-500 to-purple-600 flex flex-col gap-y-2 sm:flex-row px-4 py-2 ">
      <div className="">
      </div>
      <div className="text-black font-bold text-3xl">{title}</div>
    </header>
  );
};

export default Header;
