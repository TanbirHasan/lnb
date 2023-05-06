import ClearIcon from "@mui/icons-material/Clear";
import { Dialog, Divider } from "@mui/material";
import React from "react";
import { updatePrice, updateStripeKeys } from "../SettingsApiCall";

const UpdateKeyDialog = ({
  open,
  setOpen,
  handleClickOpen,
  stripedata,
  setData,
  type,
  setActiveKey,
  setActivePrice,
  active,
  title,
}) => {
  const handleClose = () => {
    setOpen(false);
   // setActiveKey((prev) => setActiveKey(!prev));
   // setActivePrice((prev) => setActivePrice(!prev));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      type === "DOWNLOAD_SERVICE" ||
      type === "EMAIL_SERVICE" ||
      type === "MAIL_PRINT_SERVICE"
    ) {
      updatePrice(type, stripedata);
      setActivePrice((prev) => setActivePrice(!prev));
    } else {
      updateStripeKeys(type, stripedata);
      setActiveKey((prev) => setActiveKey(!prev));
    }

    setData("");
  };

  return (
    <div className="rounded">
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="w-auto">
          <div className="flex justify-between px-5 py-3">
            <h2 className="font-medium">{title}</h2>
            <span
              onClick={handleClose}
              className="cursor-pointer text-[#D16F32]"
            >
              <ClearIcon />
            </span>
          </div>
          <Divider />
          <div className="p-5">
            <form onSubmit={handleSubmit} className="text-end">
              <input
                className="w-full border-2 boder-solid p-2 rounded-xl"
                value={stripedata}
                onChange={(e) => setData(e.target.value)}
                required
              />

              <button
                className="text-white rounded-xl p-1 w-1/4 mt-5 bg-[#D16F32]"
                type="submit"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UpdateKeyDialog;
