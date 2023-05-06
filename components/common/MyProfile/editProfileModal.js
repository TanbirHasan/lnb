import { yupResolver } from "@hookform/resolvers/yup";
import { Close, KeyboardArrowRight } from "@mui/icons-material";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import apiClient from "../../../library/apis/api-client";
import { EditProfileSchema } from "../../../schemas/auth/index";
import LoadingButton from "@mui/lab/LoadingButton";
import { Country, State, City } from "country-state-city";
import { UkCities } from "../../../library/utils/UkCity";

const UPDATE_USER = "users/updateUser";

const EditProfile = (props) => {
  const { open, data, setOpen, getProfileData } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [apiLoading, setApiLoading] = React.useState(false);

  const [countries, setCountry] = React.useState([
    {
      currency: "GBP",
      flag: "🇬🇧",
      isoCode: "GB",
      latitude: "54.00000000",
      longitude: "-2.00000000",
      name: "United Kingdom",
      phonecode: "44",
    },
  ]);

  const cities = UkCities;
  const [selectedCountry, setSelectedCountry] = React.useState();

  const [selectedCnCode, setSelectedCode] = React.useState("");
  // const [countryCode, setCountryCode] = useState('');

  useEffect(() => {
    setSelectedCode(selectedCountry?.isoCode);
  }, [selectedCountry]);

  // const getCountryCode = (value) => {
  //   setCountryCode(value);
  // };

  //console.log("country code", countryCode);

  const [logoFile, setLogoFile] = useState("");
  const [defaultValues, setDefaultValues] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    companyType: "",
    country: "",
    city: "",
    countryCode: "",
    postCode: "",
    address: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (!!data) {
      const selectedCountry = countries.filter(
        (item) => item.name === data.country
      );

      setSelectedCode(selectedCountry[0]?.isoCode);
      setDefaultValues({
        userName: data.username || "",
        firstName: data.firstname || "",
        lastName: data.lastname || "",
        email: data?.email || "",
        phone: data?.phoneNumber || "",
        companyName: data?.company_name || "",
        companyWebsite: data?.companyWebsite || "",
        companyType: data?.companyType || "",
        country: data?.country || "",
        city: data?.city || "",
        countryCode: data?.countryCode || "",
        postCode: data?.post_code || "",
        address: data?.Address || "",
      });
    }
    reset(defaultValues);
  }, [data]);

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);
  const logoUploadHandler = (event) => {
    setLogoFile(event.target.files[0]);
  };

  const handelUpload = async () => {
    if (!!logoFile) {
      try {
        const formData = new FormData();
        formData.append("file", logoFile);
        const config = {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
        await apiClient
          .post(`/users/logo-upload`, formData, config)
          .then((res) => {
            if (res.status === 200) {
              enqueueSnackbar("Logo uploaded successfully", {
                variant: "success",
              });
            }
            setLogoFile("");
          });
      } catch (e) {
        enqueueSnackbar(e.message, {
          variant: "error",
        });
      }
    } else {
      console.log("No logo selected");
    }
  };

  // React.useEffect(() => {
  //   if (onSubmitClick) {
  //     handelUpload().then((r) => r);
  //   }
  // }, [onSubmitClick]);

  const { control, formState, handleSubmit, register, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(EditProfileSchema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const onSubmit = async (values) => {
    const data = {
      city: values?.city,
      firstname: values?.firstName,
      lastname: values?.lastName,
      company_name: values?.companyName,
      post_code: values?.postCode,
      email: values?.email,
      phoneNumber: values?.phone,
      companyWebsite: values?.companyWebsite,
      companyType: values?.companyType,
      Address: values?.address,
      country: values?.country,
      countryCode: values?.countryCode,
      provinceOrState: values?.city,
    };

    console.log("data from modal box", data);
    try {
      setApiLoading(true);
      const response = await apiClient.put(`/${UPDATE_USER}`, data);
      if (response.status === 200) {
        enqueueSnackbar("User updated successfully", { variant: "success" });
        handelUpload().then((r) => r);
        setTimeout(() => {
          getProfileData();
        }, [1000]);
        reset();
        setOpen(false);
        setApiLoading(false);
      }
      reset();
    } catch (err) {
      enqueueSnackbar(err?.message, { variant: "error" });
      setApiLoading(false);
    }
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <div className="flex justify-between items-center px-5 mt-3">
          Edit Profile
          <IconButton aria-label="close" onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <form
          name="SigninForm"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col px-5 py-5 justify-start sm:justify-center items-center"
        >
          <div className=" flex flex-col gap-7 items-center justify-between w-full">
            <div className="grid grid-cols-2 gap-5 w-full">
              <div
                className={
                  data?.logoUrl?.length > 1 ? "col-span-1" : "col-span-2"
                }
              >
                <Controller
                  name="logo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        data?.logoUrl?.length > 1
                          ? "Replace Logo"
                          : "Select Logo"
                      }
                      type="file"
                      focused={true}
                      autoFocus={true}
                      className="bg-white col-span-1 md:col-span-3"
                      placeholder="Select Logo"
                      helperText={errors?.logo?.message}
                      variant="outlined"
                      error={!!errors?.logo}
                      fullWidth
                      onChange={(event) => {
                        logoUploadHandler(event);
                      }}
                      inputProps={{
                        accept: "image/png, image/gif, image/jpeg",
                      }}
                    />
                  )}
                />
              </div>
              {!!data && data?.logoUrl && (
                <div>
                  <div>
                    <div className="text-base font-medium">Previous image:</div>
                    <div>{data.logoUrl}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    type="text"
                    disabled={true}
                    className="bg-white col-span-1 md:col-span-2 w-full"
                    autoFocus={true}
                    placeholder="Username"
                    helperText={errors?.userName?.message}
                    variant="outlined"
                    error={!!errors?.userName}
                    required
                    fullWidth
                  />
                )}
              />
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    type="text"
                    className="bg-white col-span-1 w-full"
                    autoFocus={true}
                    placeholder="First Name"
                    helperText={errors?.firstName?.message}
                    variant="outlined"
                    error={!!errors?.firstName}
                    required
                    fullWidth
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    type="text"
                    className="bg-white col-span-1 w-full"
                    autoFocus={true}
                    placeholder="Last Name"
                    helperText={errors?.lastName?.message}
                    variant="outlined"
                    error={!!errors?.lastName}
                    required
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
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
                    helperText={errors?.email?.message}
                    variant="outlined"
                    error={!!errors?.email}
                    required
                    fullWidth
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    type="text"
                    className="bg-white"
                    autoFocus={true}
                    placeholder="Phone"
                    helperText={errors?.phone?.message}
                    variant="outlined"
                    error={!!errors?.phone}
                    required
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Name"
                    type="text"
                    className="bg-white"
                    autoFocus={true}
                    placeholder="Company Name"
                    helperText={errors?.companyName?.message}
                    variant="outlined"
                    error={!!errors?.companyName}
                    required
                    fullWidth
                  />
                )}
              />
              <Controller
                name="companyWebsite"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Website"
                    type="text"
                    className="bg-white"
                    autoFocus={true}
                    placeholder="Company Website"
                    helperText={errors?.companyWebsite?.message}
                    variant="outlined"
                    error={!!errors?.companyWebsite}
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-5 w-full">
              <Controller
                name="companyType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Type"
                    type="text"
                    className="bg-white"
                    autoFocus={true}
                    placeholder="Company Type"
                    helperText={errors?.companyType?.message}
                    variant="outlined"
                    error={!!errors?.companyType}
                    required
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full">
              {countries && (
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Country"
                      select
                      defaultValue=""
                      fullWidth
                      className="bg-white"
                      error={!!errors.country}
                      helperText={errors?.country?.message}
                    >
                      {countries.map((item) => (
                        <MenuItem
                          key={item.name}
                          value={item.name}
                          onClick={() => setSelectedCountry(item)}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              )}

              {/* <Controller
                  name="city"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="State/City"
                      select
                      
                      fullWidth
                      className="bg-white"
                      error={!!errors.city}
                      helperText={errors?.city?.message}
                    >
                      {states?.map((item) => (
                        <MenuItem
                          key={item.name}
                          value={item.name}
                          label={item.name}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                /> */}

              <Controller
                name="city"
                control={control}
                defaultValue=""
                render={({ field: { value, onChange, onBlur } }) => (
                  <Autocomplete
                    options={cities}
                    className="bg-white"
                    value={value}
                    onChange={(event, newValue) => {
                      const newValueSelected = newValue
                        ? newValue
                        : event.target.value;
                      onChange(newValueSelected);
                    }}
                    onBlur={(event) => {
                      const newCity = event.target.value;
                      onChange(newCity);
                      onBlur();
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City"
                        variant="outlined"
                        error={!!errors.city}
                        helperText={errors?.city?.message}
                      />
                    )}
                    freeSolo
                  />
                )}
              />

              {/* <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country Code"
                    type="text"
                    className="bg-white"
                    autoFocus={true}
                    placeholder="Country Code"
                    helperText={errors?.countryCode?.message}
                    variant="outlined"
                    error={!!errors?.countryCode}
                    required
                    fullWidth
                  />
                )}
              /> */}

              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country Code"
                    select
                    defaultValue=""
                    fullWidth
                    className="bg-white"
                    error={!!errors.countryCode}
                    helperText={errors?.countryCode?.message}
                  >
                    <MenuItem value={selectedCnCode}>{selectedCnCode}</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                name="postCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Post Code"
                    type="text"
                    className="bg-white"
                    autoFocus={true}
                    placeholder="Post Code"
                    helperText={errors?.postCode?.message}
                    variant="outlined"
                    error={!!errors?.postCode}
                    required
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    type="text"
                    multiline={true}
                    rows={5}
                    className="bg-white"
                    autoFocus={true}
                    placeholder="Address"
                    helperText={errors?.address?.message}
                    variant="outlined"
                    error={!!errors?.address}
                    required
                    fullWidth
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center w-full mt-7">
            <LoadingButton
              size="small"
              type="submit"
              endIcon={<KeyboardArrowRight />}
              loading={apiLoading}
              loadingPosition="end"
              variant="contained"
              sx={{ color: "#fff" }}
            >
              <span className="my-2 mx-2 px-2 text-base capitalize">
                Update
              </span>
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
