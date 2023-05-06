import Image from "next/image";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useRecoilState, useResetRecoilState} from "recoil";
import apiClient from "../../../library/apis/api-client";
import {apiClientRecoil} from "../../../store/atoms/apiClientRecoil";
import {paginationRecoil} from "../../../store/atoms/paginationRecoil";
import {totalCompanyRecoil} from "../../../store/atoms/totalCompanyRecoil";
import CircularProgress from "@mui/material/CircularProgress";
import {useSnackbar} from "notistack";
import {Autocomplete, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import { CompanySearchLoaderRecoil } from "../../../store/atoms/CompanySearchLoaderRecoil";

const COMPANY_SEARCH = "company/companySearch";

const Banner = ({ inputdata}) => {
  const router = useRouter();
  const [company, setTotalCompany] = useRecoilState(totalCompanyRecoil);
  const [paginationState, setPaginationState] =
    useRecoilState(paginationRecoil);
  const [apiClientState, setApiClientState] = useRecoilState(apiClientRecoil);
  const resetPaginationRecoil = useResetRecoilState(paginationRecoil);
  const resetApiClientRecoil = useResetRecoilState(apiClientRecoil);
  const [sicCode, setSicCode] = useState();
  const [sicOption, setSicOption] = useState();
  const { enqueueSnackbar } = useSnackbar([]);
  const [companySearchLoader, setCompanySearchLoader] = useRecoilState(CompanySearchLoaderRecoil)

  const defaultValues = {
    postcode: "",
    sic: "",
  };
  const token = Cookies.get("token");

  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm(defaultValues);

  const onSubmit = async (data, value) => {
    setCompanySearchLoader(true)
    try {
      if (!token) {
        router.push("/auth/login");
        return;
      }
      resetPaginationRecoil();
      resetApiClientRecoil();

      const response = await apiClient.get(`/${COMPANY_SEARCH}`, {
        params: {
          postal_code: data.postcode.toUpperCase(),
          sic_codes: sicCode,
          limit: "100",
        },
      });

      if (response.status === 200) {
        setPaginationState((prev) => ({
          ...prev,
          postal_code: data.postcode.toUpperCase(),
          sic_codes: sicCode,
          limit: 100,
          total: response.data.noOfDocuments,
          noTotalPage: response.data.noOfPages,
        }));

        setApiClientState((prev) => ({
          ...prev,
          data: response.data,
          previousRoute: "/",
        }));
        //  localStorage.setItem("totaldata", JSON.stringify(response.data));
        localStorage.setItem("inputdata", JSON.stringify(data));

        //this data is accesssed in companyLIst component
        setTotalCompany(response.data);

        if (value === "noroute") {
          router.push();
        } else {
          router.push("/stepperpages/step1");
        }
      } else {
        enqueueSnackbar("We couldn't find amy information for your search", {
          variant: "error",
        });
      }
    } catch (err) {
      if (err.response) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      } else {
        // enqueueSnackbar("Could not fetch data", { variant: "error" });
        // console.log("error", err)
      }
    }
    setCompanySearchLoader(false)
    reset();
  };

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

  return (
    <div className="banner px-10 py-10 lg:px-20 lg:py-20 md:py-20 sm:px-10 h-auto">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="headline2 headline2Res  text-white mb-10 xl:w-[890px] lg:w-[890px]  mx-auto">
            We help you connect with new local businesses before the
            competition.
          </h2>
          <p className="headline5 headline5Res text-white lg:w-[712px] md:w-[650px] mx-auto sm:w-[396px] ">
            We help you reach their inboxes, so you can make connections that
            turn into sales. We also offer templates that help you stand out
            from the crowd.
          </p>
        </div>
        <div className="flex flex-col items-start w-3/4 md:w-auto md:items-center pb-5  px-[0px]  text-white  md:flex-row lg:flex-row md:justify-around lg:w-[712px] md:w-[650px]  mx-auto">
          <div className="featureclass mb-2">
            <Image src="/assets/Tick.png" width="15" height="15" alt="" />
            <span className="headline7 ml-4 ">Real-Time Data</span>
          </div>
           <div className="featureclass mb-2">
            <Image src="/assets/Tick.png" width="15" height="15" alt="" />
            <span className="headline7 ml-4">Unlimited Access</span>
          </div>
          <div className="featureclass">
            <Image src="/assets/Tick.png" width="15" height="15" alt="" />
            <span className="headline7 ml-4">Targeted Outreach</span>
          </div>
        </div>
        <div>
          <form
            // onSubmit={handleSubmit(onSubmit)}
            className="form my-20 flex justify-evenly lg:flex-row md:flex-row text-center sm:flex flex-col"
          >
            <div className="form-control w-full max-w-xs">
              <label className="headline6 bannerlebleclass">
                Search By Postcode
              </label>
              <input
                type="text"
                placeholder="Postcode"
                className="bannerinputclass"
                {...register("postcode", {
                  // required: {
                  //   value: true,
                  //   message: "Postcode is required",
                  // },
                  // pattern: {
                  //   // value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  //   message: "Provide a valid Postcode", // JS only: <p>error message</p> TS only support string
                  // },
                })}
              />
              <label className="label">
                {errors.postcode?.type === "required" && (
                  <span className="label-text-alt text-white">
                    {" "}
                    {errors?.postcode?.message}
                  </span>
                )}
                {errors.postcode?.type === "pattern" && (
                  <span className="label-text-alt text-white">
                    {" "}
                    {errors?.postcode?.message}
                  </span>
                )}
              </label>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="headline6 bannerlebleclass">
                Search by SIC Code
              </label>
              <div className="mt-5">
                <Autocomplete
                  //disablePortal
                  id="combo-box-demo"
                  options={sicOption}
                  onChange={(a, b) => setSicCode(b?.code)}
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
                      placeholder={"COMPANY TYPE"}
                      sx={{textAlign:"left"}}
                      inputProps={{
                        ...params.inputProps,
                        style: { textAlign: 'center' },
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="headline6 text-white text-[14px] lg:text-[16px] md:text-[16px] sm:text-[16px]">
                Click Here to Search Data
              </label>
              <button
                onClick={handleSubmit(onSubmit)}
                className="bannersubmitbutton"
                type="submit"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <CircularProgress
                      size="22px"
                      sx={{ marginRight: "10px" }}
                    />
                    Search
                  </div>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Banner;
