import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, useForm } from "react-hook-form";
import { paginationRecoil } from "../../../../store/atoms/paginationRecoil";
// import { companyListRecoil } from '../../../../store/atoms/companyListRecoil';
import { paginationClient } from "../../../../library/utils/queryClient";
import { searchmodalschema } from "../../../auth/utils/helper";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRecoilState } from "recoil";
import { totalCompanyRecoil } from "../../../../store/atoms/totalCompanyRecoil";
import apiClient from "../../../../library/apis/api-client";
import LoadingButton from "@mui/lab/LoadingButton";
import { Close, KeyboardArrowRight } from "@mui/icons-material";
// import { DesktopDatePicker } from "@mui/lab";

const SearchModal = (props) => {
  const [paginationState, setPaginationState] =
    useRecoilState(paginationRecoil);

  const [message, setMessage] = useState(" ");
  const [company, setTotalCompany] = useRecoilState(totalCompanyRecoil);
  const [apiLoading, setApiLoading] = React.useState(false);

  const { open, setOpen, handleClose, handleOpen, rowBuilder } = props;
  const [sicCode, setSicCode] = useState();
  const [sicOption, setSicOption] = useState();

  const getSicData = async () => {
    try {
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/config/getSic_Codes`
      );
      if (res.status === 200) {
        //console.log(res?.data?.data[0]?.data);
        const Soptions = [];
        res?.data?.data[0]?.data.map((e) => {
          Soptions.push({ label: e?.Description, code: e?.["SIC Code"] });
        });
        setSicOption([...Soptions]);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getSicData().then((r) => r);
  }, []);

  const style = {
    position: "absolute",
    borderRadius: 2,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    bgcolor: "background.paper",

    boxShadow: 12,
    p: 4,
  };

  const { control, formState, handleSubmit, reset, setValue, getValues } =
    useForm({
      mode: "onSubmit",
      defaultValues: paginationState,
      resolver: yupResolver(searchmodalschema),
    });

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async (values) => {
    setApiLoading(true);
    try {
      const parsedValues = {
        ...values,
        // incorporated_from: String(values.incorporated_from.toISOString()).split(
        //   'T'
        // )[0],
        // incorporated_to: String(values.incorporated_to.toISOString()).split(
        //   'T'
        // )[0],
      };
      // setPaginationState((prev) => ({
      //   ...prev,
      //   ...parsedValues,
      // }));
      //reset(values);
      const response = await paginationClient({
        ...paginationState,
        ...parsedValues,
      });

      setPaginationState((prev) => ({
        ...prev,
        ...parsedValues,
        page: 1,
        total: response.noOfDocuments,
        noTotalPage: response.noOfPages,
      }));

      console.log("response->", response);
      if (response) {
        setTotalCompany(response);
        // rowBuilder(response);
      }
    } catch (error) {
      console.log(error);
    }
    // console.log("after reload",paginationState)
    setApiLoading(false);
    reset();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="mx-1"
    >
      <Box sx={style} className="w-full  lg:w-2/5 md:w-2/5 ">
        <div className="flex justify-between items-center mb-5">
          <div className="text-xl font-bold">Search</div>
          <IconButton aria-label="close" onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
        <form
          name="contactform"
          // noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-3 mb-3 items-center ">
            <label className="col-span-1">Incorporated From : </label>

            <div className="col-span-2">
              {/*<Controller*/}
              {/*  name="incorporatedDate"*/}
              {/*  control={control}*/}
              {/*  render={({ field: { onChange, value, onBlur } }) => (*/}
              {/*    <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
              {/*      <DesktopDatePicker*/}
              {/*        mask=""*/}
              {/*        // inputFormat="dd mm YYY"*/}
              {/*        value={!value ? new Date() : value}*/}
              {/*        onChange={onChange}*/}
              {/*        PopperProps={{*/}
              {/*          sx: {*/}
              {/*            "& .MuiCalendarPicker-root .MuiButtonBase-root.MuiPickersDay-root":*/}
              {/*              {*/}
              {/*                borderRadius: "8px",*/}
              {/*                "&.Mui-selected": {*/}
              {/*                  backgroundColor: "#c9eee7",*/}
              {/*                  color: "#323434",*/}
              {/*                },*/}
              {/*              },*/}
              {/*          },*/}
              {/*        }}*/}
              {/*        renderInput={(params) => (*/}
              {/*          <TextField*/}
              {/*            {...params}*/}
              {/*            onBlur={onBlur}*/}
              {/*            required*/}
              {/*            type="date"*/}
              {/*            className='w-full'*/}
              {/*            sx={{*/}
              {/*              svg: { color: "#69C77E" },*/}
              {/*            }}*/}
              {/*          />*/}
              {/*        )}*/}
              {/*      />*/}
              {/*    </LocalizationProvider>*/}
              {/*  )}*/}
              {/*/>*/}
              <Controller
                name="incorporated_from"
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="w-full border-none"
                      label=""
                      value={getValues("incorporated_from")}
                      onChange={(newValue) => {
                        if (newValue) {
                          const date = `${newValue["$y"]}-${
                            newValue["$M"] + 1
                          }-${newValue["$D"]}`;
                          console.log("new dat", date);
                          setValue("incorporated_from", date);
                        } else {
                          setValue("incorporated_from", newValue);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} error={false} />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 mb-5">
            <label className="col-span-1">Incorporated To : </label>

            <div className="col-span-2">
              <Controller
                name="incorporated_to"
                defaultValue={paginationState.incorporated_from}
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="w-full"
                      label=""
                      value={getValues("incorporated_to")}
                      onChange={(newValue) => {
                        if (newValue) {
                          const date = `${newValue["$y"]}-${
                            newValue["$M"] + 1
                          }-${newValue["$D"]}`;
                          console.log("new date", date);
                          setValue("incorporated_to", date);
                        } else {
                          setValue("incorporated_to", newValue);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} error={false} />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 mb-3 gap-0">
            <label className="col-span-1">Name : </label>
            <div className="col-span-2">
              <Controller
                name="company_name"
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      type="text"
                      className=" bg-white mt-2 border-none"
                      autoFocus={true}
                      placeholder="Name"
                      error={!!errors.company_name}
                      helpertext={errors?.compapostalname?.message}
                      variant="outlined"
                      fullWidth
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 mb-3 gap-0">
            <label className="col-span-1">City : </label>
            <div className="col-span-2">
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      type="text"
                      className=" bg-white mt-2 border-none"
                      autoFocus={true}
                      placeholder="City"
                      error={!!errors.city}
                      helpertext={errors?.city?.message}
                      variant="outlined"
                      fullWidth
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 mb-3 gap-0">
            <label className="col-span-1">SIC code : </label>
            <div className="col-span-2">
              <Autocomplete
                //disablePortal
                id="combo-box-demo"
                options={sicOption}
                onChange={(a, b) => setValue("sic_codes", b?.code)}
                getOptionLabel={({ label, code }) => {
                  return `${code} - ${label}`;
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <div className="text-left">
                      {option.code} - {option.label}
                    </div>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="rounded-lg bg-white text-center"
                    placeholder={"Select Sic"}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 mb-3 gap-0 items-center">
            <label className="col-span-1">Postal Code : </label>
            <div className="col-span-2">
              <Controller
                name="postal_code"
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      type="text"
                      className=" bg-white mt-2 border-none"
                      autoFocus={true}
                      placeholder="Postal Code. Eg: LE3"
                      error={!!errors.postal_code}
                      helpertext={errors?.postal_code?.message}
                      variant="outlined"
                      fullWidth
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center mt-5">
            <LoadingButton
              size="small"
              type="submit"
              endIcon={<KeyboardArrowRight />}
              loading={apiLoading}
              loadingPosition="end"
              variant="contained"
              sx={{ color: "#fff" }}
            >
              <span className="m-2 px-2  text-base capitalize">Search</span>
            </LoadingButton>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default SearchModal;
