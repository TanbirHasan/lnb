import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/style.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { emailListRecoil } from "../../../store/atoms/emailListRecoil";
import { freeServiceRequestClient } from "../../../library/utils/queryClient";
import { companyListRecoilState } from "../../../store/atoms/companyListRecoil";
import { useRouter } from "next/router";
import { serviceResquestResponseRecoilState } from "../../../store/atoms/serviceRequestResponseRecoil";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useSnackbar } from "notistack";

const Emailsender = () => {
  const fixedOptions = [];
  const [emails, setEmailRecoilState] = useRecoilState(emailListRecoil);
  // const [email, setEmail] = React.useState([]);
  // const [emails, setEmails] = React.useState([]);
  const [emailBody, setEmailBody] = React.useState([]);
  const companyList = useRecoilValue(companyListRecoilState);
  const [serviceRequestResponse, setServiceRequestResponse] = useRecoilState(
    serviceResquestResponseRecoilState
  );
  const [value, setValue] = useState("download");
  const route = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {}, [emails]);

  const handleEmailInput = async (e) => {
    e.preventDefault();
    if (companyList.length < 1) {
      enqueueSnackbar("Please enter receiver's email address", {
        variant: "error",
      });
      return;
    }
    try {
      const payload = {
        companyNumberList: companyList,
        toEmailList: emails,
        service_type: "EMAIL_SERVICE",
      };
      setLoading(true);
      const response = await freeServiceRequestClient(payload);
      setLoading(false);

      if (response.status === 200) {
        setServiceRequestResponse(response);
        route.push("/stepperpages/paymentcomplete");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      // throw new Error(error);
    }
  };

  const handleDownloadInput = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        companyNumberList: companyList,
        toEmailList: emails,
        service_type: "DOWNLOAD_SERVICE",
      };
      setLoading(true);
      const response = await freeServiceRequestClient(payload);
      setLoading(false);
      if (response.status === 200) {
        setServiceRequestResponse(response);
        route.push("/stepperpages/paymentcomplete");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      // throw new Error(error);
    }
  };

  return (
    <section className="text-gray-600 body-font my-2">
      <div className="container shadow-lg rounded-lg mx-auto  lg:px-8 py-12 md:px-4 sm:px-2">
        {isLoading && (
          <>
            <LinearProgress />
            <h2 className="Tagline lg:text-[40px] md:text-[30px] sm:text-[20px] my-[30px]">
              We are preparing the excel sheet for you...
            </h2>
            <p className="headline6 pb-[60px] text-[12px] lg:text-[18px] md:text-[18px] text-[color:var(--Black-three)]">
              Download link will be available shortly....
            </p>
          </>
        )}

        {!isLoading && (
          <>
            <div className="w-full lg:px-8 md:px-5 px-5  ">
              <h1 className="title-font font-medium text-3xl text-gray-900">
                Would you like download the excel or send it to a set of email
                addresses ?
              </h1>
              <p className="leading-relaxed mt-4">
                If you choose email, the excel sheet, containing all the company
                data will be sent to the email addresses that you will provide
                us.
              </p>
              <div className="ml-5 mt-3">
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    value={value}
                    onChange={(e) => {
                      e.preventDefault();
                      setValue(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="email"
                      control={<Radio />}
                      label="I would like to send the excel sheet to some email addresses"
                    />
                    <FormControlLabel
                      value="download"
                      control={<Radio />}
                      label="I just want to download the excel link"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            {value === "email" && (
              <form>
                <div className="lg:py-24 lg:px-32 md: sm:w-full p-2 relative">
                  <div className="px-2 lg:px-10 py-10 shadow-lg">
                    <div className="flex flex-col gap-7">
                      <div>
                        <div className="mb-1">Email List</div>
                        <ReactMultiEmail
                          placeholder="Enter your Email Addresses"
                          emails={emails}
                          label="Emails"
                          onChange={(e) => {
                            setEmailRecoilState(e);
                          }}
                          getLabel={(email, index, removeEmail) => {
                            return (
                              <div data-tag key={index}>
                                {email}
                                <span
                                  data-tag-handle
                                  onClick={() => removeEmail(index)}
                                >
                                  ×
                                </span>
                              </div>
                            );
                          }}
                        />
                      </div>
                      {/* <TextField fullWidth multiline rows={7} label="Email body" id="fullWidth" onChange={(e) => {
                      setEmailBody(e.target.value)
                    }} /> */}
                    </div>
                  </div>
                  <div className="absolute right-0 top-[130%] lg:top-[115%]">
                    {/* <button
                      className="rounded px-3 py-2 border-2 border-[#D16F32] text-[#D16F32] cursor-pointer mt-5"
                      onClick={() => ondatasubmit('')}
                    >
                      Cancel
                    </button> */}
                    <button
                      className="headline6 bg-[color:var(--form-button-color)] text-white cursor-pointer my-3 border-none py-2 px-5 rounded-lg"
                      onClick={handleEmailInput}
                      disabled={!emails.length > 0 && !emailBody.length > 0}
                    >
                      Continue To Next Step
                    </button>
                  </div>
                </div>
              </form>
            )}
            {value === "download" && (
              <div className="flex justify-end mt-10">
                <button
                  className="headline6 bg-[color:var(--form-button-color)] text-white cursor-pointer my-3 border-none py-2 px-5 rounded-lg"
                  onClick={handleDownloadInput}
                  // disabled={!emails.length > 0 && !emailBody.length > 0}
                >
                  Continue To Next Step
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Emailsender;
