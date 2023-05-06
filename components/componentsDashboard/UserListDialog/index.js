import * as React from "react";
import Dialog from "@mui/material/Dialog";
import apiClient from "../../../library/apis/api-client";

export default function UserListDialog({
  open,
  setOpen,
  handleClickOpen,
  userid,
}) {
  const [apiLoading, setApiLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const getUser = async () => {
    try {
      setApiLoading(true);
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userid}`
      );

      if (res.status === 200) {
        console.log(res?.data.data);
        setData(res?.data.data);
      }
    } catch (e) {
      //console.log(e);
      setApiLoading(false);
    }
  };

  React.useEffect(() => {
    getUser();
  }, [userid]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="w-auto">
          <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row border-2 boder-solid m-3 p-4">
            <div className="bg-slate-300 rounded p-5 m-1 flex-1">
              <h3>
                <strong>First Name : </strong>
                {data?.firstname}
              </h3>
            </div>
            <div className="bg-slate-300 rounded p-5 m-1 flex-1">
              <h3>
                <strong>Last Name : </strong>
                {data?.lastname}
              </h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row  border-2 boder-solid m-3 p-4">
            <div className="bg-slate-300 rounded p-5 m-1 flex-1">
              <h3>
                <strong>User Name : </strong>
                {data?.username}
              </h3>
            </div>
            <div className="bg-slate-300 rounded p-5 m-1 flex-1">
              <h3>
                <strong>Email : </strong>
                {data?.email}
              </h3>
            </div>
          </div>
          <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row  border-2 boder-solid m-3 p-4">
            <div className="bg-slate-300 rounded p-5 m-1 flex-1">
              <h3>
                <strong>Company Website : </strong>
                {data?.companyWebsite}
              </h3>
            </div>
            <div className="bg-slate-300 rounded p-5 m-1 flex-1">
              <h3>
                <strong>Company Type : </strong>
                {data?.companyType}
              </h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row  border-2 boder-solid m-3 p-4">
            <div className="bg-slate-300 rounded p-5 m-1 flex-1">
              <h3>
                <strong>Phone Number : </strong>
                {data?.phoneNumber}
              </h3>
            </div>
            <div className="bg-slate-300 rounded p-5 m-1 flex-1">
              <h3>
                <strong>Address : </strong>
                {data?.Address}
              </h3>
            </div>
          </div>
          <div className="text-end">
            <button
              onClick={handleClose}
              className="bg-teal-600 text-white px-3 py-1 rounded m-2"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
