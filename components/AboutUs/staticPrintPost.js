import React from "react";
import { AiOutlineMail, AiOutlinePrinter } from "react-icons/ai";
import { BiDownload } from "react-icons/bi";

const StaticPrintPost = () => {
  return (
    <div className="lg:container w-full md:max-w-7xl mx-auto px-5 md:px-20">
      <div className="lg:px-10 px-5 md:px-10 w-full  mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl text-center mb-5 w-full">
          SELECT & PREVIEW YOUR PREFERRED DATA DELIVERY METHOD
        </h2>
        <div className="headline6 text-base text-dark-202020 text-opacity-60 text-center">
          From printing & posting cuotomised message to your selected local
          businesses to downloading data directly on your computer, we deliver
          your want it. Choose the options below to preview.
        </div>
      </div>
      <div className="flex flex-col md:w-auto mx-auto w-full  justify-center items-center lg:flex-row md:flex-row mt-10 max-w-full px-10 lg:px-0 md:px-0">
        <div className="border-2 border-solid lg:mx-2 md:mx-2 mt-5 w-full lg:w-1/4 md:w-2/4 sm:w-2/4 text-center rounded-md ">
          <button
            className="w-full bg-grey-light hover:bg-grey text-grey-darkest font-bold py-4 px-4 rounded inline-flex items-center justify-center"
            disabled
          >
            <AiOutlinePrinter className="text-[25px] mr-5 " />
            <span className="headline7 w-auto text-[14px] lg:text-[16px] sm:text-[14px] w-1/4 md:w-auto lg:w-auto">
              Print and Post
            </span>
          </button>
        </div>
        <div className="border-2 border-solid lg:mx-2 md:mx-2 mt-5 w-full lg:w-1/4 md:w-2/4 sm:w-2/4 text-center rounded-md">
          <button
            className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-4 px-4 rounded inline-flex items-center "
            disabled
          >
            <AiOutlineMail className="text-[25px] mr-5 " />
            <span className="headline7 text-[14px] lg:text-[16px] sm:text-[14px] w-1/3 md:w-auto lg:w-auto">
              Email
            </span>
          </button>
        </div>

        <div className="border-2 border-solid lg:mx-2 md:mx-2 mt-5 w-full lg:w-1/4 md:w-2/4 sm:w-2/4 rounded-md text-center ">
          <button
            className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-4 px-4 rounded inline-flex items-center "
            disabled
          >
            <BiDownload className="text-[25px] mr-5 " />
            <span className="headline7 text-[14px] lg:text-[16px] sm:text-[14px] w-1/3 md:w-auto lg:w-auto">
              Download
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaticPrintPost;
