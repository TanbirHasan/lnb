import * as React from "react";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import apiClient from "../../library/apis/api-client";
import { useRouter } from "next/router";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function EmailVerifiedPage() {
  const [loading, setLoading] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar([]);
  const { query, push } = useRouter();

  const handleVerifyEmailSender = async (token) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/email-verify/${token}`
      );
      if (res?.data?.status === 200) {
        setIsVerified(true);
        setLoading(false);
      }
    } catch (e) {
      setIsVerified(false);
      enqueueSnackbar("Please contact LNB for support", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!!query.slug) {
      handleVerifyEmailSender(query.slug);
    }
  }, [query.slug]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && !!query.slug && (
        <div className="w-full md:w-2/4 mx-auto mt-20 p-5 shadow-md">
          <div className="my-10">
            {!!isVerified && (
              <div className="text-center">
                <CheckCircleOutlineOutlinedIcon className="text-green-500 h-[100px] w-[100px]" />
                <div className="text-xl text-green-500 font-semibold text-center my-5">
                  Congratulations !!
                </div>
                <div className="text-2xl  font-semibold text-center ">
                  Your Account verified successfully.
                </div>
                <button
                  className="px-5 py-3  my-10 rounded-md bg-primary  text-white font-bold"
                  onClick={() => {
                    setTimeout(() => {
                      push("/auth/login");
                    }, 500);
                  }}
                >
                  Home
                </button>
              </div>
            )}
            {!isVerified && (
              <div className="text-center">
                <CancelOutlinedIcon className="text-red-500 h-[100px] w-[100px]" />
                <div className="text-xl text-red-500 font-semibold text-center my-5">
                  Sorry !!
                </div>
                <div className="text-2xl  font-semibold text-center ">
                  Your Account is not verified.
                </div>
                <div className="flex gap-5 items-center justify-center mx-auto">
                  <button
                    className="px-5 py-3  my-10 rounded-md bg-primary  text-white font-bold"
                    onClick={() => {
                      setTimeout(() => {
                        push("/auth/login");
                      }, 500);
                    }}
                  >
                    Home
                  </button>
                  <button
                    className="px-5 py-3  my-10 rounded-md bg-primary  text-white font-bold"
                    onClick={() => {
                      setTimeout(() => {
                        push("/email-verify");
                      }, 500);
                    }}
                  >
                    Resend
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
