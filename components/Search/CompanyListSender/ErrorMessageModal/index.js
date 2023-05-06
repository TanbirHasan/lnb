import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import React from "react";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export default function ErrorMessageModal({ open, setOpen, errorMessage }) {
  //console.log("Status of error modal", open);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth={true}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="w-full h-10 bg-red-600 p-2 flex items-center gap-2">
          <ReportProblemIcon className="text-white"/>
          <h3 className="text-xl text-white">Error</h3>
        </div>

        <DialogTitle id="responsive-dialog-title">
          <div className="flex justify-between items-center px-5 mt-3 ">
            <h2 className="text-xl font-semibold">
              {errorMessage}
            </h2>
            <IconButton aria-label="close" onClick={handleClose} className="bg-red-600 text-white hover:text-white hover:bg-red-600">
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>
    </div>
  );
}
