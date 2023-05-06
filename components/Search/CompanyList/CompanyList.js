import React, { useEffect, useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import { DataGrid, GridFooterContainer } from "@mui/x-data-grid";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import SearchModal from "./SearchModal/SearchModal";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Link from "next/link";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useRecoilState, useResetRecoilState } from "recoil";
import { paginationRecoil } from "../../../store/atoms/paginationRecoil";
import { companyListRecoilState } from "../../../store/atoms/companyListRecoil";
import { paginationClient } from "../../../library/utils/queryClient";
import { totalCompanyRecoil } from "../../../store/atoms/totalCompanyRecoil";
import { apiClientRecoil } from "../../../store/atoms/apiClientRecoil";
import { companySearchDataRecoil } from "../../../store/atoms/companySearchDataRecoil";
import { Cancel } from "@mui/icons-material";
import { DownlaodLargeData } from "../../../store/atoms/DownloadLargeData";

const CompanyList = ({ data, rows }) => {
  const [open, setOpen] = React.useState(false);
  const [paginationState, setPaginationState] =
    useRecoilState(paginationRecoil);
  const [companyData, setCompanyData] = useRecoilState(companyListRecoilState);

  const [totalCompany, setTotalCompany] = useRecoilState(totalCompanyRecoil);
  const [company, setCompany] = useState();

  const resetPaginationRecoil = useResetRecoilState(paginationRecoil);
  const resetApiClientRecoil = useResetRecoilState(apiClientRecoil);
  const [apiClientState, setApiClientState] = useRecoilState(apiClientRecoil);
  const [companySearchDataState, setCompanySearchDataRecoil] = useRecoilState(
    companySearchDataRecoil
  );
  const [shouldUpdate, setShouldUpdate] = useState(true);


  console.log("Company Details ", totalCompany,companyData);


  

  useEffect(() => {
    window.scrollTo({ top: 800, behavior: "instant" });
    // const totaldata = JSON.parse(localStorage.getItem("totaldata"));
    // setCompany(totalCompany);
    rowBuilder(totalCompany);
  }, [totalCompany]);

  // React.useEffect(() => {
  //   if (company) {
  //     rowBuilder(company);
  //   }
  // }, [company]);

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = async (e) => {
    if (companyData.length > 0) setShouldUpdate(false);
    else setShouldUpdate(true);

    try {
      setPaginationState((prev) => ({
        ...prev,
        sort_by: e.target.value,
      }));
      const response = await paginationClient({
        ...paginationState,
        sort_by: e.target.value,
      });
      // console.log("RESPONSE", response)
      setTotalCompany(response);
      // rowBuilder(response);
    } catch (error) {
      setPaginationState((prev) => ({
        ...prev,
      }));
      console.log(error);
    }
  };

  const resetRecoilState = () => {
    resetApiClientRecoil();
  };

  const handleLimit = async (p) => {
    // console.log("LIMIT ", p.target.value)
    resetRecoilState();
    try {
      setPaginationState((prev) => ({
        ...prev,
        limit: p.target.value,
        page: 1,
      }));

      const response = await paginationClient({
        ...paginationState,
        limit: p.target.value,
        page: 1,
      });
      // console.log("RESPONSE", response)

      setApiClientState((prev) => ({
        ...prev,
        data: response,
        previousRoute: "/",
      }));

      setPaginationState((prev) => ({
        ...prev,
        limit: p.target.value,
        page: 1,
        total: response.noOfDocuments,
        noTotalPage: response.noOfPages,
      }));
      //console.log("paginationState2", paginationState);

      setTotalCompany(response);
      // rowBuilder(response);
    } catch (error) {
      setPaginationState((prev) => ({
        ...prev,
      }));
      console.log(error);
    }
  };

  const handleNext = async (e) => {
    if (companyData.length > 0) setShouldUpdate(false);
    else setShouldUpdate(true);

    try {
      setPaginationState((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
      const response = await paginationClient({
        ...paginationState,
        page: paginationState.page + 1,
      });
      // console.log("RESPONSE", response)

      setTotalCompany(response);
      // rowBuilder(response);
    } catch (error) {
      setPaginationState((prev) => ({
        ...prev,
      }));
      console.log(error);
    }
  };
  const handlePrev = async (e) => {
    if (companyData.length > 0) setShouldUpdate(false);
    else setShouldUpdate(true);

    try {
      setPaginationState((prev) => ({
        ...prev,
        page: prev.page === 1 ? 1 : prev.page - 1,
      }));
      const response = await paginationClient({
        ...paginationState,
        page: paginationState.page === 1 ? 1 : paginationState.page - 1,
      });
      // console.log("RESPONSE", response)
      // rowBuilder(response);
      setTotalCompany(response);
    } catch (error) {
      setPaginationState((prev) => ({
        ...prev,
      }));
      console.log(error);
    }
  };

  const columns = [
    {
      field: "companyname",
      headerName: "Company name",
      flex: 1,
      minWidth: 230,
      renderCell: (params) => (
        <Tooltip
          title={
            params?.value?.charAt(0)?.toUpperCase() +
            params?.value.slice(1).toLowerCase()
          }
        >
          <span>
            {params.value.charAt(0).toUpperCase() +
              params.value.slice(1).toLowerCase()}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "companynumber",
      headerName: "Company Number",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    { field: "type", headerName: "Type", width: 70 },
    {
      field: "creationdate",
      headerName: "Creation Date",
      type: "date",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "postcode",
      headerName: "Post Code",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "siccode",
      headerName: "Sic Code",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <div className="flex items-center border-2 border-solid px-2 py-1 rounded-2xl">
            <FiberManualRecordIcon
              className={`${
                params?.value === "active" ? "text-green-600 " : "text-gray-600"
              } h-4 w-4`}
            />
            <span className="ml-1">
              {params?.value.charAt(0).toUpperCase() + params?.value.slice(1)}
            </span>
          </div>
        );
      },
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      minWidth: 70,
      renderCell: (params) => {
        return (
          <div className="text-center">
            <Link href={`/companynumber/${params.value}`}>
              <Tooltip title={"View detail"}>
                <IconButton aria-label="delete" size="small">
                  <RemoveRedEyeOutlinedIcon
                    fontSize="inherit"
                    className="text-[#3294D1]"
                  />
                </IconButton>
              </Tooltip>
            </Link>
          </div>
        );
      },
    },
  ];

  function CustomFooter() {


    const [downloadChecked, setDownloadChecked] = useRecoilState(DownlaodLargeData);



    console.log(downloadChecked)

    return (
      <GridFooterContainer className="CustomFooter flex flex-col md:flex-row lg:flex-row xl:flex-row justify-between">
        <div>
          <p className="p-3">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                setCompanyData([]);
              }}
              edge="end"
              className=""
            >
              <Tooltip placement="right" title={"Clear selected companies"}>
                <Cancel fontSize="inherit" className="text-red-500" />
              </Tooltip>
            </IconButton>
            <span  className="text-[14px] ml-3">
              <b> Selected data:</b> {companyData.length}
            </span>
          </p>
          <FormGroup className="px-4">
            <FormControlLabel
              control={<Checkbox checked={downloadChecked} onChange={(e) => {setDownloadChecked(e.target.checked)
                if (e.target.checked) {
                  setCompanyData(companySearchDataState.map((company) => company.companynumber));
                } else {
                  setCompanyData([]);
                }
              }}  color="success"/>}
              label={
                <span className="text-[14px]"><b>Download Entire Dataset</b></span>
              }

            />
          </FormGroup>
        </div>

        <div className="m-2 flex justify-between items-end">
          <p className="p-3">
            {/* {paginationState.page === 1
              ? 1
              : (paginationState.page - 1) * paginationState.limit + 1}{" "} */}
            {paginationState.page}{" "}
            {/* -{" "}
              {(paginationState.page - 1) * paginationState.limit +
              1 +
              rows.length -
              1}{" "} */}
            of {paginationState.noTotalPage} pages
          </p>
          <div className="px-4 pt-4 flex gap-2">
            <Button
              disabled={paginationState.page === 1}
              className="mr-1"
              variant="contained"
              sx={{ padding: ".5rem" }}
              onClick={handlePrev}
            >
              <AiOutlineArrowLeft className="m-1" sx={{ color: "#fff" }} />
            </Button>
            <Button
              disabled={paginationState.page === paginationState.noTotalPage}
              className="ml-1"
              variant="contained"
              onClick={handleNext}
              sx={{ padding: ".5rem" }}
            >
              <AiOutlineArrowRight className="m-1" sx={{ color: "#fff" }} />
            </Button>
          </div>
        </div>
      </GridFooterContainer>
    );
  }

  // const [rows, setRows] = useState();
  const [searched, setSearched] = useState("");

  function rowBuilder(data) {
    const dataRows = data?.companyData?.map((row) => ({
      id: row?.company_number,
      companyname: row?.company_name,
      companynumber: row?.company_number,
      type: row?.company_type,
      creationdate: new Date(row?.date_of_creation) ?? "N/A",
      city: row?.registered_office_address.locality,
      country: row?.registered_office_address.country,
      postcode: row?.registered_office_address.postal_code,
      siccode: row.sic_codes.toString(),
      status: row?.company_status,
      details: row?.company_number,
    }));
    setCompanySearchDataRecoil(dataRows);
  }

  function handleRowSelect(p) {
    setCompanyData((prev) => {
      if (prev.length > 0) {
        let i = prev.indexOf(p);
        if (i > -1) {
          return prev.filter((el) => el !== p);
        } else {
          return [...prev, p];
        }
      } else {
        return [...prev, p];
      }
    });
  }

  const requestSearch = (e) => {
    setSearched(e.target.value);
    if (searched.length <= 1) {
      // rowBuilder(company);
      rowBuilder(totalCompany);
    } else {
      const filteredRows = companySearchDataState.filter((row) => {
        return row.companyname.toLowerCase().includes(searched.toLowerCase());
      });
      // rowBuilder(filteredRows);
      setCompanySearchDataRecoil(filteredRows);
    }
  };

  // console.log(rows);

  const noResultsText = "No results found";

  const localeText = {
    noRowsLabel: noResultsText,
  };

  return (
    <div>
      <div className="flex flex-col py-3 border-2 px-2  shadow-md lg:flex-row ">
        <div className="flex flex-col justify-between w-full lg:w-3/4 lg:flex-row md:flex-row sm:flex-row items-center">
          <div className="w-full flex lg:w-2/4">
            <h6 className="mr-2 text-[15px] font-bold">Company List</h6>
            <p className="text-[14px]">
              {paginationState?.total} companies found
            </p>
          </div>
          <div className="flex mr-3 items-center mt-2 lg:mt-0 w-full lg:w-2/4 sm:justify-end px-2">
            <p className="mr-2 text-[14px]">Company list per page</p>
            <select
              value={paginationState.limit}
              className="border-2 border-solid rounded h-8"
              onChange={handleLimit}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              {/* <option value={100}>100</option> */}
            </select>
          </div>
        </div>

        <div className="flex lg:justify-between items-center w-full lg:w-auto mt-5 lg:mt-0">
          <div className="w-2/4 ">
            <div className="flex border-2 border-solid rounded px-0 py-1 mr-1 h-8 items-center relative lg:px-2 md:justify-between">
              <input
                value={searched}
                placeholder="Search Here"
                onChange={requestSearch}
                className="Searchbar"
                sx={{
                  "& .css-i4bv87-MuiSvgIcon-root": {
                    display: "none!important",
                  },
                }}
              />

              <button onClick={handleOpen}>
                {" "}
                <TuneIcon className="cursor-pointer" />
              </button>

              <SearchModal
                open={open}
                setOpen={setOpen}
                handleOpen={handleOpen}
                handleClose={handleClose}
                rowBuilder={rowBuilder}
              />
            </div>
          </div>
          <div className="w-2/4 lg:w-auto">
            <div className="flex border-2 border-solid rounded px-0 h-8 lg:px-2 ">
              <select className="w-full" onChange={handleChange}>
                <option value="">Sort By</option>
                <option value="company_name">Company Name</option>
                <option value="city">City</option>
                <option value="date_of_creation">Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div>
        {!!companySearchDataState && (
          <div style={{ height: 700, width: "100%" }}>
            <DataGrid
              rows={companySearchDataState}
              columns={columns}
              rowsPerPageOptions={[paginationState.limit]}
              checkboxSelection
              defaultChecked
              localeText={localeText}
              // disableSelectionOnClick
              // keepNonExistentRowsSelected
              onSelectionModelChange={(newSelectionModel, details) => {
                if (shouldUpdate) {
                  setCompanyData((prev) => {
                    if (newSelectionModel.length < 1) return newSelectionModel;
                    var c = newSelectionModel.concat(
                      prev.filter((item) => newSelectionModel.indexOf(item) < 0)
                    );
                    return c;
                  });
                } else {
                  setShouldUpdate(true);
                }
              }}
              selectionModel={companyData}
              onCellClick={(p, e) => {
                if (p.field === "__check__") {
                  handleRowSelect(p.row.companynumber);
                }
              }}
              onColumnHeaderClick={(p, e) => {
                if (p.field === "__check__") {
                  if (companyData.length > 0) {
                    setCompanyData([]);
                  }
                }
              }}
              components={{ Footer: CustomFooter }}
              // components={
              //   NoRowsOverlay: () => (
              //     <Stack
              //       height="100%"
              //       alignItems="center"
              //       justifyContent="center"
              //     >
              //       No data available
              //     </Stack>
              //   ),
              //   NoResultsOverlay: () => (
              //     <Stack
              //       height="100%"
              //       alignItems="center"
              //       justifyContent="center"
              //     >
              //       CustomFooter
              //     </Stack>
              //   ),
              //   Footer: CustomFooter
              // }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
