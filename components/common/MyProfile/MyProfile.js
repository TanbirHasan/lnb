import PersonIcon from "@mui/icons-material/Person";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { Backdrop, Box, Chip, IconButton, Tab, Tabs } from "@mui/material";
import Image from "next/future/image";
import PropTypes from "prop-types";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import apiClient from "../../../library/apis/api-client";
import EditProfileModal from "./editProfileModal";
import moment from "moment/moment";
import LnbDataGrid from "./DataGridLnb";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SubdirectoryArrowRightSharpIcon from "@mui/icons-material/SubdirectoryArrowRightSharp";
import Tooltip from "@mui/material/Tooltip";
import StripeCheckout from "react-stripe-checkout";
import NoLogo from "../../../public/assets/notification.png";
import LetterModal from "./LetterModal";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PaymentNavigationConfirmationModal from "./PaymentNavigationConfirmation";
import { serviceResquestResponseRecoilState } from "../../../store/atoms/serviceRequestResponseRecoil";
import { useRecoilState } from "recoil";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChangePasswordModal from "./changePasswordModal";
import { useRouter } from "next/router";
import { senderDataRecoil } from "../../../store/atoms/senderDataRecoil";
import CompanyDetailsModal from "./CompanyDetailsModal";
import TemplateUploader from "../TemplateUploader";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  AddCircleOutline,
  DocumentScannerOutlined,
  Download,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import ViewTemplateModal from "../ViewTemplate";
import EditLabelDataModal from "./EditLabelDataModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ServiceConvertModal from "./ServiceConvertModal";

// data for opening converting modal for each service
const options = [
  { label: "Convert to Print and Post", value: "print" },
  { label: "Convert to Email", value: "email" },
  { label: "Convert to Download", value: "download" },
];

const MyProfile = () => {
  const [value, setValue] = useState(0);
  const [showChild, setShowChild] = useState(false);
  const [userData, setData] = useState();
  const [open, setOpen] = React.useState(false);

  const [viewTemplateModalOpen, setViewTemplateModalOpen] =
    React.useState(false);
  const [letterPdfUrl, setLetterPdfUrl] = React.useState(null);

  const router = useRouter();

  const [printAndPost, setPrintAndPost] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [pageDetails, setPageDetails] = useState(0);
  const [pageSizeDetails, setPageSizeDetails] = useState(10);

  const [companyId, setCompanyId] = useState();

  const [companyModal, setCompanyModal] = useState(false);

  const [paginationData, setPaginationData] = useState();
  const [paginationDataDetails, setPaginationDataDetails] = useState();
  const [paginationDataDetailsPayment, setPaginationDataDetailsPayment] =
    useState();

  const [serviceData, setServiceData] = useState();
  const [templateList, setTemplateList] = useState();
  const [detailsData, setDetailsData] = useState();
  const [detailsDownloadEmailData, setDetailsDownloadEmailData] = useState();

  const [checkoutId, setCheckoutId] = useState(null);
  const [companyList, setCompanyList] = useState();
  const [apiLoading, setApiLoading] = useState(false);

  const [senderData, setSenderData] = useRecoilState(senderDataRecoil);

  const [openChangePass, setOpenChangePass] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [stripeToken, setStripeToken] = useState(null);
  // states for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [letterId, setLetterId] = useState(false);
  const [paymentNavModalOpen, setPaymentNavModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [responseData, setResponseData] = useState({});
  const [serviceRequest, setServiceRequest] = useRecoilState(
    serviceResquestResponseRecoilState
  );
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const [lableDialogOpen, setLableDialogOpen] = useState(false);

  const [labelValue, setLabelValue] = useState();

  const [openServiceConvert, setOpenServiceConvert] = useState(false);
  const [convertData, setServiceConvertData] = useState();

  const [packageNameConvert, setPackageNameConvert] = useState("");

  // opning second modal for getting all the company list and convert them to respected service
  const handleModalConvert = (serviceName, params) => {
    if(serviceName === 'print'){
      setPackageNameConvert('PRINT_AND_POST')
    }
    else if(serviceName === "email"){
      setPackageNameConvert("EMAIL_SERVICE")
    }
    else{
      setPackageNameConvert('DOWNLOAD_SERVICE')
    }

    setServiceConvertData(params);
    setOpenServiceConvert(true);
  };

  const { enqueueSnackbar } = useSnackbar();
  const checkOutRef = useRef(null);
  const onToken = (token) => {
    setStripeToken(token);
  };

  const openDrop = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    localStorage.removeItem("senderDataRecoil");
    setSenderData({});
  }, []);

  const handleNavigate = (params) => {
    setCompanyId(params?.value);
    setCompanyModal(true);
  };
  const onViewTemplate = (letterPdfUrl) => {
    if (letterPdfUrl) {
      setViewTemplateModalOpen(!viewTemplateModalOpen);
      setLetterPdfUrl(letterPdfUrl);
    }
  };

  const onTemplateDelete = async (letterKey, letterId) => {
    if (!!letterKey && letterId) {
      try {
        const res = await apiClient.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/delete-letter`,
          { key: letterKey, letterId: letterId }
        );
        if (res.status === 200) {
          enqueueSnackbar(res?.data?.message, { variant: "success" });
          getTemplateList().then((r) => r);
        }
      } catch (e) {
        enqueueSnackbar(e?.message, { variant: "error" });
      }
    } else {
      console.log("Invalid Template");
    }
  };

  const handleLabelData = (value) => {
    setLabelValue(value);
    setLableDialogOpen(true);
  };

  const columns = [
    {
      field: "companyName",
      headerName: "Company name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "companyNumber",
      headerName: "Company Number",
      flex: 1,
      minWidth: 130,
    },
    { field: "type", headerName: "Type", flex: 1, minWidth: 100 },
    {
      field: "creationDate",
      headerName: "Creation Date",
      type: "date",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "postcode",
      headerName: "Post Code",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "sicCode",
      headerName: "Sic Code",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "status",
      flex: 1,
      minWidth: 100,
      headerName: "Status",
      renderCell: (params) => {
        return (
          <div className="flex items-center border-2 border-solid px-2 py-1 rounded-2xl">
            <FiberManualRecordIcon
              className={`${
                params?.value === "active" || params?.value === "SENT"
                  ? "text-green-600 "
                  : "text-gray-600"
              } h-4 w-4`}
            />
            <span className="ml-1">{params?.value}</span>
          </div>
        );
      },
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <IconButton aria-label="delete" size="small">
            <RemoveRedEyeOutlinedIcon
              onClick={() => handleNavigate(params)}
              fontSize="inherit"
              className="text-[#3294D1]"
            />
          </IconButton>
        );
      },
    },
  ];
  const columnsForPrintPost = [
    {
      field: "companyName",
      headerName: "Company name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "companyNumber",
      headerName: "Company Number",
      flex: 1,
      minWidth: 130,
    },
    { field: "type", headerName: "Type", flex: 1, minWidth: 100 },
    {
      field: "creationDate",
      headerName: "Creation Date",
      type: "date",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "postcode",
      headerName: "Post Code",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "sicCode",
      headerName: "Sic Code",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "status",
      flex: 1,
      minWidth: 100,
      headerName: "Status",
      renderCell: (params) => {
        return (
          <div className="flex items-center border-2 border-solid px-2 py-1 rounded-2xl">
            <FiberManualRecordIcon
              className={`${
                params?.value === "SENT" ? "text-green-600 " : "text-gray-600"
              } h-4 w-4`}
            />
            <span className="ml-1">{params?.value}</span>
          </div>
        );
      },
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      minWidth: 90,
      renderCell: (params) => {
        return (
          <IconButton aria-label="letter" size="small">
            <RemoveRedEyeOutlinedIcon
              onClick={() => handleNavigate(params)}
              fontSize="inherit"
              className="text-[#3294D1]"
            />
          </IconButton>
        );
      },
    },
    {
      field: "letter",
      headerName: "Letter",
      flex: 1,
      minWidth: 90,
      renderCell: (params) => {
        return (
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => {
              setModalOpen(true);
              setLetterId(params?.value);
            }}
          >
            <MarkEmailUnreadOutlinedIcon
              fontSize="inherit"
              className="text-[#3294D1]"
            />
          </IconButton>
        );
      },
    },
  ];
  const columnsForTempleteList = [
    {
      field: "title",
      headerName: "Template Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "lastUsed",
      headerName: "Last Used",
      flex: 1,
      minWidth: 130,
    },
    { field: "createdAt", headerName: "Creation Date", flex: 1, minWidth: 100 },

    {
      field: "view",
      headerName: "View",
      width: 90,
      renderCell: (params) => {
        return (
          <IconButton aria-label="letter" size="small">
            <DocumentScannerOutlined
              onClick={() => onViewTemplate(params?.row?.letterKey)}
              fontSize="inherit"
              className="text-[#3294D1]"
            />
          </IconButton>
        );
      },
    },
    {
      field: "download",
      headerName: "Download",
      width: 90,
      renderCell: (params) => {
        return (
          <a
            download
            href={`https://lnb-data.s3.eu-west-2.amazonaws.com/pdf/${params.row.letterKey}`}
          >
            <IconButton aria-label="delete" size="small">
              <Download fontSize="inherit" className="text-[#3294D1]" />
            </IconButton>
          </a>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 90,
      renderCell: (params) => {
        return (
          <IconButton aria-label="letter" size="small">
            <DeleteIcon
              onClick={() =>
                onTemplateDelete(params?.row?.letterKey, params?.row?.id)
              }
              fontSize="inherit"
              className="text-red-600"
            />
          </IconButton>
        );
      },
    },
  ];
  const paymentColumns = [
    {
      field: "label",
      headerName: "Label",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        return (
          <Chip
            deleteIcon={
              <IconButton aria-label="delete" size="small">
                {params.value === "Add" ? (
                  <AddCircleOutline fontSize="small" className="text-black" />
                ) : (
                  <EditIcon fontSize="small" className="text-black" />
                )}
              </IconButton>
            }
            label={params.value}
            variant="outlined"
            size="medium"
            color="warning"
            onDelete={() => handleLabelData(params)}
            className="MuiChip-clickable text-black"
          />
        );
      },
    },
    {
      field: "companyTotal",
      headerName: "Number of Company",
      flex: 1,
      minWidth: 150,
    },

    { field: "date", headerName: "Date", flex: 1, minWidth: 150 },
    { field: "time", headerName: "Time", type: "date", flex: 1, minWidth: 130 },
    {
      field: "receiveCurrency",
      headerName: "Receive currency",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "sentCurrency",
      headerName: "Sent currency",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "paymentStatus",
      flex: 1,
      minWidth: 130,
      headerName: "Payment status",
      renderCell: (params) => {
        return (
          <div className="flex items-center border-2 border-solid px-2 py-1 rounded-2xl">
            <FiberManualRecordIcon
              className={`${
                params?.value === "PAID" ? "text-green-600 " : "text-red-500"
              } h-4 w-4`}
            />
            <span className="ml-1">{params?.value}</span>
          </div>
        );
      },
    },
    {
      field: "details",
      headerName: "Details",
      width: 100,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params.row.paymentStatus === "PAID") {
                if (params.row.packageName === "Print and Post") {
                  setIsDetails(true);
                  setCheckoutId(params.row.id);
                } else {
                  setIsDetails(true);
                  setCompanyList(params.row.companyList);
                }
              } else {
                setPaymentNavModalOpen(true);
                const row = params.row;
                const requestData = responseData.filter(
                  (data) => data._id === row?.id
                );

                setServiceRequest({
                  success: true,
                  status: 200,
                  serviceType: requestData[0]?.package_name,
                  requestData: requestData[0],
                });

                // checkOutRef.current.click()
              }
            }}
          >
            <Tooltip
              placement="right"
              title={
                params?.row?.paymentStatus === "UNPAID" ? "Pay Now" : "Details"
              }
            >
              <IconButton aria-label="delete" size="small">
                {params?.row?.paymentStatus === "UNPAID" && (
                  <SubdirectoryArrowRightSharpIcon
                    fontSize="inherit"
                    className="text-[#3294D1]"
                  />
                )}
                {params?.row?.paymentStatus !== "UNPAID" && (
                  <RemoveRedEyeOutlinedIcon
                    fontSize="inherit"
                    className="text-[#3294D1]"
                  />
                )}
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.value}
            <ThreeDotMenu
              handleSelect={(selectedValue) =>
                handleModalConvert(selectedValue, params)
              }
              value={params.row.packageName}
            />
          </div>
        );
      },
    },
  ];
  const paymentColumnsDownloadEmail = [
    {
      field: "label",
      headerName: "Label",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        return (
          <Chip
            deleteIcon={
              <IconButton aria-label="delete" size="small">
                {params.value === "Add" ? (
                  <AddCircleOutline fontSize="small" className="text-black" />
                ) : (
                  <EditIcon fontSize="small" className="text-black" />
                )}
              </IconButton>
            }
            label={params.value}
            variant="outlined"
            size="medium"
            color="warning"
            onDelete={() => handleLabelData(params)}
            className="MuiChip-clickable text-black"
          />
        );
      },
    },
    {
      field: "companyTotal",
      headerName: "Number of Company",
      flex: 1,
      minWidth: 150,
    },
    { field: "date", headerName: "Date", flex: 1, minWidth: 150 },
    { field: "time", headerName: "Time", type: "date", flex: 1, minWidth: 130 },
    // {
    //   field: "receiveCurrency",
    //   headerName: "Receive currency",
    //   flex: 1,
    //   minWidth: 130,
    // },
    // {
    //   field: "sentCurrency",
    //   headerName: "Sent currency",
    //   flex: 1,
    //   minWidth: 130,
    // },
    {
      field: "paymentStatus",
      flex: 1,
      minWidth: 130,
      headerName: "Payment status",
      renderCell: (params) => {
        return (
          <div className="flex items-center border-2 border-solid px-2 py-1 rounded-2xl">
            <FiberManualRecordIcon
              className={`${
                params?.value === "PAID" ? "text-green-600 " : "text-red-500"
              } h-4 w-4`}
            />
            <span className="ml-1">
              {params?.value === "PAID" ? "Free" : "Free"}
            </span>
          </div>
        );
      },
    },
    {
      field: "details",
      headerName: "Details",
      width: 100,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params.row.paymentStatus === "PAID") {
                if (params.row.packageName === "Print and Post") {
                  setIsDetails(true);
                  setCheckoutId(params.row.id);
                } else {
                  setIsDetails(true);
                  setCompanyList(params.row.companyList);
                }
              } else {
                setPaymentNavModalOpen(true);
                const row = params.row;
                const requestData = responseData.filter(
                  (data) => data._id === row?.id
                );

                setServiceRequest({
                  success: true,
                  status: 200,
                  serviceType: requestData[0]?.package_name,
                  requestData: requestData[0],
                });
                // checkOutRef.current.click()
              }
            }}
          >
            <Tooltip
              placement="right"
              title={
                params?.row?.paymentStatus === "UNPAID" ? "Pay Now" : "Details"
              }
            >
              <IconButton aria-label="delete" size="small">
                {params?.row?.paymentStatus === "UNPAID" && (
                  <SubdirectoryArrowRightSharpIcon
                    fontSize="inherit"
                    className="text-[#3294D1]"
                  />
                )}
                {params?.row?.paymentStatus !== "UNPAID" && (
                  <RemoveRedEyeOutlinedIcon
                    fontSize="inherit"
                    className="text-[#3294D1]"
                  />
                )}
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "download",
      headerName: "Download",
      width: 100,
      renderCell: (params) => {
        return (
          <a href={params.value} download>
            <IconButton aria-label="delete" size="small">
              {params?.row?.paymentStatus !== "UNPAID" && (
                <FileDownloadIcon
                  fontSize="inherit"
                  className="text-[#3294D1]"
                />
              )}
            </IconButton>
          </a>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.value}
            <ThreeDotMenu
              handleSelect={(selectedValue) =>
                handleModalConvert(selectedValue, params)
              }
              value={params.row.packageName}
            />
          </div>
        );
      },
    },
  ];
  const paymentHistoryColumns = [
    {
      field: "packageName",
      headerName: "Package Name",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "companyTotal",
      headerName: "Number of Company",
      flex: 1,
      minWidth: 130,
    },
    { field: "date", headerName: "Date", flex: 1, minWidth: 130 },
    { field: "time", headerName: "Time", type: "date", flex: 1, minWidth: 130 },
    {
      field: "receiveCurrency",
      headerName: "Receive currency",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "sentCurrency",
      headerName: "Sent currency",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "paymentStatus",
      flex: 1,
      minWidth: 130,
      headerName: "Payment status",
      renderCell: (params) => {
        return (
          <div className="flex items-center border-2 border-solid px-2 py-1 rounded-2xl">
            <FiberManualRecordIcon
              className={`${
                params?.value === "PAID" ? "text-green-600 " : "text-red-500"
              } h-4 w-4`}
            />
            {params?.row.packageName === "Download" ||
            params?.row.packageName === "Email" ? (
              <span className="ml-1">Free</span>
            ) : (
              <span className="ml-1">{params?.value}</span>
            )}
          </div>
        );
      },
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params.row.paymentStatus === "PAID") {
                if (params.row.packageName === "Print and Post") {
                  setIsDetails(true);
                  setPrintAndPost(true);
                  setCheckoutId(params.row.id);
                } else {
                  setIsDetails(true);
                  setPrintAndPost(false);
                  setCompanyList(params.row.companyList);
                }
              } else {
                setPaymentNavModalOpen(true);
                const row = params.row;
                const requestData = responseData.filter(
                  (data) => data._id === row?.id
                );

                setServiceRequest({
                  success: true,
                  status: 200,
                  serviceType: requestData[0]?.package_name,
                  requestData: requestData[0],
                });
                // checkOutRef.current.click()
              }
            }}
          >
            <Tooltip
              placement="right"
              title={
                params?.row?.paymentStatus === "UNPAID" ? "Pay Now" : "Details"
              }
            >
              <IconButton aria-label="delete" size="small">
                {params?.row?.paymentStatus === "UNPAID" && (
                  <SubdirectoryArrowRightSharpIcon
                    fontSize="inherit"
                    className="text-[#3294D1]"
                  />
                )}
                {params?.row?.paymentStatus !== "UNPAID" && (
                  <RemoveRedEyeOutlinedIcon
                    fontSize="inherit"
                    className="text-[#3294D1]"
                  />
                )}
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  /// Print and post detais history
  const getHistoryDetailsByToken = async (checkoutId) => {
    if (!!checkoutId) {
      try {
        setApiLoading(true);
        const res = await apiClient.get(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/history/HistoryDetailbyToken/?page=${
            pageDetails + 1
          }&limit=${pageSizeDetails}&request_id=${checkoutId}`
        );
        if (res.status === 200) {
          const dataRows = res?.data?.historyDetail.map((row) => ({
            id: row?.company_data?._id,
            companyName: row?.company_data?.company_name,
            companyNumber: row?.company_data?.company_number,
            type: row?.company_data?.company_type,
            creationDate: moment(row?.company_data?.date_of_creation).format(
              "D MMM YYYY"
            ),
            city: row?.company_data?.registered_office_address?.locality,
            postcode: row?.company_data?.registered_office_address?.postal_code,
            sicCode: [row?.company_data?.sic_codes],
            status: row?.req_status,
            details: row?.company_data?.company_number,
            letter: row?.letter_id,
          }));
          const paginationData = {
            totalRowCount: res?.data?.noOfDocuments,
            limit: pageSizeDetails,
            page: pageDetails,
          };

          setDetailsData(dataRows);
          setPaginationDataDetailsPayment(paginationData);
          setApiLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  useEffect(() => {
    if (!!isDetails) {
      getHistoryDetailsByToken(checkoutId).then((r) => r);
    }
  }, [pageSizeDetails, isDetails, pageDetails, checkoutId]);

  /// This one to get all company list for download and email

  const getDownloadEmailHistoryDetails = async (companyList) => {
    if (!!companyList) {
      const companyArray = {
        list: companyList,
      };
      try {
        setApiLoading(true);
        const res = await apiClient.post(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/company/list/getCompanyListFromList/?page=${
            pageDetails + 1
          }&limit=${pageSizeDetails}`,
          companyArray
        );
        if (res.status === 200) {
          const dataRows = res?.data?.companyData.map((row) => ({
            id: row?._id,
            companyName: row?.company_name,
            companyNumber: row?.company_number,
            type: row?.company_type,
            creationDate: moment(row?.date_of_creation).format("D MMM YYYY"),
            city: row?.registered_office_address?.locality,
            postcode: row?.company_data?.registered_office_address?.postal_code,
            sicCode: [row?.sic_codes],
            status: row?.company_status,
            details: row?.company_number,
          }));
          const paginationData = {
            totalRowCount: res?.data?.noOfDocuments,
            limit: pageSizeDetails,
            page: pageDetails,
          };
          setDetailsDownloadEmailData(dataRows);
          setPaginationDataDetails(paginationData);
          setApiLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (!!isDetails) {
      getDownloadEmailHistoryDetails(companyList).then((r) => r);
    }
  }, [companyList, isDetails, pageSizeDetails, pageDetails]);

  const getProfileData = async () => {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/self/profile`
    );
    if (res.status === 200) {
      setData(res?.data?.data);
    }
  };

  useEffect(() => {
    getProfileData().then((r) => {});
  }, []);

  // this api is for getting layer one tabs data

  const getTemplateList = async () => {
    try {
      const response = await apiClient.get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/users/fetch/letter-list?limit=${pageSize}&page=${page + 1}`
      );
      if (response.status === 200) {
        const serviceRows = response?.data?.letterData.map((row) => ({
          id: row?._id,
          title: row?.letter_title,
          lastUsed: row?.last_used,
          createdAt: moment(row?.createdAt).format("D MMM YYYY"),
          letterKey: row?.letter_key,
        }));
        const paginationData = {
          totalRowCount: response?.data?.noOfDocuments,
          limit: pageSize,
          page: page,
        };

        setTemplateList(serviceRows);
        setPaginationData(paginationData);
        setApiLoading(false);
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
      }
    }
  };
  const getServicePaymentHistory = async (serviceName) => {
    const url =
      !!serviceName === true
        ? `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/history/paymentHistorybyToken/?page=${
            page + 1
          }&limit=${pageSize}&package_name=${serviceName}`
        : `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/history/paymentHistorybyToken/?page=${page + 1}&limit=${pageSize}`;

    try {
      const response = await apiClient.get(url);
      if (response.status === 200) {
        setResponseData(response?.data?.paymentHistory);
        const serviceRows = response?.data?.paymentHistory.map((row) => ({
          id: row?._id,
          companyList: row?.companyList,
          packageName:
            row?.package_name === "MAIL_PRINT_SERVICE"
              ? "Print and Post"
              : row?.package_name === "EMAIL_SERVICE"
              ? "Email"
              : "Download",
          companyTotal: row?.companyList.length,
          time: moment(row?.createdAt).format("HH:mm"),
          date: moment(row?.createdAt).format("D MMM YYYY"),
          sentCurrency: "GBP",
          receiveCurrency: "GBP",
          paymentStatus: row?.payment_status,
          details: row?._id,
          download: row?.excelLink || "",
          label: row?.label || "Add",
        }));
        const paginationData = {
          totalRowCount: response?.data?.noOfDocuments,
          limit: pageSize,
          page: page,
        };

        setServiceData(serviceRows);
        setPaginationData(paginationData);
        setApiLoading(false);
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
      }
    }
  };

  useEffect(() => {
    if (value === 1) {
      getServicePaymentHistory().then((r) => r);
    }
    if (value === 2) {
      getServicePaymentHistory("MAIL_PRINT_SERVICE").then((r) => r);
    }
    if (value === 3) {
      getServicePaymentHistory("DOWNLOAD_SERVICE").then((r) => r);
    }
    if (value === 4) {
      getServicePaymentHistory("EMAIL_SERVICE").then((r) => r);
    }
    if (value === 5) {
      getTemplateList().then((r) => r);
    }
    setShowChild(true);
  }, [page, value, pageSize, lableDialogOpen]);

  useEffect(() => {
    getTemplateList().then((r) => r);
  }, [templateModalOpen]);

  if (!showChild) {
    return null;
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPage(0);
    setDetailsData(null);
    setDetailsDownloadEmailData(null);
    setServiceData(null);
    setPaginationDataDetails(null);
    setPrintAndPost(null);
  };

  return (
    <>
      {!userData && (
        <Backdrop
          sx={{
            color: "#fff",
            background: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={!userData}
        >
          <CircularProgress sx={{ color: "#fd5c5c" }} />
        </Backdrop>
      )}
      {!!userData && (
        <section className="section-style max-w-7xl mx-auto">
          <div className="bg-[#3294D1] md:min-h-[285px] sm:min-h-[285px] min-h-[200px] sm:p-12 p-5 rounded-xl">
            <div className=" flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-white">
                  {" "}
                  <PersonIcon />
                </span>

                <h2 className="text-white sm:ml-4 ml-2 text-[16px] sm:text-[20px] lg:text-[20px] md:text-[20px] text-left mt-0 sm:mt-1 uppercase">
                  My Profile
                </h2>
              </div>
              <div>
                <Button
                  id="basic-button"
                  sx={{ color: "white" }}
                  aria-controls={openDrop ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDrop ? "true" : undefined}
                  onClick={handleClick}
                  startIcon={<SettingsOutlinedIcon />}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Settings
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openDrop}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setOpen(true);
                      setAnchorEl(null);
                    }}
                  >
                    Edit Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setOpenChangePass(true);
                      setAnchorEl(null);
                    }}
                  >
                    Change Password
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>

          <div className="flex bg-white rounded-xl mt-[-90px] mx-5 sm:mx-12 pb-8  shadow-xl">
            {!!userData?.logoUrl && (
              <Image
                loader={() =>
                  // `${process.env.NEXT_PUBLIC_BASE_URL_FE}/logos/${userData?.logoUrl}`
                  `https://lnb-data.s3.eu-west-2.amazonaws.com/logos/${userData?.logoUrl}`
                }
                src={
                  // `${process.env.NEXT_PUBLIC_BASE_URL_FE}/logos/${userData?.logoUrl}`
                  `https://lnb-data.s3.eu-west-2.amazonaws.com/logos/${userData?.logoUrl}`
                }
                width={500}
                height={500}
                alt="logo text"
                className="mt-[-30px] md:mx-6 mx-3  border rounded-full bg-white md:w-[176px] md:h-[176px] w-[120px] h-[120px] object-contain"
              />
            )}
            {!userData?.logoUrl && (
              <Image
                src={NoLogo}
                width={500}
                height={500}
                alt="logo text"
                className="mt-[-30px] md:mx-6 mx-3  border rounded-full bg-white md:w-[176px] md:h-[176px] w-[120px] h-[120px] object-contain"
              />
            )}

            <div className="flex flex-col justify-center items-start">
              <h1 className="headline1 uppercase font-bold lg:text-[26px] md:text-[26px] sm:text-[20px] text-sm my-2">
                {`${userData?.firstname || ""} ${userData?.lastname || ""}`}
              </h1>
              <h4 className="text-[12px] md:text-sm font-medium">Director</h4>
            </div>
          </div>
        </section>
      )}

      <div className="section-style max-w-7xl mx-auto">
        <Box sx={{ width: "100%" }}>
          {!isDetails && (
            <Box
              sx={{
                height: "55px",
                background: "#FFFFF",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                borderRadius: "10px",
                padding: "7px 0px",
              }}
            >
              {userData?.isVerified === true && (
                <Tabs
                  TabIndicatorProps={{
                    style: { background: "#D16F32" },
                  }}
                  value={value}
                  variant="scrollable"
                  onChange={handleChange}
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  aria-label="scrollable auto tabs example"
                >
                  <Tab
                    style={{
                      textTransform: "none",
                      color: value === 0 ? "#D16F32" : "#909090",
                      fontSize: 17,
                      fontWeight: value === 0 ? "bold" : "",
                    }}
                    label="Basic"
                    {...a11yProps(0)}
                  />

                  <Tab
                    style={{
                      textTransform: "none",
                      color: value === 1 ? "#D16F32" : "#909090",
                      fontSize: 17,
                      fontWeight: value === 1 ? "bold" : "",
                    }}
                    label="Payment"
                    {...a11yProps(1)}
                  />
                  <Tab
                    style={{
                      textTransform: "none",
                      color: value === 2 ? "#D16F32" : "#909090",
                      fontSize: 17,
                      fontWeight: value === 2 ? "bold" : "",
                    }}
                    label="Print and post"
                    {...a11yProps(1)}
                  />
                  <Tab
                    style={{
                      textTransform: "none",
                      color: value === 3 ? "#D16F32" : "#909090",
                      fontSize: 17,
                      fontWeight: value === 3 ? "bold" : "",
                    }}
                    label="Download"
                    {...a11yProps(1)}
                  />
                  <Tab
                    style={{
                      textTransform: "none",
                      color: value === 4 ? "#D16F32" : "#909090",
                      fontSize: 17,
                      fontWeight: value === 4 ? "bold" : "",
                    }}
                    label="Email"
                    {...a11yProps(1)}
                  />
                  <Tab
                    style={{
                      textTransform: "none",
                      color: value === 5 ? "#D16F32" : "#909090",
                      fontSize: 17,
                      fontWeight: value === 5 ? "bold" : "",
                    }}
                    label="Templates"
                    {...a11yProps(1)}
                  />
                </Tabs>
              )}
              {userData?.isVerified === false && (
                <Tabs
                  TabIndicatorProps={{
                    style: { background: "#D16F32" },
                  }}
                  value={value}
                  variant="scrollable"
                  onChange={handleChange}
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  aria-label="scrollable auto tabs example"
                >
                  <Tab
                    style={{
                      textTransform: "none",
                      color: value === 0 ? "#D16F32" : "#909090",
                      fontSize: 17,
                      fontWeight: value === 0 ? "bold" : "",
                    }}
                    label="Basic"
                    {...a11yProps(0)}
                  />
                </Tabs>
              )}
            </Box>
          )}
          <TabPanel value={value} index={0}>
            <div className="text-xl py-5 pl-5 mt-3 text-left border border-[#F6F7F7] shadow rounded-t-2xl font-bold text-[#797979]">
              Basic
            </div>
            <div className="companyprofile-table">
              <table className="w-full shadow-lg rounded-2xl">
                <tbody>
                  <tr>
                    <td>Phone Number:</td>
                    <td>{userData?.phoneNumber}</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>{userData?.email}</td>
                  </tr>
                  <tr>
                    <td>Company Name</td>
                    <td>{userData?.company_name}</td>
                  </tr>
                  <tr>
                    <td>Services we Provide:</td>
                    <td>{userData?.companyType}</td>
                  </tr>
                  <tr>
                    <td>Website:</td>
                    <td>{userData?.companyWebsite}</td>
                  </tr>
                  <tr>
                    <td>Joining Date:</td>
                    <td>{moment(userData?.createdAt).format("D MMM YYYY")}</td>
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <td>
                      {" "}
                      {`${userData?.Address || ""} ${userData?.city || ""} ${
                        userData?.country || ""
                      }  `}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {!!isDetails && (
              <div className="uppercase">
                <div>
                  <div className="py-5 px-10 pl-5 mt-3 text-left border border-[#F6F7F7] shadow text-[#797979] flex justify-between">
                    <span className="rounded-t-2xl font-bold text-xl">
                      Details history
                    </span>
                    <div
                      className="capitalize bg-primary cursor-pointer h-7 font-700 px-6 rounded-md text-white"
                      onClick={() => {
                        setIsDetails(false);
                        setPageDetails(0);
                        setPageSizeDetails(10);
                        setDetailsData(null);
                        setDetailsDownloadEmailData(null);
                        setPaginationDataDetails(null);
                        setPaginationDataDetailsPayment(null);
                        setPrintAndPost(null);
                      }}
                    >
                      Back
                    </div>
                  </div>
                  {!!printAndPost && (
                    <div className="w-full shadow-lg rounded-2xl">
                      {!!paginationDataDetailsPayment && detailsData && (
                        <LnbDataGrid
                          apiLoading={apiLoading}
                          rowData={detailsData}
                          paginationData={paginationDataDetailsPayment}
                          setPage={setPageDetails}
                          setPageSize={setPageSizeDetails}
                          columns={columns}
                        />
                      )}
                      {!paginationDataDetailsPayment && detailsData && (
                        <div>Loading ...</div>
                      )}
                    </div>
                  )}

                  {!printAndPost && (
                    <div className="w-full shadow-lg rounded-2xl">
                      {!!paginationDataDetails && detailsDownloadEmailData && (
                        <LnbDataGrid
                          apiLoading={apiLoading}
                          rowData={detailsDownloadEmailData}
                          paginationData={paginationDataDetails}
                          setPage={setPageDetails}
                          setPageSize={setPageSizeDetails}
                          columns={columns}
                        />
                      )}
                      {!paginationDataDetails && detailsDownloadEmailData && (
                        <div>Loading ...</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {!isDetails && (
              <div>
                <div className="text-xl py-5 pl-5 mt-3 text-left border border-[#F6F7F7] shadow rounded-t-2xl font-bold text-[#797979]">
                  PAYMENT HISTORY
                </div>
                <div className="w-full shadow-lg rounded-2xl">
                  {!!paginationData && serviceData && (
                    <LnbDataGrid
                      apiLoading={apiLoading}
                      rowData={serviceData}
                      paginationData={paginationData}
                      setPage={setPage}
                      setPageSize={setPageSize}
                      columns={paymentHistoryColumns}
                    />
                  )}
                  {!paginationData && serviceData && <div>Loading ...</div>}
                </div>
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2}>
            {!!isDetails && (
              <div className="uppercase">
                <div>
                  <div className="py-5 px-10 pl-5 mt-3 text-left border border-[#F6F7F7] shadow text-[#797979] flex justify-between">
                    <span className="rounded-t-2xl font-bold text-xl">
                      Details history
                    </span>
                    <div
                      className="capitalize bg-primary cursor-pointer h-7 font-700 px-6 rounded-md text-white"
                      onClick={() => {
                        setIsDetails(false);
                        setPageDetails(0);
                        setPageSizeDetails(10);
                        setDetailsData(null);
                        setDetailsDownloadEmailData(null);
                        setPaginationDataDetails(null);
                        setPaginationDataDetailsPayment(null);
                        setPrintAndPost(null);
                      }}
                    >
                      Back
                    </div>
                  </div>
                  <div className="w-full shadow-lg rounded-2xl">
                    {!!paginationDataDetailsPayment && detailsData && (
                      <LnbDataGrid
                        apiLoading={apiLoading}
                        rowData={detailsData}
                        paginationData={paginationDataDetailsPayment}
                        setPage={setPageDetails}
                        setPageSize={setPageSizeDetails}
                        columns={columnsForPrintPost}
                      />
                    )}
                    {!paginationData && serviceData && <div>Loading ...</div>}
                  </div>
                </div>
              </div>
            )}
            {!isDetails && (
              <div>
                <div className="text-xl py-5 pl-5 mt-3 text-left border border-[#F6F7F7] shadow rounded-t-2xl font-bold text-[#797979]">
                  PRINT AND POST
                </div>
                <div className="w-full shadow-lg rounded-2xl">
                  {!!paginationData && serviceData && (
                    <LnbDataGrid
                      apiLoading={apiLoading}
                      rowData={serviceData}
                      paginationData={paginationData}
                      setPage={setPage}
                      setPageSize={setPageSize}
                      columns={paymentColumns}
                    />
                  )}
                  {!paginationData && serviceData && <div>Loading ...</div>}
                </div>
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={3}>
            {!!isDetails && (
              <div className="uppercase">
                <div>
                  <div className="py-5 px-10 pl-5 mt-3 text-left border border-[#F6F7F7] shadow text-[#797979] flex justify-between">
                    <span className="rounded-t-2xl font-bold text-xl">
                      Details history
                    </span>
                    <div
                      className="capitalize bg-primary cursor-pointer h-7 font-700 px-6 rounded-md text-white"
                      onClick={() => {
                        setIsDetails(false);
                        setPageDetails(0);
                        setPageSizeDetails(10);
                        setDetailsData(null);
                        setDetailsDownloadEmailData(null);
                        setPaginationDataDetails(null);
                        setPaginationDataDetailsPayment(null);
                        setPrintAndPost(null);
                      }}
                    >
                      Back
                    </div>
                  </div>
                  <div className="w-full shadow-lg rounded-2xl">
                    {!!paginationDataDetails && detailsDownloadEmailData && (
                      <LnbDataGrid
                        apiLoading={apiLoading}
                        rowData={detailsDownloadEmailData}
                        paginationData={paginationDataDetails}
                        setPage={setPageDetails}
                        setPageSize={setPageSizeDetails}
                        columns={columns}
                      />
                    )}
                    {!paginationData && serviceData && <div>Loading ...</div>}
                  </div>
                </div>
              </div>
            )}
            {!isDetails && (
              <div>
                <div className="text-xl py-5 pl-5 mt-3 text-left border border-[#F6F7F7] shadow rounded-t-2xl font-bold text-[#797979]">
                  DOWNLOAD
                </div>
                <div className="w-full shadow-lg rounded-2xl">
                  {!!paginationData && serviceData && (
                    <LnbDataGrid
                      apiLoading={apiLoading}
                      rowData={serviceData}
                      paginationData={paginationData}
                      setPage={setPage}
                      setPageSize={setPageSize}
                      columns={paymentColumnsDownloadEmail}
                    />
                  )}
                  {!paginationData && serviceData && <div>Loading ...</div>}
                </div>
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={4}>
            {!!isDetails && (
              <div className="uppercase">
                <div>
                  <div className="py-5 px-10 pl-5 mt-3 text-left border border-[#F6F7F7] shadow text-[#797979] flex justify-between">
                    <span className="rounded-t-2xl font-bold text-xl">
                      Details history
                    </span>
                    <div
                      className="capitalize bg-primary cursor-pointer h-7 font-700 px-6 rounded-md text-white"
                      onClick={() => {
                        setIsDetails(false);
                        setPageDetails(0);
                        setPageSizeDetails(10);
                        setDetailsData(null);
                        setDetailsDownloadEmailData(null);
                        setPaginationDataDetails(null);
                        setPaginationDataDetailsPayment(null);
                        setPrintAndPost(null);
                      }}
                    >
                      Back
                    </div>
                  </div>
                  <div className="w-full shadow-lg rounded-2xl">
                    {!!paginationDataDetails && detailsDownloadEmailData && (
                      <LnbDataGrid
                        apiLoading={apiLoading}
                        rowData={detailsDownloadEmailData}
                        paginationData={paginationDataDetails}
                        setPage={setPageDetails}
                        setPageSize={setPageSizeDetails}
                        columns={columns}
                      />
                    )}
                    {!paginationData && serviceData && <div>Loading ...</div>}
                  </div>
                </div>
              </div>
            )}
            {!isDetails && (
              <div>
                <div className="text-xl py-5 pl-5 mt-3 text-left border border-[#F6F7F7] shadow rounded-t-2xl font-bold text-[#797979]">
                  EMAIL
                </div>
                <div className="w-full shadow-lg rounded-2xl">
                  {!!paginationData && serviceData && (
                    <LnbDataGrid
                      apiLoading={apiLoading}
                      rowData={serviceData}
                      paginationData={paginationData}
                      setPage={setPage}
                      setPageSize={setPageSize}
                      columns={paymentColumnsDownloadEmail}
                    />
                  )}
                  {!paginationData && serviceData && <div>Loading ...</div>}
                </div>
              </div>
            )}
          </TabPanel>
          <TabPanel value={value} index={5}>
            <div>
              <div className="py-5 px-10 pl-5 mt-3 text-left border border-[#F6F7F7] shadow text-[#797979] flex justify-between items-center">
                <span className="rounded-t-2xl font-bold text-xl">
                  Template List
                </span>
                <button
                  onClick={() => setTemplateModalOpen(!templateModalOpen)}
                  className="bg-primary py-2 px-4 rounded-sm text-white font-semibold hover:bg-primaryHover "
                >
                  Upload Template
                </button>
              </div>
              <div className="w-full shadow-lg rounded-2xl">
                {!!paginationData && templateList && (
                  <LnbDataGrid
                    apiLoading={apiLoading}
                    rowData={templateList}
                    paginationData={paginationData}
                    setPage={setPage}
                    setPageSize={setPageSize}
                    columns={columnsForTempleteList}
                  />
                )}
                {!paginationData && templateList && <div>Loading ...</div>}
              </div>
            </div>
          </TabPanel>
        </Box>
      </div>
      {!!userData ? (
        <EditProfileModal
          open={open}
          data={userData}
          setOpen={setOpen}
          getProfileData={getProfileData}
        />
      ) : (
        <div>Loading...</div>
      )}
      <ChangePasswordModal open={openChangePass} setOpen={setOpenChangePass} />
      <StripeCheckout
        name="Local New Business"
        image="https://lnb-data.s3.eu-west-2.amazonaws.com/logos/LNBLogo.png"
        billingAddress
        shippingAddress
        description={`Your total is £5`}
        amount={5 * 100}
        token={onToken}
        stripeKey={
          "pk_test_51LzjiLKxA1nMm4Zk1XBA05wuv8Ugj5CNIvFET7shLNeGO3FPLl7m4Xplt8MOk0rr2qrV7HU2pjhU4ob4lzs7C23R00NxQjLJuq"
        }
      >
        <button ref={checkOutRef} className="hidden"></button>
      </StripeCheckout>

      <PaymentNavigationConfirmationModal
        open={paymentNavModalOpen}
        setOpen={setPaymentNavModalOpen}
      />

      {!!letterId && (
        <LetterModal
          open={modalOpen}
          setOpen={setModalOpen}
          letterId={letterId}
        />
      )}

      <CompanyDetailsModal
        open={companyModal}
        companyId={companyId}
        setCompanyModal={setCompanyModal}
      />

      <EditLabelDataModal
        open={lableDialogOpen}
        setOpen={setLableDialogOpen}
        labeldata={labelValue}
      />
      <ServiceConvertModal
        packageName={packageNameConvert}
        open={openServiceConvert}
        setOpen={setOpenServiceConvert}
        convertData={convertData}
      />
      <TemplateUploader
        open={templateModalOpen}
        setOpen={setTemplateModalOpen}
      />
      {!!letterPdfUrl && (
        <ViewTemplateModal
          open={viewTemplateModalOpen}
          setOpen={setViewTemplateModalOpen}
          letterPdfUrl={letterPdfUrl}
        />
      )}
    </>
  );
};

export default MyProfile;

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
        <Box sx={{}}>
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
    index: index,
  };
}

// service change menu button

const ThreeDotMenu = ({ handleSelect, value }) => {
  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const handleClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElMenu(null);
  };

  const handleOptionSelect = (option) => {
    handleSelect(option.value);
    handleClose();
  };

  return (
    <>
      <MoreVertIcon onClick={handleClick} style={{ cursor: "pointer" }} />
      <Menu
        anchorEl={anchorElMenu}
        open={Boolean(anchorElMenu)}
        onClose={handleClose}
      >
      
        { value === "Print and Post" ? options
          .filter((option) => !option.label.includes(value)  )
          .map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleOptionSelect(option)}
            >
              {option.label}
            </MenuItem>
          )) : options
          .filter((option) => !option.label.includes("Email") && !option.label.includes("Download") )
          .map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleOptionSelect(option)}
            >
              {option.label}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};
