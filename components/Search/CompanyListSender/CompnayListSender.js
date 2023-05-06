import { Autocomplete, TextareaAutosize, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailEditor from "react-email-editor";
import UpdateUserInfo from "./UpdateUserInfo";
import EditIcon from "@mui/icons-material/Edit";

import {
  fileUploadClient,
  serviceRequestClient,
  userInfoClient,
} from "../../../library/utils/queryClient";
import { formStateRecoil } from "../../../store/atoms/formStateRecoil";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { senderDataRecoil } from "../../../store/atoms/senderDataRecoil";
import apiClient from "../../../library/apis/api-client";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import CharCount from "../../common/CharCount";
import PdfUpload from "./PdfUpload/PdfUpload";
import { companyListRecoilState } from "../../../store/atoms/companyListRecoil";
import { serviceResquestResponseRecoilState } from "../../../store/atoms/serviceRequestResponseRecoil";
import { useSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import { printAndPostSchema } from "../../auth/utils/helper";
import ErrorMessageModal from "./ErrorMessageModal";

const CompnayListSender = (data) => {
  const route = useRouter();
  const emailEditorRef = useRef(null);
  const [emailBody, setEmailBody] = useState();

  const [userProfile, setUserProfile] = useState(data.props);
  const [senderData, setSenderdata] = useRecoilState(senderDataRecoil);
  const [active, setActive] = useState(false);
  const [newSenderData, setNewSenderData] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [errorOpen,setErrorOpen] = useState(false)
  const [open, setOpen] = useState(false);
  const [selectedletter, setSelectedLetter] = useState(null);
  const [errorMessage,setErrorMessage] = useState()



  const companyList = useRecoilValue(companyListRecoilState);
  const { enqueueSnackbar } = useSnackbar();

  const [serviceRequestData, setServiceRequestData] = useRecoilState(
    serviceResquestResponseRecoilState
  );


  

  const [companyName, setCompanyName] = useState();
  const [companyOption, setCompanyOptions] = useState();

  const [companyData, setCompanyData] = useState([]);

  const senderInfo = useRecoilValue(senderDataRecoil);

  const [buttonActive, setButtonActive] = useState(false);

  const placeholderImage =
    "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

  const onImageError = (e) => {
    e.target.src = placeholderImage;
  };

  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    if (newValue === 1 || newValue === 2) {
      setSelectedLetter(null);
      setTemplateString((prev) => ({
        ...prev,
        letterKey: null,
      }));
    } else {
      setTemplateString((prev) => ({
        ...prev,
        emailTemplate: "",
      }));
    }
    setTabValue(newValue);
  };

  useEffect(() => {
   
      setSelectedLetter(null);
      setTemplateString((prev) => ({
        ...prev,
        letterKey: null,
      }));
    
  }, []);

  const getCompanyList = async () => {
    try {
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sendersData/getSendersData`
      );
      if (res.status === 200) {
        setCompanyData(res?.data);
        const Soptions = [];
        Soptions.push({ company: userProfile.company_name });
        res?.data.map((e) => {
          Soptions.push({ label: e?.companyName, company: e?.["companyName"] });
        });

        setCompanyOptions([...Soptions]);
      }
    } catch (e) {
      console.log(e);
    }
    setNewSenderData(false);
  };

  useEffect(() => {
    getCompanyList().then((r) => r);
  }, [newSenderData]);

  // email editor start

  const onLoad = () => {
    emailEditorRef?.current?.editor?.loadBlank({
      backgroundColor: "#fff",
      contentWidth: "850px",
      //works fine in letter but in the responsiveness letter breaks
      //contentWidth: "850px"
    });
  };
  const onReady = () => {};
  // email editor end

  // Checking if existing data contain a logo url, if not adding a logo Url

  const getcheckLogoUrl = () => {
    const userInfo = {
      firstName: userProfile?.firstname,
      lastName: userProfile?.lastname,
      companyName: userProfile?.company_name,
      email: userProfile?.email,
      postcode: userProfile?.post_code,
      phone: userProfile?.phoneNumber,
      website: userProfile?.companyWebsite,
      city: userProfile?.city,
      address: userProfile?.Address,
      country: userProfile?.country,
      countryCode: userProfile?.countryCode,
      logoUrl: userProfile?.logoUrl,
    };
    if (Object.keys(senderInfo).length === 0) {
      if ("logoUrl" in userProfile) {
        setSenderdata(userInfo);
      } else {
        userInfo.logoUrl = "No Url";
        setSenderdata(userInfo);
      }
    }
  };

  // const ondatasubmit = (data) => {
  //   if (templateString.letterKey == null) {
  //     route.push("/stepperpages/previewtemplate");
  //   }
  // };

  const [clientId, setClientId] = useState(null);
  const [emailState, setEmailState] = useState({
    subject: "",
    body: "",
  });

  useEffect(() => {
    if (
      templateString.step_three !== "" &&
      templateString.emailSubject != "" &&
      templateString.emailTemplate === "basic"
    ) {
      setEmailState({
        subject: templateString?.emailSubject,
        body: templateString?.step_three,
      });
    } else {
      setEmailState({
        subject: templateString?.emailSubject,
        body: "",
      });
    }

    reset(emailState);
  }, [templateString]);

  React.useEffect(() => {
    reset(emailState);
  }, [emailState]);

  const [templateString, setTemplateString] = useRecoilState(formStateRecoil);
  const {
    control,
    formState,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: emailState,
    resolver: yupResolver(printAndPostSchema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    //console.log("Errors here",errors)
    if (errors.subject) {
      window.scrollTo({
        top: 100,
        behavior: "smooth",
      });
    }
  }, [errors]);

  const [image, setImage] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
    }
  };

  useEffect(() => {
    const fetchClient = async () => {
      const client = await userInfoClient();
      setClientId(client.data._id);
    };
    try {
      fetchClient();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleTemplateText = (data) => {
    setApiLoading(true);
    if (tabValue === 2) {
      emailEditorRef.current.editor.exportHtml((bodyData) => {
        const { design, html } = bodyData;
        setEmailBody(html);
        setTemplateString((prev) => ({
          ...prev,
          step_three: bodyData.html,
          emailSubject: data.subject,
          emailTemplate: "unlayer",
        }));
      });
      setTimeout(() => {
        setApiLoading(false);
      }, [2000]);
      route.push("/stepperpages/previewtemplate");
    } else if (tabValue === 0) {
      if (templateString.letterKey != null) {
        if (Object.keys(senderInfo).length === 0) {
          const userInfo = {
            firstName: userProfile?.firstname,
            lastName: userProfile?.lastname,
            companyName: userProfile?.company_name,
            email: userProfile?.email,
            postcode: userProfile?.post_code,
            phone: userProfile?.phoneNumber,
            website: userProfile?.companyWebsite,
            city: userProfile?.city,
            address: userProfile?.Address,
            country: userProfile?.country,
            countryCode: userProfile?.countryCode,
            logoUrl: userProfile?.logoUrl,
          };
          setSenderdata(userInfo);
          handleLetterReq(userInfo);
        } else {
          handleLetterReq(senderInfo);
        }
      } else {
        setTimeout(() => {
          setApiLoading(false);
        }, [2000]);
      //   enqueueSnackbar("Please Select a Letter", { variant: "error",
      //  anchorOrigin : {
      //   vertical : 'center',
      //   horizontal : 'bottom'
      //  }
      // });
      handleOpen("Please Select a Letter")
      }
    } else {
      setTemplateString((prev) => ({
        ...prev,
        step_three: data.body,
        emailSubject: data.subject,
        emailTemplate: "basic",
      }));
      setTimeout(() => {
        setApiLoading(false);
      }, [2000]);
      route.push("/stepperpages/previewtemplate");
    }
    if (!active || active) {
      getcheckLogoUrl();
    }
  };

  const handleLetterReq = async (data) => {
    setTemplateString((prev) => ({
      ...prev,
      step_three: "",
      emailSubject: "",
      emailTemplate: "",
    }));
    const emailBody = null;
    const emailSubject = null;

    //console.log("data from letter",data)

    const response = await serviceRequestClient({
      companyNumberList: companyList,
      emailBody: emailBody,
      //To send hole page as html
      // emailBody: emailBodyHtml || emailBody,
      emailSubject: emailSubject,
      letterKey: templateString.letterKey,
      service_type: "MAIL_PRINT_SERVICE",
      sendersData: data,
    });
    if (response.status === 200) {
      setServiceRequestData(response);
      
      route.push("/stepperpages/step4");
    }
  };

  useEffect(() => {
    if (image && clientId) {
      try {
        const body = new FormData();
        body.append("file", image);
        fileUploadClient(clientId, body);
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      return;
    }
  }, [clientId, image]);

  //console.log(errors);
  const handleOpen = (message) => {
    setErrorMessage(message)
    setErrorOpen(true);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSetCompany = (a, b) => {
    // console.log('We are getting into the handelsetCompany',b)
    //setCompanyName(b?.company)

    if (b) {
      if (b?.company === userProfile?.company_name) {
        setSenderdata({});
        setButtonActive(false);
      } else {
        let selectedCompany = companyData.filter(
          (company) => company.companyName === b?.company
        );

        setSenderdata(selectedCompany[0]);
        setButtonActive(true);
      }
    } else if (b === null) {
      let selectedCompany = companyData.filter(
        (company) => company.companyName === company
      );

      setSenderdata(selectedCompany[0] || {});
      setButtonActive(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleTemplateText)}
        noValidate
        autoComplete="off"
      >
        <div className="shadow-lg px-2 lg:px-6 py-4 rounded bg-transparent relative">
          <div className="border-white shadow-lg m-[2px] p-6">
            <h3 className="taglineRes font-bold mb-5 text-[#797979]">
              Details Section
            </h3>

            <div className="items-center justify-center">
              <div className="col-span-1">
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Subject"
                      type="text"
                      className="bg-white"
                      autoFocus={true}
                      placeholder="Subject"
                      helperText={errors?.subject?.message}
                      variant="outlined"
                      error={!!errors?.subject}
                      required
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Box sx={{ width: "100%" }} className="my-5 px-1">
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab
                        label="Upload/Templates"
                        className="capitalize"
                        {...a11yProps(0)}
                      />
                      <Tab
                        label="Basic"
                        className="capitalize"
                        {...a11yProps(1)}
                      />
                      <Tab
                        label="Advance"
                        className="capitalize"
                        {...a11yProps(2)}
                      />
                    </Tabs>
                  </Box>

                  <TabPanel value={tabValue} index={0}>
                    <div>
                      <PdfUpload
                        selectedletter={selectedletter}
                        setSelectedLetter={setSelectedLetter}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <Controller
                      name="body"
                      control={control}
                      render={({ field }) => (
                        <TextareaAutosize
                          {...field}
                          type="text"
                          minRows={14}
                          className="bg-white rounded w-full border-2 mt-2 py-2 px-2"
                          placeholder="Start writing here..."
                          variant="outlined"
                          label="Body"
                          autoFocus={true}
                          helperText={errors?.name?.message}
                          error={!!errors?.name}
                          required
                          fullWidth
                        />
                      )}
                    />
                    <CharCount total={1000} current={watch("body").length} />
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    <EmailEditor
                      ref={emailEditorRef}
                      onLoad={onLoad}
                      onReady={onReady}
                      tools={{
                        image: {
                          enabled: false,
                        },
                        button: {
                          enabled: false,
                        },
                        menu: {
                          enabled: false,
                        },
                        text: {
                          properties: {
                            textAlign: {
                              value: "left",
                            },
                          },
                        },
                      }}
                    />
                  </TabPanel>
                </Box>
              </div>
            </div>
          </div>

          <div className="w-full border shadow-lg p-3 rounded mt-5">
            <div className="w-full flex justify-between px-5 flex-col md:flex-row lg:flex-row xl:flex-row">
              <h3 className="taglineRes font-bold mb-5 text-[#797979]">
                Sender Information
              </h3>
              <div className="CompanyName flex items-center">
                <Autocomplete
                  className=""
                  disablePortal
                  id="combo-box-demo"
                  options={companyOption}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  sx={{ width: 320 }}
                  onChange={(a, b) => {
                    handleSetCompany(a, b);
                    setCompanyName(b?.company);
                  }}
                  getOptionLabel={({ company }) => {
                    return `${company}`;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="rounded-lg bg-white"
                      placeholder="Search Sender"
                    />
                  )}
                />
                {/* <button
                  onClick={handleSetCompany}
                  type="button"
                  className="bg-primary py-2 text-white w-[100px] rounded mx-2"
                >
                  Save
                </button> */}

                {Object.keys(senderInfo)?.length !== 0 && buttonActive ? (
                  <span
                    className="mx-2 text-[#23A3FF] cursor-pointer"
                    onClick={() => handleClickOpen()}
                  >
                    <EditIcon className="text-[#23A3FF]" />
                    Edit
                  </span>
                ) : (
                  <span
                    className="mx-2 text-[#23A3FF] cursor-pointer"
                    onClick={() => handleClickOpen()}
                  >
                    <EditIcon className="text-[#23A3FF]" />
                    Add
                  </span>
                )}
              </div>
            </div>
            <div className="m-[2px] mt-4 sm:px-8 px-5 sm:py-5 py-3 sm:flex sm:flex-row text-center items-start">
              <div>
                <div>
                  {Object.keys(senderInfo)?.length !== 0 ? (
                    <img
                      src={`https://lnb-data.s3.eu-west-2.amazonaws.com/logos/${senderInfo?.logoUrl}`}
                      width={160}
                      height={170}
                      onError={onImageError}
                      alt="company logo"
                      className="object-contain"
                    />
                  ) : (
                    <img
                      src={`https://lnb-data.s3.eu-west-2.amazonaws.com/logos/${userProfile?.logoUrl}`}
                      width={150}
                      height={170}
                      onError={onImageError}
                      alt="company logo"
                      className="object-contain"
                    />
                  )}
                </div>
                {/* <div className="my-5">
              <label
                className="text-white hover:bg-primaryHover bg-primary cursor-pointer capitalize px-2 py-2 rounded font-semibold shadow-none hover:shadow-none text-sm"
                for="avatar"
              >
                Upload Logo
              </label>
              <input
                className="hidden"
                type="file"
                id="avatar"
                name="file"
                accept="image/png, image/jpeg"
                onChange={uploadToClient}
              />
            </div> */}
              </div>

              <div className="mx-5">
                <h3 className="font-bold text-[15px] lg:text-[20px] md:text-[18px] sm:text-[18px] text-left">
                  {Object.keys(senderInfo)?.length !== 0
                    ? senderInfo.companyName
                    : userProfile?.company_name}
                </h3>

                <div className="flex mt-2">
                  <div>
                    <LocalPhoneOutlinedIcon fontSize="small" />
                  </div>
                  <div className="pl-8">
                    {Object.keys(senderInfo)?.length !== 0
                      ? senderInfo.phone
                      : userProfile?.phoneNumber}
                  </div>
                </div>

                <div className="flex mt-2">
                  <div>
                    <EmailOutlinedIcon fontSize="small" />
                  </div>
                  <div className="pl-8">
                    {Object.keys(senderInfo)?.length !== 0
                      ? senderInfo.email
                      : userProfile?.email}
                  </div>
                </div>

                <div className="flex mt-2">
                  <div>
                    {senderInfo?.website !== "" &&
                    Object.keys(senderInfo)?.length !== 0 ? (
                      <>
                        <LanguageOutlinedIcon fontSize="small" />
                      </>
                    ) : (
                      <span></span>
                    )}
                  </div>
                  <div>
                    {userProfile?.companyWebsite !== "" &&
                    Object.keys(senderInfo)?.length === 0 ? (
                      <LanguageOutlinedIcon fontSize="small" />
                    ) : (
                      <>
                        <span></span>
                      </>
                    )}
                  </div>
                  <div className="pl-8 text-[#23A3FF] underline">
                    {Object.keys(senderInfo)?.length !== 0
                      ? senderInfo.website
                      : userProfile?.companyWebsite}
                  </div>
                </div>

                <div className="flex mt-2">
                  <div>
                    <LocationOnOutlinedIcon fontSize="small" />
                  </div>
                  <div className="pl-8 text-left">
                    {Object.keys(senderInfo).length !== 0
                      ? senderInfo?.address +
                        ",  " +
                        senderInfo?.postcode +
                        ",  " +
                        senderInfo?.city +
                        ",  " +
                        senderInfo?.country
                      : userProfile?.Address +
                        ",  " +
                        userProfile?.post_code +
                        ",  " +
                        userProfile?.city +
                        ",  " +
                        userProfile?.country}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="m-5">
            <div className="absolute right-0 top-[100%]">
              <button
                type="submit"
                value="Send"
                className="headline6 bg-[color:var(--form-button-color)] text-white cursor-pointer my-5 border-none py-2 px-5 rounded-lg"
              >
                <span className="mr-2">Continue To Next Step</span>
                {apiLoading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline mr-3 w-4 h-4 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      <UpdateUserInfo
        open={open}
        companyName={companyName}
        buttonActive={buttonActive}
        setOpen={setOpen}
        userProfile={userProfile}
        setActive={setActive}
        setNewSenderData={setNewSenderData}
        companyData={companyData}
        companyOption={companyOption}
      />

      <ErrorMessageModal open={errorOpen} setOpen={setErrorOpen} errorMessage={errorMessage}/>
    </>
  );
};

export default CompnayListSender;

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
        <Box sx={{ p: 3 }} className="py-2 px-0">
          <Typography>{children}</Typography>
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
