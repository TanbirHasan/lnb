import React from "react";
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-6 h-screen">
        <div className="left-div col-span-1  md:col-span-2 hidden md:block">
          <div className="flex flex-col items-start justify-between h-full">
            <div className="p-10 lg:p-16 cursor-pointer">
              <Link href="/">
                <img
                  src="/assets/logo.png"
                  className='h-[52px]'
                  alt="logo"
                />
              </Link>
            </div>
            <div>
              <div className="headline2 text-[20px] lg:text-[28px] md:text-[32px] text-white px-10 lg:px-16">
              Get Ahead of the Game with Unlimited Access to New Businesses Across the UK.
              </div>
              <div className="headline6 text-[12px] lg:text-[18px] md:text-[18px] text-white px-10 lg:px-16 my-5">
              Connect with new local companies across the UK and get ahead of the game with New Local Business. With unlimited access to newly registered companies, you ll have the most up-to-date information to make valuable connections and grow your business. 
              </div>
            </div>
          </div>
        </div>
        <div className="right-div bg-yellow-200 col-span-1 md:col-span-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
