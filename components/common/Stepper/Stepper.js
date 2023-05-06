import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { serviceResquestResponseRecoilState } from "../../../store/atoms/serviceRequestResponseRecoil";
import { checkoutRequestClient } from "../../../library/utils/queryClient";
import StripeCheckout from "react-stripe-checkout";
import { useSnackbar } from "notistack";
import { LinearProgress } from "@mui/material";
import { companyListRecoilState } from "../../../store/atoms/companyListRecoil";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { finalStepRecoil } from "../../../store/atoms/finalStepState";
import { priceRecoil } from "../../../store/atoms/priceRecoil";
import apiClient from "../../../library/apis/api-client";
import { DownlaodLargeData } from "../../../store/atoms/DownloadLargeData";

const Stepper = ({ children }) => {
  const [hydrated, setHydrated] = useState(false);

  const route = useRouter();



  const downloadLargeData = useRecoilValue(DownlaodLargeData)
  const [active, setActive] = useState(true);
  const [serviceRequestResponse, setServiceRequestResponse] = useRecoilState(
    serviceResquestResponseRecoilState
  );

  const priceValue = useRecoilValue(priceRecoil);
  // console.log('price Request',priceValue?.MAIL_PRINT_SERVICE);

  const [stripeToken, setStripeToken] = useState(null);
  const [stripePublicKey, setStripePublicKey] = useState();
  const [showCheckout, setShowCheckout] = useState(false);
  const [totalAmount, setTotalAmount] = useState(null);
  const onToken = (token) => {
    window.scrollTo({ top: 800, behavior: "smooth" });
    setStripeToken(token);
  };
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isSucessfull, setIsSucessfull] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const selectedCompanyData = useRecoilValue(companyListRecoilState)
  const [selectedCompanyData, setSelectedCompanyData] = useRecoilState(
    companyListRecoilState
  );
  const router = useRouter();
  const [finalStepValue, setFinalStep] = useRecoilState(finalStepRecoil);

  useEffect(() => {
    setTotalAmount(
      serviceRequestResponse?.requestData?.companyList?.length *
        priceValue?.MAIL_PRINT_SERVICE
    );
  }, [priceValue, serviceRequestResponse]);
  // console.log("Total Amount",totalAmount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/retrievePublicStripeKeys`
        );
        if (res.data.status === 200) {
          setStripePublicKey(res.data.stripe_pk);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
    // const interval = setInterval(() => {
    //   fetchData();
    // }, 5000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      route.pathname === "" ||
      route.pathname === "/" ||
      route.pathname === "/home" ||
      route.pathname === "/home/" ||
      route.pathname === "/profile"
    ) {
      if (serviceRequestResponse?.response) {
        setServiceRequestResponse({});
      }
    }

    if (
      route.pathname !== "/stepperpages/emailservice" &&
      route.pathname !== "/stepperpages/step4" &&
      route.pathname !== "/stepperpages/paymentcomplete"
    ) {
      setFinalStep("Payment");
    }

    if (route.pathname === "/stepperpages/step3") {
      setActive(false);
      if (selectedCompanyData.length < 1) {
        enqueueSnackbar("Please select some companies first", {
          variant: "error",
        });
        router.push("/stepperpages/step2");
        return;
      }
    } else if (route.pathname === "/stepperpages/emailservice") {
      setActive(false);
    } else if (route.pathname === "/stepperpages/paymentcomplete") {
      if (
        !serviceRequestResponse?.response &&
        serviceRequestResponse?.requestData?.package_name !==
          "DOWNLOAD_SERVICE" &&
        serviceRequestResponse?.requestData?.package_name !== "EMAIL_SERVICE"
      ) {
        enqueueSnackbar("Please make the payment", { variant: "error" });
        route.push("/stepperpages/step4");
        return;
      }
      setActive(false);
    } else if (route.pathname === "/stepperpages/step4") {
      if (!serviceRequestResponse?.requestData?.package_name) {
        enqueueSnackbar("Please choose a service", { variant: "error" });
        route.push("/stepperpages/step3");
        return;
      }
      setActive(false);
      setShowCheckout(true);
    } else {
      setActive(true);
    }
  }, [route]);

  const handleRoute = () => {
    if (router.pathname == "/stepperpages/step1") {
      router.push("/stepperpages/step2");
    } else if (router.pathname == "/stepperpages/step2") {
      if (selectedCompanyData.length < 1) {
        enqueueSnackbar("Please select some companies first", {
          variant: "error",
        });
        return;
      }
      else{
        if(downloadLargeData){
          router.push("/stepperpages/emailservice");
        }
        else{
          router.push("/stepperpages/step3");
        }
      }
     
    }
    













    // else if (router.pathname == "/stepperpages/step4") {
    //   router.push("/stepperpages/paymentcomplete");
    // }
    else {
      router.push("/stepperpages/step4");
    }
  };

  useEffect(() => {
    const makeRequest = async () => {
      if (!serviceRequestResponse?.requestData?.package_name) {
        enqueueSnackbar("Please choose service before checkout", {
          variant: "error",
        });
        return;
      }

      try {
        // console.log("stripeToken.id -> ", stripeToken.id);
        // console.log("stripeToken.id -> ", stripeToken);
        setIsSucessfull(false);
        setPaymentLoading(true);

        const payload = {
          service_request_id: serviceRequestResponse?.requestData?._id,
          paid_amount: totalAmount,
          token: stripeToken,
        };

        const response = await checkoutRequestClient(payload);
        // console.log("payment", response);

        if (response.status === 200) {
          setPaymentLoading(false);
          setIsSucessfull(true);
          setServiceRequestResponse((prev) => ({
            ...prev,
            response: response.data,
          }));
          setSelectedCompanyData([]);

          // router.push("/stepperpages/paymentcomplete");
        } else if (response.status === 500) {
          enqueueSnackbar(
            response.data?.message
              ? response.data.message
              : "Payment could not be processed",
            { variant: "error" }
          );
        }
      } catch (e) {
        // console.log("stripe err", e);
        enqueueSnackbar("Payment could not be processed", { variant: "error" });
        setPaymentLoading(false);
      }
    };
    stripeToken && makeRequest();
  }, [stripeToken]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  return (
    <div className="px-5 lg:px-20 md:px-5 xl:px-20 w-full mx-auto sm:w-10/12">
      <ul className="flex hover:shadow-xl duration-500 justify-between mt-10  border-2 border-solid">
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row lg:justify-center md:justify-center xl:justify-center items-center border-r-2 py-5 w-1/4 ">
          <span
            className={` ${
              route.pathname === "/stepperpages/step1"
                ? "border-2 boder-solid rounded-full p-1 text-center w-10 h-10 border-amber-600 text-amber-600"
                : ""
            }`}
          >
            {route.pathname === "/stepperpages/step1" ? (
              "1"
            ) : (
              <CheckCircleOutlineIcon className="text-3xl" />
            )}
          </span>
          {/* <Link href="/stepperpages/totalcompany"> */}
          <Link href="/stepperpages/step1">
            <span
              className={`ml-0 cursor-pointer text-center md:ml-3 lg:ml-3 xl:ml-3 ${
                route.pathname == "/stepperpages/step1"
                  ? "text-amber-600 rounded"
                  : ""
              } `}
            >
              Total Company
            </span>
          </Link>
        </div>
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row lg:justify-center md:justify-center xl:justify-center items-center border-r-2 py-5 w-1/4">
          <span
            className={` ${
              route.pathname === "/stepperpages/step1"
                ? "border-2 boder-solid rounded-full  p-1 text-center w-10 h-10 "
                : ""
            } ${
              route.pathname === "/stepperpages/step2"
                ? "border-2 boder-solid rounded-full  p-1 text-center w-10 h-10 border-amber-600"
                : ""
            }`}
          >
            {route.pathname === "/stepperpages/step2" ||
            route.pathname === "/stepperpages/step1" ? (
              "2"
            ) : (
              <CheckCircleOutlineIcon className="text-3xl" />
            )}
          </span>
          {/* <Link href="/stepperpages/companylistpage"> */}
          <Link href="/stepperpages/step2">
            <span
              className={`ml-0 cursor-pointer text-center md:ml-3 lg:ml-3 xl:ml-3 ${
                route.pathname == "/stepperpages/step2"
                  ? "text-amber-600 rounded"
                  : ""
              } `}
            >
              Company List
            </span>
          </Link>
        </div>
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row lg:justify-center md:justify-center xl:justify-center items-center border-r-2 py-5 w-1/4">
          <span
            className={` ${
              route.pathname === "/stepperpages/step1" ||
              route.pathname === "/stepperpages/step2"
                ? "border-2 boder-solid rounded-full  p-1 text-center w-10 h-10"
                : ""
            } ${
              route.pathname === "/stepperpages/step3" ||
              route.pathname === "/stepperpages/companylistsender" ||
              route.pathname === "/stepperpages/emailservice" ||
              route.pathname === "/stepperpages/previewtemplate"
                ? "border-2 boder-solid rounded-full  p-1 text-center w-10 h-10 border-amber-600 text-amber-600"
                : ""
            }`}
          >
            {route.pathname === "/stepperpages/step4" ||
            route.pathname === "/stepperpages/paymentcomplete" ? (
              <CheckCircleOutlineIcon className="text-3xl" />
            ) : (
              "3"
            )}
          </span>
          {/* <Link href="/stepperpages/selectoptionpage"> */}
          <Link
            className={`${
              selectedCompanyData.length > 0
                ? "cursor-pointer"
                : "pointer-events-none"
            }`}
            href={"/stepperpages/step3"}
          >
            <span
              className={`ml-0 cursor-pointer text-center md:ml-3 lg:ml-3 xl:ml-3 ${
                route.pathname == "/stepperpages/step3" ||
                route.pathname == "/stepperpages/emailservice" ||
                route.pathname == "/stepperpages/templatedesign" ||
                route.pathname == "/stepperpages/companylistsender" ||
                route.pathname == "/stepperpages/previewtemplate"
                  ? "text-amber-600 rounded"
                  : ""
              }
              ${
                selectedCompanyData.length > 0
                  ? "cursor-pointer"
                  : "pointer-events-none"
              }

              `}
            >
              Select Option
            </span>
          </Link>
        </div>
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row lg:justify-center md:justify-center xl:justify-center items-center border-r-2 py-5 w-1/4">
          <span
            className={`${
              route.pathname === "/stepperpages/step4"
                ? "border-2 boder-solid rounded-full  p-1 text-center w-10 h-10 border-amber-600 text-amber-600"
                : " "
            } ${
              route.pathname === "/stepperpages/paymentcomplete"
                ? ""
                : "border-2 boder-solid rounded-full  p-1 text-center w-10 h-10"
            } `}
          >
            {route.pathname === "/stepperpages/paymentcomplete" ? (
              <CheckCircleOutlineIcon className="text-3xl" />
            ) : (
              "4"
            )}
          </span>
          {/* <Link href="/stepperpages/payment"> */}
          <Link
            className={`${
              serviceRequestResponse.requestData
                ? "cursor-pointer"
                : "pointer-events-none"
            }`}
            href="/stepperpages/step4"
          >
            <span
              className={`ml-0 cursor-pointer text-center md:ml-3 lg:ml-3 xl:ml-3 ${
                route.pathname == "/stepperpages/step4"
                  ? "text-amber-600 rounded"
                  : ""
              }
              ${
                serviceRequestResponse.requestData
                  ? "cursor-pointer"
                  : "pointer-events-none"
              }
               `}
            >
              {finalStepValue}
            </span>
          </Link>
        </div>
      </ul>
      {!paymentLoading && children}

      {paymentLoading && (
        <>
          <LinearProgress />
          <h2 className="Tagline lg:text-[40px] md:text-[30px] sm:text-[20px] my-[30px]">
            Your payment is being processed
          </h2>
          {serviceRequestResponse?.requestData?.package_name ===
            "DOWNLOAD_SERVICE" ||
          serviceRequestResponse?.requestData?.package_name ===
            "EMAIL_SERVICE" ? (
            <p className="headline6 pb-[60px] text-[12px] lg:text-[18px] md:text-[18px] text-[color:var(--Black-three)]">
              Download link will be available shortly....
            </p>
          ) : (
            ""
          )}
        </>
      )}
      <div
        className={`flex  items-center ${
          showCheckout ? "justify-end font-bold" : "justify-between"
        }`}
      >
        {!showCheckout && <div></div>}

        {/* <button
          className="rounded px-3 py-2 border-2 border-[#D16F32] text-[#D16F32] cursor-pointer"
          onClick={handleBack}
        >
          Back
        </button> */}
        {active && (
          <button
            className="headline6 bg-[color:var(--form-button-color)] text-white cursor-pointer my-5 border-none py-2 px-5 rounded-lg"
            onClick={handleRoute}
          >
            Continue To Next Step
          </button>
        )}

        {showCheckout && !paymentLoading && !!stripePublicKey && (
          <StripeCheckout
            name="Local New Business"
            // image="https://lnb-data.s3.eu-west-2.amazonaws.com/logos/LNBLogo.png"
            billingAddress
            shippingAddress
            description={`Your total is £ ${totalAmount}`}
            amount={totalAmount * 100}
            token={onToken}
            currency="GBP"
            // stripeKey={`${process.env.STRIPE_PUBLIC_KEY}`}
            stripeKey={stripePublicKey}
            // stripeKey={
            //   "pk_test_51LzjiLKxA1nMm4Zk1XBA05wuv8Ugj5CNIvFET7shLNeGO3FPLl7m4Xplt8MOk0rr2qrV7HU2pjhU4ob4lzs7C23R00NxQjLJuq"
            // }
          >
            <button
              className="headline6 animate-bounce hover:animate-none hover:bg-blue-400 transition duration-500 bg-[color:var(--form-button-color)] text-white cursor-pointer my-5 border-none py-2 px-5 rounded-lg"
              onClick={handleRoute}
            >
              Checkout
            </button>
          </StripeCheckout>
        )}
      </div>
    </div>
  );
};

export default Stepper;
