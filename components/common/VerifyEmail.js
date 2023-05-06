import * as React from "react";
import Slide from "@mui/material/Slide";
import { useSnackbar } from "notistack";
import apiClient from "../../library/apis/api-client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [loading, setLoading] = React.useState(false);
  const [isSent, setIsSent] = React.useState(true);
  const { enqueueSnackbar } = useSnackbar([]);
  const router = useRouter();

  const handleVerifyEmailSender = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email`
      );
      if (res?.data?.status === 200) {
        enqueueSnackbar(res?.data?.message, { variant: "success" });
        setLoading(false);
        setTimeout(() => {
          // setIsSent(true);
        }, 500);
      }
    } catch (e) {
      enqueueSnackbar("Please contact LNB for help", { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/self/profile`
        );
        if (result.status === 200) {
          if (result.data.data.isVerified === true) {
            Cookies.set("isVerified", result.data.data.isVerified);
            router.push('/')
          }
          console.log("This user is not verified still now");
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full md:w-2/4 mx-auto mt-20 p-5 shadow-md">
      <div className="my-10">
        <div className="text-center">
          {!!isSent && (
            <div className="text-2xl font-semibold text-center ">
              Email verification link has already been sent to your email
            </div>
          )}
          {/*{!isSent && (*/}
          {/*  <div className="text-2xl font-semibold text-center ">*/}
          {/*    Verify your email*/}
          {/*  </div>*/}
          {/*)}*/}
          {/*{!isSent && (*/}
          {/*  <div className="text-xl text-gray-500 font-base text-center ">*/}
          {/*    You will need to verify your email*/}
          {/*  </div>*/}
          {/*)}*/}

          <div className="flex justify-center align-center">
            {!!isSent && (
              <img
                src="/assets/emailSent.png"
                className=" w-96 h-80 flex justify-center"
                alt="Send Emaiil"
              />
            )}
            {/*{!isSent && (*/}
            {/*  <img*/}
            {/*    src="/assets/emailsend.png"*/}
            {/*    className=" w-96 h-80 flex justify-center w-full"*/}
            {/*    alt="Send Emaiil"*/}
            {/*  />*/}
            {/*)}*/}
          </div>
          {!!isSent && (
            <div>
              <div className="px-10 md:px-14">
                An email has been sent to your email with a link to verify your
                account. If you have not received the email after a few minutes,
                please check your spam folder.
              </div>
              <div className=" flex gap-5 mx-auto items-center justify-center">
                {/*<button*/}
                {/*  className="px-5 py-3  my-10 rounded-md bg-primary  text-white font-bold"*/}
                {/*  onClick={() => {*/}
                {/*    setTimeout(() => {*/}
                {/*      router.push("/");*/}
                {/*    }, 500);*/}
                {/*  }}*/}
                {/*>*/}
                {/*  Go to Home*/}
                {/*</button>*/}
                <button
                  className="px-5 py-3  my-10 rounded-md bg-primary  text-white font-bold"
                  onClick={handleVerifyEmailSender}
                >
                  Resend
                </button>
              </div>
            </div>
          )}
          {/*{!isSent && (*/}
          {/*  <button*/}
          {/*    className="px-5 py-3  my-10 rounded-md bg-primary  text-white font-bold"*/}
          {/*    onClick={handleVerifyEmailSender}*/}
          {/*  >*/}
          {/*    Verify Email*/}
          {/*  </button>*/}
          {/*)}*/}
        </div>
      </div>
    </div>
  );
}
