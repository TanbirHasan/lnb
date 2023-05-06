import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import apiClient from "../../library/apis/api-client";
import LnbDataGrid from "../common/MyProfile/DataGridLnb";
import { useRouter } from "next/router";

const PaymentHistory = () => {
  const [rowsData, setRowsData] = useState([]);
  const [paginationData, setPaginationData] = useState();
  const [apiLoading, setApiLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const route = useRouter();
  const userkey = route?.query?.slug;

  const pageNumber = route?.query.page;

  const getPaymentHistory = async () => {
    if (!!userkey) {
      try {
        setApiLoading(true);
        const res = await apiClient.post(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/history/paymentHistorybyUserId?page=${page + 1}&limit=${pageSize}`,
          { userId: userkey }
        );
        if (res.status === 200) {
          const dataRows = res?.data?.paymentHistory?.map((row) => ({
            id: row?._id,
            packagename: row?.package_name,
            username: row?.username,
            paidamount: row?.paid_amount,
            paymentstatus: row?.payment_status,
            companylist: row?.companyList,
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
    }
  };

  useEffect(() => {
    getPaymentHistory();
  }, [page, pageSize]);

  const handleRoute = () => {
    route.push({
      pathname: "/dashboard/allpayments",
      query: { pageNumber },
    });
  };

  const columns = [
    //  { field: 'id', headerName: "ID", width: 130 },
    {
      field: "packagename",
      headerName: "Package Name",
      minWidth: 150,
      flex: 1,
      sortable: false,
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
      headerName: "User name",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "paidamount",
      headerName: "Paid Amount",
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: "paymentstatus",
      headerName: "Payment Status",

      minWidth: 130,
      flex: 1,
      sortable: false,
    },
    {
      field: "companylist",
      headerName: "Company List",
      sortable: false,
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return params?.row?.companyList?.map((item) => (
          <li key={item._id}>{item}</li>
        ));
      },
    },
  ];

  return (
    <Dashboard>
      <div className="pt-10">
        <div className="flex flex-col py-3 px-2 lg:flex-row bg-white my-2 rounded">
          <div className="flex flex-col justify-between w-full lg:flex-row md:flex-row sm:flex-row items-center">
            <div className="w-full flex justify-between">
              <h6 className="mr-2 text-2xl font-bold">Payment History</h6>
              <button
                className="border-2 border-solid border-black rounded px-2 py-1"
                onClick={handleRoute}
              >
                Back
              </button>
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
              <LnbDataGrid
                apiLoading={apiLoading}
                rowData={rowsData}
                paginationData={paginationData}
                setPage={setPage}
                setPageSize={setPageSize}
                columns={columns}
              />
            )}
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default PaymentHistory;
