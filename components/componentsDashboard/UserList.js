import Link from "next/link";
import React, {useEffect, useState} from "react";
import apiClient from "../../library/apis/api-client";
import LnbDataGrid from "../common/MyProfile/DataGridLnb";
import Dashboard from "../Dashboard/Dashboard";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import UserListDialog from "./UserListDialog/index";

const UserList = () => {
  const [rowsData, setRowsData] = useState([]);
  const [paginationData, setPaginationData] = useState();
  const [apiLoading, setApiLoading] = useState(false);
  const [page, setPage] = useState(0);

  const [pageSize, setPageSize] = useState(5);
  const [userid, setUserId] = useState();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id) => {
    //console.log(id);
    setUserId(id);
    setOpen(true);
  };

  const getUserList = async () => {
    try {
      setApiLoading(true);
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/?page=${
          page + 1
        }&limit=${pageSize}`
      );

      if (res.status === 200) {
        const dataRows = res?.data?.data?.map((row) => ({
          id: row?._id,
          name: row?.username,
          companyname: row?.company_name,
          companytype: row?.companyType,

          phonenumber: row?.phoneNumber,
        }));
        console.log(res.data);
        // console.log("resCounts",res?.data.noOfDocuments)
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
      //console.log(e);
      setApiLoading(false);
    }
  };

  useEffect(() => {
    getUserList();
  }, [page, pageSize]);

  // defining columns

  const columns = [
    {
      field: "name",

      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: (params) => <strong>User Name & Mail</strong>,
    },
    {
      field: "companyname",

      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: (params) => <strong>Company Name</strong>,
    },
    {
      field: "companytype",

      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: (params) => <strong>Company Type</strong>,
    },
    {
      field: "phonenumber",

      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: (params) => <strong>Phone Number</strong>,
    },

    {
      field: "details",
      headerName: "Payment Details",
      minWidth: 100,

      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: (params) => <strong>Details</strong>,
      renderCell: (params) => (
        <Link href="">
          <RemoveRedEyeOutlinedIcon
            fontSize="inherit"
            className="text-[#3294D1] cursor-pointer text-xl mx-auto"
            onClick={() => handleClickOpen(params.row.id)}
          />
        </Link>
      ),
    },
  ];

  return (
    <Dashboard>
      <div className="pt-10 bg-slate-100 h-screen">
        <div className="flex flex-col py-3 px-2 lg:flex-row my-2 bg-white rounded">
          <div className="flex flex-col justify-between w-full lg:w-3/4 lg:flex-row md:flex-row sm:flex-row items-center">
            <div className="w-full flex lg:w-2/4">
              <h6 className="mr-2 text-2xl font-bold">Users List</h6>
            </div>
          </div>
        </div>
        <div></div>
        <div style={{ height: 500, width: "100%", backgroundColor: "white" }}>
          {!!rowsData && paginationData && (
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
        <UserListDialog
          open={open}
          setOpen={setOpen}
          handleClickOpen={handleClickOpen}
          userid={userid}
        />
      </div>
    </Dashboard>
  );
};

export default UserList;
