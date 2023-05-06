import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {serviceResquestResponseRecoilState} from "../../../store/atoms/serviceRequestResponseRecoil";
import {useRecoilState} from "recoil";
import {LinearProgress} from "@mui/material";
import {companyListRecoilState} from "../../../store/atoms/companyListRecoil";
import {useSnackbar} from "notistack";
import { DownlaodLargeData } from "../../../store/atoms/DownloadLargeData";

const PaymentComplete = () => {
  const route = useRouter();

  const [serviceRequestResponse, setServiceRequestResponse] = useRecoilState(
    serviceResquestResponseRecoilState
  );

  const [downloadChecked, setDownloadChecked] = useRecoilState(DownlaodLargeData);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isSucessfull, setIsSucessfull] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useRecoilState(
    companyListRecoilState
  );
  const { enqueueSnackbar } = useSnackbar();

  const [isFreeService, setFreeService] = useState(false);
  // const [isFreeService, setFreeService] = useState(false)

  const onShown = () => {
    setServiceRequestResponse({});
    setSelectedCompanyData([]);
    route.push("/");
  };

  useEffect(() => {
    if (
      (serviceRequestResponse?.requestData?.package_name ===
        "DOWNLOAD_SERVICE" ||
        serviceRequestResponse?.requestData?.package_name ===
          "EMAIL_SERVICE") &&
      serviceRequestResponse?.requestData?.excelLink
    ) {
      setFreeService(true);
      setDownloadChecked(false)
    } else if (
      serviceRequestResponse?.requestData?.package_name ===
        "MAIL_PRINT_SERVICE" &&
      serviceRequestResponse?.response?.invoiceId
    ) {
      setPaymentLoading(false);

      setIsSucessfull(true);
      localStorage.removeItem("senderDataRecoil");
      localStorage.removeItem("formStateRecoil");
    } else {
      setIsSucessfull(false);
      setDownloadChecked(false)
    }
  }, []);

  // const callCheckoutApi = async() =>{

  //   try{
  //     setIsSucessfull(false)
  //     setPaymentLoading(true)
  //     const payload = {
  //       "service_request_id" : serviceRequestResponse?.requestData._id,
  //       "paid_amount" : "30",
  //       "token":"754567657"
  //     }

  //     const response = await checkoutRequestClient (payload)

  //     if(response.status === 200){

  //         setPaymentLoading(false)
  //         setIsSucessfull(true)
  //         setServiceRequestResponse(prev=>({...prev, response:response.data}))
  //         setSelectedCompanyData([])

  //     }
  //   }catch(e){
  //     setPaymentLoading(false)
  //   }

  // }

  return (
    <div className="max-w-7xl mx-auto my-3">
      <section className="">
        <div className="shadow-lg py-20 text-center">
          {paymentLoading && (
            <>
              <LinearProgress />
              <h2 className="Tagline lg:text-[40px] md:text-[30px] sm:text-[20px] my-[30px]">
                Your payment is being processed
              </h2>
              {
                isFreeService &&  <p className="headline6 pb-[60px] text-[12px] lg:text-[18px] md:text-[18px] text-[color:var(--Black-three)]">
                Download link will be available shortly....
             </p>
              }
             
            </>
          )}

          {!paymentLoading && isSucessfull && (
            <>
              <Image
                src="/assets/PaymentSucces.svg"
                width="160"
                height="160"
                alt="payment completed"
                className="mx-auto mb-5"
              />

              <h2 className="Tagline lg:text-[40px] md:text-[30px] sm:text-[20px] my-[30px]">
                Payment Successfully Completed
              </h2>
              <p className="headline6 pb-[60px] text-[12px] lg:text-[18px] md:text-[18px] text-[color:var(--Black-three)]">
                You have successfully completed your invoice payment. Please
                check your profile to view the service details.
                {/*Please check your inbox for a confirmation mail. If you have not received the mail yet, don’t forget to check your Spam! <p className="text-[#3294D1]">Resend mail</p>*/}
              </p>

              {/* {serviceRequestResponse?.requestData?.package_name === "DOWNLOAD_SERVICE" &&(
                <Link href={serviceRequestResponse?.response?.excelLink} target="_blank" >
                  <button
                      className="w-[242px] py-4 rounded-lg headline6 my-5 mx-3 text-center bg-[color:var(--primary1-color)] text-white cursor-pointer"
                      // onClick={onShown}
                    >
                      Click to download
                  </button>
                </Link>
                )
              } */}

              <button
                className="w-[242px] py-4 rounded-lg headline6 my-5 text-center bg-[color:var(--primary1-color)] text-white cursor-pointer"
                onClick={onShown}
              >
                Back Home
              </button>
            </>
          )}

          {!paymentLoading && !isSucessfull && !isFreeService && (
            <>
              {/* <Image
                src="/assets/PaymentSucces.svg"
                width="160"
                height="160"
                alt="payment completed"
                className="mx-auto mb-5"
              />  */}

              <h2 className="Tagline lg:text-[40px] md:text-[30px] sm:text-[20px] my-[30px]">
                Payment Failed
              </h2>
              <p className="headline6 pb-[60px] text-[12px] lg:text-[18px] md:text-[18px] text-[color:var(--Black-three)]">
                You can can view the service detail in your profile section
              </p>

              <button
                className="w-[242px] py-4 rounded-lg headline6 my-5 text-center bg-[color:var(--primary1-color)] text-white cursor-pointer"
                onClick={onShown}
              >
                Back Home
              </button>
            </>
          )}

          {isFreeService && (
            <>
              <Image
                src="/assets/PaymentSucces.svg"
                width="160"
                height="160"
                alt="payment completed"
                className="mx-auto mb-5"
              />
              <h2 className="Tagline lg:text-[40px] md:text-[30px] sm:text-[20px] my-[30px]">
                {serviceRequestResponse?.requestData?.package_name ===
                "EMAIL_SERVICE"
                  ? "The email was Sent Successfully."
                  : "Successfully Generated the excel sheet."}
              </h2>
              <p className="headline6 pb-[60px] text-[12px] lg:text-[18px] md:text-[18px] text-[color:var(--Black-three)]">
                {serviceRequestResponse?.requestData?.package_name ===
                "EMAIL_SERVICE"
                  ? "An email has been sent to the recipient email address."
                  : "You can also view the service detail in your profile section"}
              </p>
              <Link
                href={`${serviceRequestResponse?.requestData?.excelLink}`}
                target="_blank"
              >
                <button
                  className="w-[242px] py-4 rounded-lg headline6 my-5 mx-3 text-center bg-[color:var(--primary1-color)] text-white cursor-pointer"
                  // onClick={onShown}
                >
                  Click to download
                </button>
              </Link>

              <button
                className="w-[242px] py-4 rounded-lg headline6 my-5 text-center bg-[color:var(--primary1-color)] text-white cursor-pointer"
                onClick={onShown}
              >
                Back Home
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PaymentComplete;
