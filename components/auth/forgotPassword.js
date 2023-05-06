import React from "react";
import Image from "next/image";
import Logo from "../../public/assets/logo.png";
import {Hidden, TextField} from "@mui/material";
import Link from "next/link";
import {Controller, useForm} from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import AuthLayout from "./layout";
import {useSnackbar} from "notistack";
import apiClient from "../../library/apis/api-client";
import {resetPassSchema} from "./utils/helper";
import {yupResolver} from "@hookform/resolvers/yup";
import {useRouter} from "next/router";

const ForgotPassword = () => {
  const { push } = useRouter();
  const [isSend, setIsSend] = React.useState(false);
  const defaultValues = {
    email: "",
  };

  const { enqueueSnackbar } = useSnackbar();

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(resetPassSchema),
  });

  const { isValid, dirtyFields, isSubmitting, errors } = formState;

  const onSubmit = async (values) => {
    try {
      const response = await apiClient.post(
        `/auth/password-reset-email`,
        values
      );
      if (response.status === 200) {
        setIsSend(true);
        enqueueSnackbar(response.data.message, { variant: "success" });
        setTimeout(() => {
          push("/auth/login");
        }, [3000]);
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      }
    }
    reset();
  };

  return (
    <AuthLayout>
      {!isSend && (
        <form
          name="forgotPasswordForm"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col px-5 py-5 justify-start sm:justify-center items-center h-screen"
        >
          <Hidden smUp>
            <div className="flex justify-center items-center my-10">
              <Image src={Logo} alt="logo" className="h-20 w-full" />
            </div>
          </Hidden>
          <div className="headline4 mb-7 text-left">Forgot password?</div>
          <div className="headline8 text-center mb-14 w-full md:w-96">
            No worries! Just enter your email and we’ll send you a reset
            password link.
          </div>
          <div className=" flex flex-col gap-7 items-center justify-between w-full md:w-96">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  className="bg-white"
                  autoFocus={true}
                  placeholder="Email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>

          <button
            type="submit"
            className="text-white hover:bg-primaryHover cursor-pointer my-5 capitalize p-4 w-full md:w-96 rounded-md font-bold shadow-none hover:shadow-none bg-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <CircularProgress size="22px" sx={{ marginRight: "10px" }} />
                Forget Password
              </div>
            ) : (
              "Forget Password"
            )}
          </button>

          <p className="mx-auto my-7">
            Just remember?
            <Link href="/auth/login">
              <span className="text-blue-600 my-5 text-[color:var(--form-button-color)] cursor-pointer ml-1">
                Sign in
              </span>
            </Link>
          </p>
        </form>
      )}
      {isSend && (
        <div className="flex justify-center items-center flex-col gap-5 h-screen">
          <div>
            An Email has been sent to your account with the reset password link
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
