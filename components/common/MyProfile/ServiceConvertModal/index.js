import { Dialog, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import apiClient from "../../../../library/apis/api-client";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { ConvertToContString } from "../../../../library/utils/contString";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import "react-multi-email/style.css";
import { ReactMultiEmail } from "react-multi-email";
import { useRecoilState } from "recoil";
import { companyListRecoilState } from "../../../../store/atoms/companyListRecoil";
import { useRouter } from "next/router";

export default function ServiceConvertModal({
  open,
  setOpen,
  convertData,
  packageName,
}) {
  const [companyData, setCompanyData] = React.useState(null);
  const [convertSuccess, setConvertSuccess] = React.useState(false);
  const [successResponse, setSuccessResponse] = React.useState();
  const [companyListData, setCompanyListData] = useState();
  const [apiLoading, setApiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [excludedCompanyNumberList, setExcludedCompanyNumberList] = useState(
    []
  );
  const [emails, setEmails] = useState();
  const [companyList, setcompanyList] = useRecoilState(companyListRecoilState);

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  React.useEffect(() => {
    if (convertData) {
      setCompanyListData(convertData?.row?.companyList);
    }
  }, [convertData,open]);

  React.useEffect(() => {
    getCompanyList().then((r) => r);
  }, [companyListData]);

  const getCompanyList = async () => {
    setLoading(true);
    if (!!companyListData) {
      const companyArray = {
        list: companyListData,
      };
      try {
        const res = await apiClient.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/list/getCompanyListFromList/?limit=5000`,
          companyArray
        );
        if (res.status === 200) {
          const dataRows = res?.data?.companyData.map((row) => ({
            id: row?._id,
            companyName:
              row?.company_name.charAt(0).toUpperCase() +
              row?.company_name.slice(1).toLowerCase(),
            companyNumber: row?.company_number,
            type: row?.company_type,
            city: row?.registered_office_address?.locality,
            postcode: row?.company_data?.registered_office_address?.postal_code,
            status: row?.company_status,
          }));

          setCompanyData(dataRows);
        } else {
          getCompanyList();
        }
      } catch (e) {
        console.log(e);
      }
    }
    setLoading(false);
  };
  const onDeleteHandeller = (companyId) => {
    if (companyListData.length > 1) {
      const newList = companyListData.filter((id) => id !== companyId);
      setExcludedCompanyNumberList([...excludedCompanyNumberList, companyId]);
      setCompanyListData(newList);
      setcompanyList(newList);
      enqueueSnackbar("Removed Successfully", { variant: "success" });
    } else {
      enqueueSnackbar("Must have at least one company", { variant: "error" });
    }
  };
  const handleClose = () => {
    setOpen(false);
    setConvertSuccess(false);

    setEmails([]);
  };

  const onConvertHandler = async () => {
    setApiLoading(true);
    if (packageName === "PRINT_AND_POST") {
      setcompanyList(companyListData);
      router.push("/stepperpages/companylistsender");
      setApiLoading(false);
    } else {
      if (!!convertData) {
        const data = {
          service_req_id: convertData?.row?.id,
          excludedCompanyNumberList: excludedCompanyNumberList,
          service_type: packageName,
          toEmailList: emails,
        };
        try {
          const res = await apiClient.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/history/convert-to-free-service-request`,
            data
          );
          if (res.status === 200) {
            enqueueSnackbar(res?.data?.message, { variant: "success" });
            setConvertSuccess(true);
            setSuccessResponse(res?.data?.requestData);
            setEmails([]);
            setApiLoading(false);
          }
        } catch (e) {
          enqueueSnackbar(e?.message, { variant: "error" });
          setApiLoading(false);
        }
      }
    }
  };

  return (
    <div className="w-[400px]">
      <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
        {!convertSuccess && (
          <div className="form-wrapper" style={{ position: "relative" }}>
            <IconButton
              className="close-button"
              onClick={handleClose}
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              <HighlightOffIcon />
            </IconButton>
            <div className="py-10">
              <div className=" p-5">
                {!companyData && loading && (
                  <Box className="flex justify-center my-5">
                    <CircularProgress />
                  </Box>
                )}
                {!!companyData && (
                  <div>
                    {packageName === "EMAIL_SERVICE" && (
                      <div>
                        <div className="mb-1">Email List</div>
                        <ReactMultiEmail
                          placeholder="Enter your Email Addresses"
                          emails={emails}
                          label="Emails"
                          onChange={(e) => {
                            setEmails(e);
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
                    )}

                    <div className="text-xl text-gray-500 mb-2">
                      Company List
                    </div>
                    <div className="h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
                      {companyData.map((company, index) => {
                        return (
                          <div
                            key={company?.id}
                            className="p-3 border-2 border-gray-300 rounded-md my-2 cursor-pointer flex items-center justify-between mr-1"
                          >
                            <div className="flex items-center gap-1">
                              <div>{index + 1}.</div>
                              <Tooltip title={company.companyName}>
                                <div className="font-medium">
                                  {ConvertToContString(company.companyName, 30)}
                                </div>
                              </Tooltip>
                              <Tooltip
                                title={
                                  company.status === "active"
                                    ? "Active"
                                    : "Disable"
                                }
                              >
                                <FiberManualRecordIcon
                                  className={`h-4 w-4 ${
                                    company.status === "active"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                />
                              </Tooltip>
                            </div>
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="error"
                              onClick={() => {
                                onDeleteHandeller(company.companyNumber);
                              }}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </div>
                        );
                      })}
                    </div>
                    <div className=" m-5 flex justify-end">
                      <button
                        type="button"
                        className="min-w-[100px] py-2 text-[16px] bg-[#D16F32] text-white cursor-pointer rounded-sm"
                        onClick={() => {
                          onConvertHandler().then((r) => r);
                        }}
                      >
                        {apiLoading ? (
                          <div className="flex items-center justify-center">
                            <CircularProgress
                              size="18px"
                              sx={{ marginRight: "10px", color: "black" }}
                            />
                            Convert
                          </div>
                        ) : (
                          "     Convert"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!!convertSuccess && (
          <div className="p-10 flex flex-col gap-5 justify-center items center">
            <div className="flex justify-center w-full mb-5">
              <img className='w-72' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7N13mBRV1sfxb0/OAck5DSAiBhRRDCQxYM5pMa3ZVXddxTWsOWd3TauIGRHMcc0oiJhABAOI5BwGGCZPd71/FPiyMMBM162+3dW/z/PUs0H7zOmeqbqnbwQRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGAkO0ExLMUoAPQbcO1A5ALFACFG/57KrAeKAXKN1yrgdnAL8AcoDbWiYtI4KUBnYDuQFegCe4zKQ8o3vDfHdzn01qgjP9/Ps0EfgXmAeFYJ54MVAAknh2BQcB+G/57NyDLY8xa3CLgJ+BL4BNgKrrpRKThUoDeuM+n/rjPpy5Ahse41cAs4GdgAvAx7rPK8RhXJO4VAWcCzwOLcf/oY3GtBl4DLgZa+/4uRSQRtQAuAMYBK4nd82kpMBr4M26vgkhgpAJDgGdxu8NidVNt7QrjVt7n4nbdiUjyygQOB14GarD/fKoG3gKOx3tvg4g1bYB7gGXYv6m2dq0DRgI9ffoMRCQ+lQCPAWuw/xza2rUSeBB3XpRIQuiI+0dbif0bqKFXBLfq7mv+4xCRONILtzeyFvvPnYZeNRty7uHD5yFiRBcS78aq73oX2MPwZyMidu0CvIFb7Nt+xkR71eHOFehu+LMRiVo6MILE+sa/vSuCW8w0Nfg5iUjs5QJ3kPhfTDa9anB7WTWHSawayP8vYQnitQp3sqCWmIoknsOB+dh/jvh1LQCOM/ZpiTRQAe5SPts3QKyuT4G2Rj45EfFbC+B97D83YnWNw92ISMR3u+HuamX7jz7W1wrgUAOfn4j4ZwCwCPvPi1hf84F9vH98Ils3HKjA/h+7rSuCO/aW7vWDFBGjQrhzkeqw/5ywddUCN+DuYihiTCbwIvb/wOPl+hzt2CUSLwqAD7H/XIiX6xUg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U2jy5voEMLMHsYgkihTgbUw9Rw44xgl9Wu2EPqly2HuYyefTC35+CCJ+Ssc9n9vIzXB220Lnnh7NTN5c84FGLugVkYAoAmZh6HkSOvdWh1OuMPl8mgp42xpVxLK2uGNXRm6K1JCxm6sSE7uDiUgi2xlYj4lnSkqKQyhk6vm0Cujk6zsXiZF9cPcIMFkde73O9vUdi0iiOBp3UqDtZ9LGK4yB81VE4sml2L+xNl6P+PxeRSSx3I3959LG6yqf36uIFaOwf3NNAjL9fqMiklBSgfex/3x6He1pIwGVBXyLvZtrKdDG93cpIomoCe4+AbaeT78Ahb6/SxGLOgErif3NVQ3sG4P3JyKJaw+ggtg/n9ZgYAt1kUSwL1BFbG+wc2PyzkQk0R1HbCcF1gGHxeSdicSJM4jdDXZXbN6SiATEDcTu+fSX2LwlkfhyD/7fXO+ikyJFpHFCuLvw+f18ejJWb0gk3qTgznr16+aaDhTE7N2ISJBk4a4a8uv59BmQEas3IxKP8nC3vDR9cy0F2sfwfYhI8LQE5mH++fQLUBzD9yEStzpgcLtg3G1+947pOxCRoNoVKMPc82kVUBLTdyAS5/bGbbi93lwR4OQY5y4iwXYk7ha9Xp9PNcDAGOcukhCOx/tNdk3MsxaRZHAB3r+cnBHrpEUSyd+I/gbTjFoR8dP9RP98us5CviIJ5wEaf3O9C6TZSFZEkkYKMJbGP59G2khWJBGlAC/T8Jvra9zVBCIifssCxtPw59M7QLqVTEUSVCrusb3b25LzHSDfUo4ikpyygXFsv/F/Cq31F4laf+BV/veAjlrgQ+AYi3mJiAwD3sOd3b/x+VQJvIlm+8eUzlAOtnTcTTnSgUW4p/uJiMSDTKA17iqmJbhfUkREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREQkzoRsJxBnQkCR7SQMKgPqYvwzC4GUGP/MxqgGKmwnIeKjHCDTdhLiq7VAxGuQZC0AUoFdgQOAvkDJhivfZlI+cIDpwDjgQdw/Gj8cBZwDDMB9+MS7cmAmMAX4FHgXWG01I5HGawrsv+Hq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Ys2aUhYvWkRtwA6iiWehUIjmLVrSslWwJy0HsgDYKC0tjY6dOgGdbKciIhKVoqJiioqKbachAaR+WRERkSSkAkBERCQJqQAQERFJQioAREREkpAKABERkSSkAkBERCQJqQAQERFJQioAREREkpAKABERkSSkAkBERCQJqQAQERFJQioAREREkpAKABERkSSkAkBERCQJqQAQERFJQioAREREkpAKABERkSSkAkBERCQJqQAQERFJQioAREREkpAKABERkSSkAkBERCQJqQAQERFJQioAREREkpAKABERkSSkAkBERCQJpdlOwC+RSIQp333Lj9N+YO3aNbbTSSrZWdl07daN/vsdQGZmpu10RBLW6tWr+PzTT1m8aCG1dbW200kaoVCI5s1bsNfe/enUubPtdHwTyALg5Zde5I6bb2De3Lm2U0lqBQWFXHTpZfzlssvJzMqynY5IwliyeDG33HAd48aMpq6uznY6Sa3fPv256bY76bNnX9upGBeoIYBwOMwlF5zLBWefocY/Dqxbt5bbb76RIw45kJUrV9hORyQhTPnuWwbt24+XXnhOjX8c+OrLiQw7cCDPjhppOxXjAlUA3HTdNbzw7NO205DNfPv1ZM445URqa9WFKbItC+bP56Rjj2L5sqW2U5FN1NbWcvklF/H+u+/YTsWowBQA03+cxiP/esB2GrIVkyZO4NmnnrSdhkhcu/aqv7NyxXLbaUg9IpEIl19yIRXl5bZTMSYwBcDDD95PJBKxnYZsw8MP3W87BZG4NX/ePN558w3bacg2LF2yhNdeGWs7DWMCUwB89N/3bacg2zFv7lxm/vqL7TRE4tJHH7yP4zi205Dt+PC/79lOwZhAFABlZetYvXqV7TSkAebNnWM7BZG4NG+O7o1EEKTfUyAKAHX9J45wWL8rkfro239iCFJ7E4gCoLCwiPz8AttpSAO0a9/edgoicaltu3a2U5AGaBugZ1ggCgCAQQceaDsF2Y6WrVrRc6dettMQiUtDhh5sOwVpgEFDhtpOwZjAFADnXnCx7RRkO8698GJCoZDtNETiUueuXRk4WF9k4llRUTHHnnCi7TSMCUwB0G+f/pzyp9NtpyFbsVOvnTlPRZrINt12973k5eXbTkO24ra776WoqNh2GsYEpgAAuOfBf3PQIcNspyGb6VrSjRfGvkZWdrbtVETiWrfuPXhm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'/>
            </div>
            <div className="text-3xl font-bold text-center mb-5 text-green-500">
              Conversion Completed !!
            </div>
            {successResponse && (
              <a
                href={successResponse?.excelLink}
                download
                onClick={() => {
                  handleClose();
                }}
                className="flex justify-center w-full"
              >
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10">
                  Download
                </button>
              </a>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
