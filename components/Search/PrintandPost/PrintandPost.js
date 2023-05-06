import {useRouter} from "next/router";
import * as React from "react";
import {useEffect, useState} from "react";
import {AiOutlineMail, AiOutlinePrinter} from "react-icons/ai";
import {useRecoilState, useRecoilValue} from "recoil";
import {companyListRecoilState} from "../../../store/atoms/companyListRecoil";
import {finalStepRecoil} from "../../../store/atoms/finalStepState";
import {serviceResquestResponseRecoilState} from "../../../store/atoms/serviceRequestResponseRecoil";
import {Divider} from "@mui/material";
import {priceRecoil} from "../../../store/atoms/priceRecoil";
import apiClient from "../../../library/apis/api-client";

const PrintandPost = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [serviceResquestResponse, setServiceResquestResponse] = useRecoilState(
    serviceResquestResponseRecoilState
  );
  const [price, setPrice] = useRecoilState(priceRecoil);

  const totalCompany = useRecoilValue(companyListRecoilState);

  const priceValue = useRecoilValue(priceRecoil);
  const route = useRouter();
  const [finalStepValue, setFinalStepValue] = useRecoilState(finalStepRecoil);

  const getPricingData = async () => {
    try {
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/retrievePrices`
      );
      if (res.status === 200) {
        setPrice(res?.data?.prices);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    getPricingData().then((r) => {});
  }, []);

  const ondatasubmit = (data) => {
    if (data === "emailservice") {
      setFinalStepValue("Complete");
    }
    route.push(`/stepperpages/${data}`);
  };

  const companyList = useRecoilValue(companyListRecoilState);

  useEffect(() => {
   
  }, [serviceResquestResponse]);

  return (
    // <div className="lg:container max-w-7xl mx-auto py-10">
    //   <div className="lg:px-10 px-5 md:px-10 md:mx-2">
    //     <h2 className="headline3 text-[17px] mb-5 ">
    //       Lorem ipsum dolor sit amet, consectetur adipiscing elit
    //     </h2>
    //     <p className="headline6 text-[14px] text-[#202020ba]">
    //       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique
    //       odio nam vel. Euismod convallis condimentum facilisis tincidunt
    //       tristique. Varius at pretium vitae vestibulum. Turpis donec lacus
    //       tincidunt quis enim.
    //     </p>
    //   </div>
    //   <div className="flex flex-col justify-center items-center lg:flex-row md:flex-row mt-10 max-w-full px-10 lg:px-0 md:px-0">
    //     <div className="border-2 border-solid lg:mx-2 md:mx-2 mt-5 w-full lg:w-1/4 md:w-2/4 sm:w-2/4 text-center rounded-md hover:bg-amber-600 hover:bg-opacity-5 hover:border-amber-600 hover:text-amber-600">
    //       <button
    //         className=" bg-grey-light hover:bg-grey text-grey-darkest font-bold py-6 sm:py-12 px-4 rounded inline-flex items-center "
    //         // onClick={() => ondatasubmit("templatedesign")}
    //         onClick={() => ondatasubmit("companylistsender")}
    //       >
    //         <AiOutlinePrinter className="text-[25px] mr-5 " />
    //         <span className="headline7 p-1 text-[14px] lg:text-[16px] sm:text-[14px] w-1/3 md:w-auto lg:w-auto">
    //           Print and Post
    //         </span>
    //       </button>
    //     </div>

    //     <div className="border-2 border-solid lg:mx-2 md:mx-2 mt-5 w-full lg:w-1/4 md:w-2/4 sm:w-2/4 text-center rounded-md hover:bg-amber-600 hover:bg-opacity-5 hover:border-amber-600 hover:text-amber-600">
    //         <div>

    //             <button
    //               className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-6 sm:py-12 px-4 rounded inline-flex items-center "
    //               onClick={() => ondatasubmit("emailservice")}
    //               >
    //                 <AiOutlineMail className="text-[25px] mr-5 " />
    //                 <span className="headline7 text-[14px] lg:text-[16px] sm:text-[14px] w-1/3 md:w-auto lg:w-auto">
    //                   Email or Download
    //                 </span>
    //                 <span className=" animate-pulse bg-blue-500 text-white ml-2 rounded-2xl p-1 headline7 text-s text-[10px] lg:text-[14px] sm:text-[10px] w-1/3 md:w-auto lg:w-auto">
    //                   Free
    //                 </span>
    //             </button>
    //         </div>
    //     </div>

    //     {/* <div className="border-2 border-solid lg:mx-2 md:mx-2 mt-5 w-full lg:w-1/4 md:w-2/4 sm:w-2/4 rounded-md hover:bg-amber-600 hover:bg-opacity-5 text-center hover:border-amber-600 hover:text-amber-600">
    //       <button
    //         className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-6 sm:py-12   px-4 inline-flex items-center "
    //         onClick={handleDownload}
    //       >
    //         <BiDownload className="text-[25px] mr-5 " />
    //         <span className="headline7 text-[14px] lg:text-[16px] sm:text-[14px] w-1/3 md:w-auto lg:w-auto">
    //           Download
    //         </span>
    //       </button>
    //     </div> */}
    //   </div>

    <div>
      {!!profileData && (
        <div>
          {/* {!!profileData?.isVerified && (
            <div className="flex justify-center align-center p-10">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-black text-white p-2 rounded-md"
              >
                {" "}
                Verify Now
              </button>
            </div>
          )} */}
          {/* {!profileData?.isVerified && ( */}

          <div className="grid grid-cols-1 md:grid-cols-6">
            <div className="lg:container max-w-7xl mx-auto mt-10 col-span-4">
              <div className="lg:px-10 px-5 md:px-10 md:mx-2">
                <h2 className="headline3 text-[17px] mb-5 ">
                  Select your preferred delivery method
                </h2>
              </div>
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-5 w-full md:w-4/5 px-5 md:px-0 mx-auto justify-center items-center  mt-10 px-10 lg:px-0 md:px-0">
                <div
                  onClick={() => ondatasubmit("companylistsender")}
                  className="border-2 border-solid lg:mx-2 md:mx-2 mt-5 w-full text-center rounded-md hover:bg-amber-600 hover:bg-opacity-5 hover:border-amber-600 hover:text-amber-600"
                >
                  <button className=" w-full bg-grey-light hover:bg-grey text-grey-darkest font-bold py-6 sm:py-12 px-4 rounded inline-flex items-center justify-center">
                    <AiOutlinePrinter className="text-[25px] mr-5 " />
                    <span className="headline7 text-[14px] lg:text-[16px] sm:text-[14px] w-1/3 md:w-auto lg:w-auto">
                      Print and Post
                    </span>
                  </button>
                </div>

                <div
                  onClick={() => ondatasubmit("emailservice")}
                  className="border-2 border-solid lg:mx-2 md:mx-2 mt-5 w-full text-center rounded-md hover:bg-amber-600 hover:bg-opacity-5 hover:border-amber-600 hover:text-amber-600"
                >
                  <div>
                    <button className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-6 sm:py-12 px-4 rounded inline-flex items-center ">
                      <AiOutlineMail className="text-[25px] mr-5 " />
                      <span className="headline7 text-[14px] lg:text-[16px] sm:text-[14px] w-1/3 md:w-auto lg:w-auto">
                        Email or Download
                      </span>
                      <span className=" animate-pulse bg-blue-500 text-white ml-2 rounded-2xl p-1 headline7 text-s text-[10px] lg:text-[14px] sm:text-[10px] w-1/3 md:w-auto lg:w-auto">
                        Free
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full border-2 border-gray-50 shadow-md px-5 my-10 py-10 col-span-2">
              <h5 className="headline3 text-[17px] mb-3">Pricing</h5>
              <p className="headline7 text-[13px] mb-5">
                You have selected <b>{totalCompany?.length}</b> companies.
                Please find our pricing below.
              </p>
              <Divider />
              <div className="flex justify-between mt-5">
                <p className="headline7 text-[15px] text-[#202020bf]">
                  Print & Post
                </p>
                <span>£ {priceValue?.MAIL_PRINT_SERVICE}</span>
              </div>
              <div className="flex justify-between mt-5">
                <p className="headline7  text-[15px] text-[#202020bf]">Email</p>
                <span>£ {priceValue?.EMAIL_SERVICE}</span>
              </div>
              <div className="flex justify-between my-5">
                <p className="headline7  text-[15px] text-[#202020bf]">
                  Download
                </p>
                <span>£ {priceValue?.DOWNLOAD_SERVICE}</span>
              </div>
              <Divider />
              <button className="bg-[#EEFAF4] text-[12px] py-4 px-2 rounded-md mt-5 text-[#1CD44D] w-full">
                Choose Monthly/Yearly Subbscription
              </button>
              <p className="text-[13px] mt-5 text-[#202020dc]">
                In case you are struggling with any of these steps and have any
                confusion, please make sure to contact <br />{" "}
                <a href="mailto:dev@tulip-tech.com" className="text-[#3294D1]">
                  dev@tulip-tech.com
                </a>{" "}
                We will be happy to help you{" "}
              </p>
            </div>
          </div>
          {/* )} */}

          {/* <VerifyEmailModal open={modalOpen} setOpen={setModalOpen} /> */}
        </div>
      )}
      {/* {!profileData && (
        <div className="flex justify-center my-10">
          <CircularProgress />
        </div>
      )} */}
    </div>
  );
};

export default PrintandPost;
