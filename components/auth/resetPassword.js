import React from "react";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Hidden, IconButton, InputAdornment, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import AuthLayout from "./layout";
import CircularProgress from "@mui/material/CircularProgress";
import { resetpassschema } from "./utils/helper";
import Logo from "../../public/assets/logo.png";
import axios from "axios";

const ResetPassword = () => {
  const { query, push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = React.useState(false);
  const defaultValues = {
    password: "",
    confirmPassword: "",
  };
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(resetpassschema),
  });
  const { isValid, dirtyFields, isSubmitting, errors } = formState;

  const onSubmit = async (values) => {
    const data = {
      newPassword: values.password,
    };
    try {
      const config = {
        headers: {
          "x-access-token": query?.id,
        },
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password-reset`,
        data,
        config
      );
      if (response.status === 200) {
        enqueueSnackbar(response?.data?.message, { variant: "success" });
        reset(defaultValues);
        setTimeout(() => {
          push("/auth/login");
        }, [2000]);
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        enqueueSnackbar(err?.response?.data?.message, { variant: "error" });
      }
    }
  };

  return (
    <AuthLayout>
      <form
        name="resetPasswordForm"
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
        <div className="headline4 mb-7 text-left">Reset Password</div>
        <div className="headline8 text-center mb-14 w-full md:w-96">
          Please create a new password that you don’t use on any other site.
        </div>
        <div className=" flex flex-col gap-5 items-center justify-between w-full md:w-96">
          <Controller
            name="password"
            control={control}
            rules={{
              required: true,
              validate: (value) => {
                if (value === "") {
                  return "Please provide input name";
                }
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="New Password"
                type={showPassword ? "text" : "password"}
                className="bg-white"
                autoFocus={true}
                placeholder="New Password"
                error={!!errors.password}
                helperText={errors?.password?.message}
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: true,
              validate: (value) => {
                if (value === "") {
                  return "Please provide input name";
                }
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                className="bg-white"
                autoFocus={true}
                placeholder="Confirm Password"
                error={!!errors.confirmPassword}
                helperText={errors?.confirmPassword?.message}
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <button
            type="submit"
            className="text-white hover:bg-primaryHover cursor-pointer my-5 capitalize p-4 w-full md:w-96 rounded-md font-bold shadow-none hover:shadow-none bg-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <CircularProgress size="22px" sx={{ marginRight: "10px" }} />
                Change Password
              </div>
            ) : (
              "  Reset Password"
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
