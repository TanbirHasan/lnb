import {yupResolver} from "@hookform/resolvers/yup";
import {Close, KeyboardArrowRight, Visibility, VisibilityOff,} from "@mui/icons-material";
import {Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, TextField,} from "@mui/material";
import {useSnackbar} from "notistack";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import apiClient from "../../../library/apis/api-client";
import {changePasswordSchema} from "../../auth/utils/helper";
import LoadingButton from "@mui/lab/LoadingButton";

const EditProfile = (props) => {
  const { open, setOpen } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = React.useState(false);
  const [apiLoading, setApiLoading] = React.useState(false);

  const [defaultValues, setDefaultValues] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const { control, formState, handleSubmit, register, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(changePasswordSchema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async (values) => {
    const data = {
      oldPassword: values?.oldPassword,
      newPassword: values?.newPassword,
    };
    try {
      setApiLoading(true);
      const response = await apiClient.put(`/auth/updatePassword`, data);
      if (response.status === 200) {
        enqueueSnackbar(response?.data?.message, { variant: "success" });
        reset();
        setOpen(false);
        setApiLoading(false);
      }
      reset();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      setApiLoading(false);
    }
    reset();
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <div className="flex justify-between items-center px-5 mt-3">
          Change Password
          <IconButton aria-label="close" onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <form
          name="updatePasswordForm"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col px-5 py-5 justify-start sm:justify-center items-center"
        >
          <div className=" flex flex-col gap-7 items-center justify-between w-full">
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Old Password"
                  type={showPassword ? "text" : "password"}
                  className="bg-white col-span-1 md:col-span-2 w-full"
                  autoFocus={true}
                  placeholder="Previous Password"
                  helperText={errors?.oldPassword?.message}
                  variant="outlined"
                  error={!!errors?.oldPassword}
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
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  className="bg-white col-span-1 w-full"
                  autoFocus={true}
                  placeholder="New Password"
                  helperText={errors?.newPassword?.message}
                  variant="outlined"
                  error={!!errors?.newPassword}
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
          </div>
          <div className="flex justify-end items-center w-full mt-7">
            <LoadingButton
              size="small"
              type="submit"
              endIcon={<KeyboardArrowRight />}
              loading={apiLoading}
              loadingPosition="end"
              variant="contained"
              color="primary"
            >
              <span>Update Password</span>
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
