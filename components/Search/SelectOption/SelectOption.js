import {Divider} from "@mui/material";

import React from "react";
import PrintandPost from "../PrintandPost/PrintandPost";

const SelectOption = (props) => {
  const { ondatasubmit, isShown, setIsShown } = props;
  return (
    <div className="flex flex-col lg:flex-row ">
      <div className="shadow-md py-10 w-full lg:w-3/4 mr-2">
        <PrintandPost
          ondatasubmit={ondatasubmit}
          isShown={isShown}
          setIsShown={setIsShown}
        />
      </div>
      <div className="w-full lg:w-1/4 shadow-md px-5 py-10 lg:ml-5">
        <h5 className="headline3 text-[17px] mb-3">Invoice</h5>
        <p className="headline7 text-[13px] mb-5">
          You have selected 500 companies. Please find below a breakdown of your
          total payment.
        </p>
        <Divider />
        <div className="flex justify-between mt-5">
          <p className="headline7 text-[15px] text-[#202020bf]">Print & Post</p>
          <span>$23</span>
        </div>
        <div className="flex justify-between mt-5">
          <p className="headline7  text-[15px] text-[#202020bf]">Email</p>
          <span>$10</span>
        </div>
        <div className="flex justify-between mt-5">
          <p className="headline7  text-[15px] text-[#202020bf]">Download</p>
          <span>$5</span>
        </div>
        <Divider />
        <button className="bg-[#EEFAF4] text-[12px] py-4 px-2 rounded-md mt-5 text-[#1CD44D] w-full">
          Choose Monthly/Yearly Subbscription
        </button>
        <p className="text-[13px] mt-5 text-[#202020dc]">
          In case you are struggling with any of these steps and have any
          confusion, please make sure to contact{" "}
          <span className="text-[#3294D1]">support@avalon.com</span> We will be
          happy to help you{" "}
        </p>
      </div>
    </div>
  );
};

export default SelectOption;
