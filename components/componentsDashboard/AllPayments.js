import React, {useEffect, useState} from "react";
import Dashboard from "../Dashboard/Dashboard";
import apiClient from "../../library/apis/api-client";
import moment from "moment/moment";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {useRouter} from "next/router";
import {DataGrid, GridFooter, GridFooterContainer, GridToolbar,} from "@mui/x-data-grid";
import {Box, MenuItem, TextField} from "@mui/material";

const AllPayments = () => {
  const [rowsData, setRowsData] = useState([]);
  const [paginationData, setPaginationData] = useState();
  const [apiLoading, setApiLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [serviceData, setServiceData] = useState("");

  const router = useRouter();

  const getservice = (service) => {
    setServiceData(service);
  };

  useEffect(() => {
    const pageNumer = router?.query.pageNumber;
    setPage(pageNumer);
  }, [router]);

  const getPaymentHistory = async () => {
    try {
      setApiLoading(true);

      const res = await apiClient.get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/history/allPaymentHistory?page=${
          page + 1
        }&limit=${pageSize}&package_name=${serviceData}`
      );

      if (res.status === 200) {
        const dataRows = res?.data?.paymentHistory?.map((row) => ({
          id: row?._id,
          packagename: row?.package_name,
          username: row?.username,
          paidamount: row?.paid_amount,
          createdat: moment(row?.createdAt).format("D MMM YYYY"),
          updatedat: moment(row?.updatedAt).format("D MMM YYYY"),
          paymentstatus: row?.payment_status,
          companylist: row?.companyList,
          userID: row?.userId,
        }));

        const paginationData = {
          totalRowCount: res?.data.noOfDocuments,
          limit: pageSize,
          page: page,
        };

        setRowsData(dataRows);
        setPaginationData(paginationData);
        setApiLoading(false);
      }
    } catch (e) {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    getPaymentHistory();
  }, [page, pageSize, serviceData]);

  const handleNavigate = (params) => {
    router.push({
      pathname: `/dashboard/paymenthistory/${params?.row.userID}`,
      query: { page },
    });
  };

  const columns = [
    //  { field: 'id', headerName: "ID", width: 130 },
    {
      field: "packagename",

      minWidth: 190,
      flex: 1,
      sortable: false,
      renderHeader: (params) => <strong>Package Name & Mail</strong>,
      renderCell: (params) => (
        <h3>
          {params?.row.packagename === "MAIL_PRINT_SERVICE"
            ? "Print Service"
            : "" || params?.row.packagename === "EMAIL_SERVICE"
            ? "Email Service"
            : "" || params?.row.packagename === "DOWNLOAD_SERVICE"
            ? "Downlaod Service"
            : ""}
        </h3>
      ),
    },
    {
      field: "username",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: (params) => <strong>User Name</strong>,
    },
    {
      field: "paidamount",

      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: (params) => <strong>Paid Amount</strong>,
    },
    {
      field: "createdat",

      type: "date",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      sortable: false,
      renderHeader: (params) => <strong>Created At</strong>,
    },
    {
      field: "updatedat",

      type: "date",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      sortable: false,
      renderHeader: (params) => <strong>Updated At</strong>,
    },
    {
      field: "paymentstatus",

      minWidth: 130,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: (params) => <strong>Payment Status</strong>,
      renderCell: (params) => {
        return (
          <div
            className={`${
              params?.value === "UNPAID"
                ? "border-2 boder solid rounded-2xl border-red-500"
                : "border-2 boder solid rounded-2xl border-green-500"
            }`}
          >
            <span className="ml-1 px-2 py-1">
              {params?.value === "UNPAID" ? "Pending" : "Completed"}
            </span>
          </div>
        );
      },
    },
    {
      field: "details",
      headerAlign: "center",
      algin: "center",
      sortable: false,
      renderHeader: (params) => <strong>Details</strong>,
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        // <Link href={`paymenthistory/${params?.row.userID}`}>
        //   <RemoveRedEyeOutlinedIcon
        //     fontSize="inherit"
        //     className="text-[#3294D1] cursor-pointer text-xl mx-auto"
        //   />
        // </Link>
        <RemoveRedEyeOutlinedIcon
          onClick={() => handleNavigate(params)}
          fontSize="inherit"
          className="text-[#3294D1] cursor-pointer text-xl mx-auto"
        />
      ),
    },
  ];

  const [rowCountState, setRowCountState] = React.useState(
    paginationData?.totalRowCount || 0
  );

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      paginationData?.totalRowCount !== undefined
        ? paginationData?.totalRowCount
        : prevRowCountState
    );
  }, [paginationData?.totalRowCount, setRowCountState]);

  function CustomFooter() {
    return (
      <>
        <GridFooterContainer>
          <Box width="250px" margin="15px">
            <TextField
              label="Select Service"
              select
              value={serviceData}
              onChange={(e) => getservice(e.target.value)}
              fullWidth
            >
              <MenuItem value="MAIL_PRINT_SERVICE">Print Service</MenuItem>
              <MenuItem value="EMAIL_SERVICE">Email Service</MenuItem>
              <MenuItem value="DOWNLOAD_SERVICE">Dowload Service</MenuItem>
            </TextField>
          </Box>

          <GridFooter
            sx={{
              border: "none", // To delete double border.
            }}
          />
        </GridFooterContainer>
      </>
    );
  }

  return (
    <Dashboard>
      <div className="pt-10 bg-slate-100 h-screen">
        <div className="flex flex-col py-3 px-2 lg:flex-row bg-white my-2 rounded">
          <div className="flex flex-col justify-between w-full lg:w-3/4 lg:flex-row md:flex-row sm:flex-row items-center">
            <div className="w-full flex lg:w-2/4">
              <h6 className="mr-2 text-2xl font-bold">Payment History</h6>
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              height: 500,
              width: "100%",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
          >
            {!!paginationData && !!rowsData && (
              <DataGrid
                // apiLoading={apiLoading}
                // rowData={rowsData}
                // paginationData={paginationData}
                // setPage={setPage}
                // setPageSize={setPageSize}
                // columns={columns}
                rows={rowsData}
                rowCount={rowCountState}
                loading={apiLoading}
                rowsPerPageOptions={[5, 10, 15]}
                pagination
                page={paginationData?.page}
                HorizontalContentAlignment="Center"
                pageSize={paginationData?.limit}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                columns={columns}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                disableExport
                components={{ Toolbar: GridToolbar, Footer: CustomFooter }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    csvOptions: { disableToolbarButton: true },
                    printOptions: { disableToolbarButton: true },
                  },
                }}

                // initialState={initialState}
              />
            )}
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default AllPayments;
