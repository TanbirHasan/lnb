import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  Divider,
  MenuItem,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { UpdateInfoSchema } from "../../../../schemas/auth";
import apiClient from "../../../../library/apis/api-client";
import { useRecoilState, useRecoilValue } from "recoil";
import { senderDataRecoil } from "../../../../store/atoms/senderDataRecoil";
import { Country, State, City } from "country-state-city";
import { UkCities } from "../../../../library/utils/UkCity";

const UpdateUserInfo = (props) => {
  const {
    open,
    setOpen,
    userProfile,
    buttonActive,
    setActive,
    setNewSenderData,
    companyData,
  } = props;

  const country = [
    { countryName: "USA", countryCode: "US" },
    { countryName: "CANADA", countryCode: "CA" },
    { countryName: "ENGLAND", countryCode: "GB" },
  ];

  const [senderData, setSenderdata] = useRecoilState(senderDataRecoil);
  const [logoFile, setLogoFile] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const senderInfo = useRecoilValue(senderDataRecoil);

  const [prevlogo, setPrevLogo] = useState();

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

  useEffect(() => {
    setSelectedCode(selectedCountry?.isoCode);
  }, [selectedCountry]);

  // console.log("sender info from modal", senderInfo);

  const [defaultValues, setDefaultValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    country: "",
    city: "",
    countryCode: "",
    postCode: "",
    address: "",
    logoUrl: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const { control, formState, handleSubmit, register, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(UpdateInfoSchema),
  });

  // console.log("senders data from index", senderData);

  // Creating new senders data

  React.useEffect(() => {
    if (!buttonActive) {
      setDefaultValues({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyName: "",
        city: "",
        country: "",
        companyWebsite: "",
        countryCode: "",
        postCode: "",
        address: "",
        logoUrl: "",
      });
    } else if (Object.keys(senderInfo).length !== 0 && buttonActive) {
      const selectedCountry = countries.filter(
        (item) => item.name === senderInfo.country
      );

      setSelectedCode(selectedCountry[0]?.isoCode);
      setDefaultValues({
        firstName: senderInfo?.firstName,
        lastName: senderInfo?.lastName,
        email: senderInfo?.email,
        phone: senderInfo?.phone,
        companyName: senderInfo?.companyName,
        city: senderInfo?.city,
        country: senderInfo?.country,
        companyWebsite: senderInfo?.website,
        countryCode: senderInfo?.countryCode,
        postCode: senderInfo?.postcode,
        address: senderInfo?.address,
        logoUrl: senderInfo?.logoUrl || "no url",
      });
    } else {
      //console.log( "This is from u seEffect sender and userprofile data condition", userProfile);
      setDefaultValues({
        firstName: userProfile.firstname || "",
        lastName: userProfile.lastname || "",
        email: userProfile?.email || "",
        phone: userProfile?.phoneNumber || "",
        companyName: userProfile?.company_name || "",
        city: userProfile?.city,
        country: userProfile?.country,
        companyWebsite: userProfile?.companyWebsite || "",
        countryCode: userProfile?.countryCode || "",
        postCode: userProfile?.post_code || "",
        address: userProfile?.Address || "",
        logoUrl: "no url",
      });
    }
    reset(defaultValues);
  }, [userProfile, senderInfo]);

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  //console.log("logo", logoFile);
  const { isValid, dirtyFields, errors } = formState;
  const onSubmit = async (values) => {
    //console.log(values, checked);

    const data = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      companyName: values?.companyName,
      email: values?.email,
      postcode: values?.postCode,
      phone: values?.phone,
      website: values?.companyWebsite,
      city: values?.city,
      address: values?.address,
      country: values?.country,
      countryCode: values?.countryCode,
      logoUrl: values?.logoUrl,
    };

    setPrevLogo(values?.logoUrl);

    if (values?.companyName === userProfile?.company_name) {
      enqueueSnackbar("Cannot Update Main Profile From Sender Information", {
        variant: "error",
      });
    } else if (!!logoFile) {
      handelUpload(data);
    } else if (!logoFile) {
      const selectedCompany = companyData.find(
        (item) => item.companyName === data.companyName
      );
      if (selectedCompany) {
        updateSendersData(data);
      } else {
        data.logoUrl = "No Url";

        CreatSendersData(data);
      }
    } else {
      // console.log("Here I am Craete Sender Data")
      data.logoUrl = "No Url";
      CreatSendersData(data);
    }

    // console.log("Values after form submit",values)

    setActive(true);

    reset();
    setOpen(false);
  };

  const logoUploadHandler = (event) => {
    setLogoFile(event.target.files[0]);
  };

  const handelUpload = async (data) => {
    if (!!logoFile) {
      const formData = new FormData();
      formData.append("file", logoFile);

      formData.append("prevKey", prevlogo);
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await apiClient
        .post(`/users/client-logo-upload`, formData, config)
        .then((res) => {
          if (res.status === 200) {
            //  console.log("Logo upload successfull response", res);

            const newdata = {
              firstName: data?.firstName,
              lastName: data?.lastName,
              companyName: data?.companyName,
              email: data?.email,
              postcode: data?.postcode,
              phone: data?.phone,
              website: data?.website,
              city: data?.city,
              address: data?.address,
              country: data?.country,
              countryCode: data?.countryCode,
              logoUrl: res.data.name,
            };

            const selectedCompany = companyData.find(
              (item) => item.companyName === data.companyName
            );

            if (selectedCompany) {
              updateSendersData(newdata);
            } else {
              CreatSendersData(newdata);
            }

            enqueueSnackbar("Logo uploaded successfully", {
              variant: "success",
            });
          }
          setLogoFile("");
        });
    }
  };

  // function for calling createSenderData

  const CreatSendersData = async (data) => {
    try {
      const res = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sendersData/createSendersData`,
        JSON.stringify(data)
      );
      if (res.status === 200) {
        // console.log("create data sender list req",res)
        enqueueSnackbar("New Sender Information Created successfully", {
          variant: "success",
        });
        setNewSenderData(true);
        setSenderdata(data);
        // console.log(res?.data);
      }
    } catch (e) {
      enqueueSnackbar("Please Enter a new Company Name", {
        variant: "error",
      });
      // console.log("company list sender error", e);
    }
  };

  const updateSendersData = async (data) => {
    //   console.log("Data from handle upload", data);

    try {
      const res = await apiClient.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sendersData/updateSendersData`,
        JSON.stringify(data)
      );
      if (res.status === 200) {
        enqueueSnackbar("Sender Data Updated Successfully", {
          variant: "success",
        });
        setNewSenderData(true);
        setSenderdata(data);
        // console.log(res?.data);
      }
    } catch (e) {
      enqueueSnackbar("Please Enter a new Company Name", {
        variant: "error",
      });
      // console.log("company list sender error", e);
    }
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <div className="px-5">
          {buttonActive ? (
            <h2 className="text-xl mb-5">Edit Sender Information</h2>
          ) : (
            <h2 className="text-xl mb-5">Add Sender Information</h2>
          )}

          <Divider />
        </div>

        <form
          name="unserinfoUpdate"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col px-5 py-5 justify-start sm:justify-center items-center"
        >
          <div className=" flex flex-col gap-7 items-center justify-between w-full">
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Select Logo"
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
                  inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                />
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
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
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    className="bg-white col-span-1 md:col-span-2 w-full"
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {Object.keys(senderInfo)?.length !== 0 && buttonActive ? (
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
                      disabled
                      fullWidth
                    />
                  )}
                />
              ) : (
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
                      //disabled
                      fullWidth
                    />
                  )}
                />
              )}

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
              <Controller
                name="companyWebsite"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Website"
                    type="text"
                    className="bg-white col-span-1 md:col-span-2 w-full"
                    autoFocus={true}
                    placeholder="Company Website"
                    helperText={errors?.companyWebsite?.message}
                    variant="outlined"
                    error={!!errors?.companyWebsite}
                    required
                    fullWidth
                  />
                )}
              />

              {/* country / state /city */}

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
                      className="bg-white col-span-1 w-full"
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

              <Controller
                name="city"
                control={control}
                defaultValue=""
                render={({ field: { value, onChange, onBlur } }) => (
                  <Autocomplete
                    options={cities}
                    className="bg-white col-span-1"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
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
              {/* <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country Code"
                    type="text"
                    className="bg-white col-span-1 w-full"
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
                name="postCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Post Code"
                    type="text"
                    className="bg-white col-span-1 w-full"
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
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    type="text"
                    multiline={true}
                    rows={1}
                    className="bg-white col-span-1 md:col-span-2 w-full"
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
          <div className="w-full mt-5 ml-5">
            {/* <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                }
                label="I agree to let Local New Business to save my data for future use, wherever applicable."
              />
            </FormGroup> */}
            {/* <div className="flex items-center">
              <h3 className="mr-2">
                Do you agree to let Local New Business to save your data for
                future use, wherever applicable?
              </h3>
              <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => handleChecked(e.target.checked)}
                    />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={unchecked}
                      onChange={(e) => handleUnchecked(e.target.checked)}
                    />
                  }
                  label="No"
                />
              </FormGroup>
            </div> */}
          </div>
          <div className=" w-full mt-7">
            <div className="flex justify-between items-center">
              <Button
                className="border-2 border-primary capitalize text-base border-2 border-solid border-primary hover:text-black px-7"
                type="button"
                sx={{ color: "white" }}
                autoFocus
                onClick={handleClose}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-primary capitalize text-base text-white  hover:text-black ml-5"
                autoFocus
                sx={{ color: "white" }}
              >
                {buttonActive ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserInfo;
