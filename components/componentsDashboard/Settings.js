import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { CircularProgress, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { getPrice, getRetriveKeys } from "./SettingsApiCall";
import UpdateKeyDialog from "./UpdateKeyDialoge";

const Settings = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState("");
  const [prices, setPrices] = useState({});
  const [title, setTitle] = useState("load");
  const [type, setType] = useState("");
  const [keys, setKeys] = useState({});
  const [activekey, setActiveKey] = useState(false);
  const [activeprice, setActivePrice] = useState(false);
  const [apiLoadingKey, setApiLoadingKey] = React.useState(false);
  const [apiLoadingPrice, setApiLoadingPrice] = React.useState(false);

  const gettingprice = async () => {
    setApiLoadingPrice(true);
    try {
      const allprice = await getPrice();
      setPrices(allprice?.data?.prices);
      setActivePrice(false);
      setOpen(false);
      setApiLoadingPrice(false);
    } catch (e) {
      setApiLoadingPrice(false);
      console.log(e);
    }
  };

  const retriveKeys = async () => {
    setApiLoadingKey(true);
    try {
      const allKeys = await getRetriveKeys();
      setKeys(allKeys?.data.StripeKeys);
      setActiveKey(false);
      setOpen(false);
      setApiLoadingKey(false);
    } catch (e) {
      setApiLoadingKey(false);
      console.log(e);
    }
  };

  useEffect(() => {
    retriveKeys();
  }, [activekey]);

  useEffect(() => {
    gettingprice();
  }, [activeprice]);

  const handleClickOpen = (datatype, data) => {
    setType(datatype);
    setData(data);
    setOpen(true);
    if (datatype === "DOWNLOAD_SERVICE") {
      setTitle("Download Service Price");
    } else if (datatype === "EMAIL_SERVICE") {
      setTitle("Email Service Price");
    } else if (datatype === "MAIL_PRINT_SERVICE") {
      setTitle("Print Service Price");
    } else if (datatype === "PK") {
      setTitle("Stripe Public Key");
    } else {
      setTitle("Stripe Secret Key");
    }
  };

  return (
    <Dashboard>
      <div className="xl:max-w-[1400px] pt-10 bg-slate-100 h-auto lg:h-screen xl:h-screen pb-5">
        <h2 className="text-2xl font-semibold pb-5 ml-2 my-2">Settings</h2>
        <div className="bg-white p-4 m-1">
          <h2 className="text-xl font-semibold">Stripe Credentials</h2>
        </div>
        <div className="grid grid-cols-1 gap-2 m-1 my-4">
          <div className="bg-white px-5 py-2 rounded-md border-2 border-teal-500">
            <div className="flex justify-between items-start gap-5">
              <div className="font-semibold text-[18px] text-gray-600 mb-5">
                Stripe Public key
              </div>
              {apiLoadingKey && title === "Stripe Public Key" || apiLoadingKey && title === "load"? (
                <CircularProgress size="22px" sx={{ marginRight: "10px" }} />
              ) : (
                <IconButton
                  aria-label="fingerprint"
                  className="bg-teal-100 h-8 w-8"
                  onClick={() => handleClickOpen("PK", keys?.stripe_pk)}
                >
                  <CreateOutlinedIcon className="h-5 w-5" />
                </IconButton>
              )}
            </div>
            <div className="text-base font-medium text-gray-500 overflow-hidden">
              {keys?.stripe_pk}
            </div>
          </div>
          <div className="bg-white px-5 py-2 rounded-md border-2 border-teal-500">
            <div className="flex justify-between items-start gap-5">
              <div className="font-semibold text-[18px] text-gray-600 mb-5">
                Stripe Secret Key
              </div>
              {apiLoadingKey && title === "Stripe Secret Key" || apiLoadingKey && title === "load"? (
                <CircularProgress size="22px" sx={{ marginRight: "10px" }} />
              ) : (
                <IconButton
                  aria-label="fingerprint"
                  className="bg-teal-100 h-8 w-8"
                  onClick={() => handleClickOpen("SK", keys?.stripe_sk)}
                >
                  <CreateOutlinedIcon className="h-5 w-5" />
                </IconButton>
              )}
            </div>
            <div className="text-base font-medium text-gray-500  overflow-hidden">
              {keys?.stripe_sk}
            </div>
          </div>
        </div>
        {/* price setup */}
        <div className="bg-white p-4 mt-10 mx-1">
          <h2 className="text-xl font-semibold">Price Setup</h2>
        </div>
        <div className="m-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-between items-center my-5">
          <div className="p-5 bg-white rounded-md">
            <div className="flex justify-between items-start gap-5">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-lg bg-teal-100">
                  <FileDownloadOutlinedIcon />
                </div>
                <div className="font-semibold text-xl text-gray-600">
                  Download
                </div>
              </div>
              <IconButton
                aria-label="fingerprint"
                color="success"
                className="h-7 w-7"
                onClick={() =>
                  handleClickOpen("DOWNLOAD_SERVICE", prices?.DOWNLOAD_SERVICE)
                }
              >
                <CreateOutlinedIcon className="h-5 w-5" />
              </IconButton>
            </div>

            <div className="mt-4 text-5xl to-gray-800 font-semibold">
              {prices?.DOWNLOAD_SERVICE} £
            </div>
          </div>
          <div className="p-5 bg-white rounded-md">
            <div className="flex justify-between items-start gap-5">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-lg bg-rose-300">
                  <AlternateEmailOutlinedIcon />
                </div>
                <div className="font-semibold text-xl text-gray-600">Email</div>
              </div>
              <IconButton
                aria-label="fingerprint"
                color="success"
                className="h-7 w-7"
                onClick={() =>
                  handleClickOpen("EMAIL_SERVICE", prices?.EMAIL_SERVICE)
                }
              >
                <CreateOutlinedIcon className="h-5 w-5" />
              </IconButton>
            </div>

            <div className="mt-4 text-5xl to-gray-800 font-semibold">
              {prices?.EMAIL_SERVICE} £
            </div>
          </div>
          <div className="p-5 bg-white rounded-md">
            <div className="flex justify-between items-start gap-5">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-lg bg-blue-200">
                  <LocalPrintshopOutlinedIcon />
                </div>
                <div className="font-semibold text-xl text-gray-600">
                  Print & Post
                </div>
              </div>
              {apiLoadingPrice ? (
                <CircularProgress size="22px" sx={{ marginRight: "10px" }} />
              ) : (
                <IconButton
                  aria-label="fingerprint"
                  color="success"
                  className="h-7 w-7"
                  onClick={() =>
                    handleClickOpen(
                      "MAIL_PRINT_SERVICE",
                      prices?.MAIL_PRINT_SERVICE
                    )
                  }
                >
                  <CreateOutlinedIcon className="h-5 w-5" />
                </IconButton>
              )}
            </div>
            <div className="mt-4 text-5xl to-gray-800 font-semibold">
              {prices?.MAIL_PRINT_SERVICE} £
            </div>
          </div>
        </div>
      </div>
      <UpdateKeyDialog
        open={open}
        setOpen={setOpen}
        handleClickOpen={handleClickOpen}
        stripedata={data}
        setData={setData}
        type={type}
        setActiveKey={setActiveKey}
        setActivePrice={setActivePrice}
      
        title={title}
      />
    </Dashboard>
  );
};

export default Settings;
