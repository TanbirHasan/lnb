import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { paginationRecoil } from "../../../store/atoms/paginationRecoil";
import { CompanySearchLoaderRecoil } from "../../../store/atoms/CompanySearchLoaderRecoil";
import { CircularProgress } from "@mui/material";

const TotalCompany = () => {
  const paginationState = useRecoilValue(paginationRecoil);
  const companySearchLoader = useRecoilValue(CompanySearchLoaderRecoil);

  useEffect(() => {
    // const totaldata = JSON.parse(localStorage.getItem("totaldata"));
    // setData(totaldata?.noOfDocuments);
    window.scrollTo({ top: 800, behavior: "instant" });
  }, [paginationState]);

  return (
    <div>
      {companySearchLoader ? (
        <div className="flex justify-center  py-20 border-2 px-2 shadow-md">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="flex py-4 border-2 px-2 shadow-md">
            <h6 className="mr-2">Result</h6>
            <p className="opacity-40">
              {paginationState.total} new company found
            </p>
          </div>
          <div className="border-2 flex flex-col justify-items-center items-center py-20">
            <div className="bg-[#3294D133] w-1/4 text-center rounded  mb-5">
              <h2 className="headline1 headline1Res p-5 text-[#D16F32]">
                {paginationState.total}
              </h2>
            </div>
            <p className="w-9/12 text-center text-[#202020] mt-5 headline5 opacity-40">
              Check out the number of local new businesses registered just
              today. Take this opportunity to reach them.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default TotalCompany;
