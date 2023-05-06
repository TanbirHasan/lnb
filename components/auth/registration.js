import React, { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLayout from "./layout";
import { regiSchema } from "./utils/helper";
import apiClient from "../../library/apis/api-client";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { UkCities } from "../../library/utils/UkCity";

const RES_URL = "register";

const Registration = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [checked, setChecked] = React.useState(false);

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

  //const [states, setState] = React.useState(cities);

  const [logoFile, setLogoFile] = useState("");
  const [selectedCountry, setSelectedCountry] = React.useState();
  const [selectedCnCode, setSelectedCode] = React.useState("");

  // console.log("All countries",countries)
  // console.log("Selected Coutry", selectedCountry);
  //console.log("Selected States", states);

  const logoUploadHandler = (event) => {
    setLogoFile(event.target.files[0]);
  };

  const handelUpload = async (token) => {
    if (!!logoFile) {
      const formData = new FormData();
      formData.append("file", logoFile);
      const config = {
        timeout: 10000,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-access-token": token,
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
    } else {
      console.log("No logo selected");
    }
  };

  useEffect(() => {
    setSelectedCode(selectedCountry?.isoCode);
  }, [selectedCountry]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    country: "",
    countryCode: "",
    city: "",
    zip: "",
    address: "",
    userName: "",
    companyWebsite: "",
    companyName: "",
    companyType: "",
    password: "",
  };

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(regiSchema),
  });

  const { isValid, dirtyFields, errors, isSubmitting } = formState;

  const disableHandler = () => {
    return !(
      dirtyFields.address &&
      dirtyFields.country &&
      dirtyFields.countryCode &&
      dirtyFields.email &&
      dirtyFields.firstname &&
      dirtyFields.lastname &&
      dirtyFields.city &&
      dirtyFields.phoneNumber &&
      dirtyFields.zip
    );
  };

  const onSubmit = async (values) => {
    const data = {
      username: values.userName,
      firstname: values.firstname,
      lastname: values.lastname,
      password: values.password,
      email: values.email,
      company_name: values.companyName,
      companyWebsite: values.companyWebsite,
      Address: values.address,
      city: values.city,
      post_code: values.zip,
      companyType: values.companyType,
      country: values.country,
      phoneNumber: values.phoneNumber,
      countryCode: values.countryCode,
      provinceOrState: values?.city, //Need Api modification to remove this.
    };

    if (checked) {
      try {
        const response = await apiClient.post(`/auth/register`, data);
        if (response.status === 200) {
          enqueueSnackbar(
            response.data.message,
            { variant: "success", autoHideDuration: 7000 },
            { autoHideDuration: 7000 }
          );
          await handelUpload(response?.data?.token).then(() => {
            router.push("/auth/login");
            reset();
          });
        }
      } catch (err) {
        enqueueSnackbar(err?.message || "Operation failed", {
          variant: "error",
        });
      }
    }
  };

  return (
    <AuthLayout>
      <form
        name="registrationForm"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col px-5 py-10 justify-center items-center"
      >
        <h3 className="headline4 text-[18px] lg:text-[24px] md:text-[24px] items-start my-7">
          Register in to Local New Business
        </h3>
        <div className="w-full md:w-4/6 lg:w-3/6">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                className="justify-between"
                textColor="inherit"
                TabIndicatorProps={{ style: { background: "#D16F32" } }}
              >
                <Tab
                  label="Step 1"
                  {...a11yProps(0)}
                  style={{ minWidth: "50%" }}
                />
                <Tab
                  label="Step 2"
                  {...a11yProps(1)}
                  style={{ minWidth: "50%" }}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <div className=" flex flex-col gap-4 items-center justify-between w-full mt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <Controller
                    name="firstname"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        type="text"
                        className="bg-white rounded"
                        autoFocus={true}
                        placeholder="First Name"
                        error={!!errors.firstname}
                        helperText={errors?.firstname?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="lastname"
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
                        label="Last Name"
                        type="text"
                        className="bg-white rounded"
                        autoFocus={true}
                        placeholder="Last Name"
                        error={!!errors.lastname}
                        helperText={errors?.lastname?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </div>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      className="bg-white rounded"
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
                {/* phone number */}
                <Controller
                  name="phoneNumber"
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
                      label="Phone Number"
                      type="number"
                      className="bg-white rounded"
                      autoFocus={true}
                      placeholder="Phone Number"
                      error={!!errors.phoneNumber}
                      helperText={errors?.phoneNumber?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                {/* Address */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                  {countries && (
                    <Controller
                      name="country"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Country"
                          select
                          fullWidth
                          className="bg-white rounded col-span-2"
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
                    name="countryCode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Country Code"
                        select
                        fullWidth
                        className="bg-white"
                        error={!!errors.countryCode}
                        helperText={errors?.countryCode?.message}
                      >
                        <MenuItem value={selectedCnCode}>
                          {selectedCnCode}
                        </MenuItem>
                      </TextField>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Autocomplete
                        options={cities}
                        className="col-span-2"
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

                  <Controller
                    name="zip"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Post Code"
                        type="text"
                        className="bg-white rounded col-span-1"
                        autoFocus={true}
                        placeholder="Post Code"
                        error={!!errors.zip}
                        helperText={errors?.zip?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </div>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      type="text"
                      className="bg-white rounded col-span-2"
                      autoFocus={true}
                      placeholder="Address"
                      error={!!errors.address}
                      helperText={errors?.address?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
                <button
                  type="button"
                  disabled={disableHandler()}
                  onClick={() => setValue(1)}
                  className={`${
                    disableHandler()
                      ? "bg-slate-300 text-black cursor-auto"
                      : "text-white hover:bg-primaryHover bg-primary cursor-pointer"
                  } cursor-pointer mt-5 capitalize p-4 rounded-md font-bold shadow-none hover:shadow-none w-full`}
                >
                  Next
                </button>

                <p className="mx-auto headline8 flex gap-2 items-center">
                  Already have an account?
                  <Link href="/auth/login">
                    <span className="formbottomlink">Sign in</span>
                  </Link>
                </p>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className=" flex flex-col gap-4 items-center justify-between w-full mt-5">
                <Controller
                  name="userName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      type="email"
                      className="bg-white rounded"
                      autoFocus={true}
                      placeholder="Username"
                      error={!!errors.userName}
                      helperText={errors?.userName?.message}
                      variant="outlined"
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
                      className="bg-white rounded"
                      autoFocus={true}
                      placeholder="Company Website"
                      error={!!errors.companyWebsite}
                      helperText={errors?.companyWebsite?.message}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="companyName"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) => {
                      if (value === "") {
                        return "Please provide company name";
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Company Name"
                      type="text"
                      className="bg-white rounded"
                      autoFocus={true}
                      placeholder="Company Name"
                      error={!!errors.companyName}
                      helperText={errors?.companyName?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                {/* company type */}

                <Controller
                  name="companyType"
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
                      label="Company Type"
                      type="text"
                      className="bg-white rounded"
                      autoFocus={true}
                      placeholder="Company Type"
                      error={!!errors.companyType}
                      helperText={errors?.companyType?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

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
                      label="Password"
                      placeholder="Password"
                      className="bg-white rounded"
                      autoFocus={true}
                      autoComplete="new-password"
                      type={showPassword ? "text" : "password"}
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
                              {!showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
           
                <Controller
                  name="logo"
                  control={control}
                 
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={"Company Logo"}
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
                <div className="flex justify-start w-full">
                {logoFile && (
                 <h3 className="text-[14px] text-slate-500">Selected Logo : {logoFile?.name}</h3>
                )}
                </div>

               
               
               
                <div className="form-control w-full mt-5 ">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <div style={{ display: "flex", alignItems: "start" }}>
                          <Checkbox
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                          />
                        </div>
                      }
                      label="By clicking Create account, I agree that I have read and
                accepted the Terms of Use and Privacy Policy."
                    />
                  </FormGroup>
                </div>

                <button
                  type="submit"
                  className={` ${
                    checked
                      ? "hover:bg-primaryHover bg-primary text-white cursor-pointer"
                      : "bg-slate-300 text-black cursor-auto"
                  }   cursor-pointer my-5 capitalize p-4 rounded-md font-bold shadow-none hover:shadow-none w-full `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <CircularProgress
                        size="22px"
                        sx={{ marginRight: "10px" }}
                      />
                      Create Account
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <p className="mx-auto headline8 flex gap-2 items-center">
                  Already have an account?
                  <Link href="/auth/login">
                    <span className="formbottomlink">Sign in</span>
                  </Link>
                </p>
              </div>
            </TabPanel>
          </Box>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Registration;
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
