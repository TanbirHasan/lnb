import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from "@mui/material";

const ConfirmDiscard = (props) => {
  const { title, open, setOpen, setConfirm, companyId } = props;
  const handleClose = () => {
    setOpen(false);
  };
  const onDeleteConfirm = (companyId) => {
    console.log("On Delete");
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="rounded-8"
      >
        <div className="p-16">
          <DialogTitle id="alert-dialog-title" className="modeal-header">
            Confirm
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className="modeal-text"
            >
              Cant undo
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="text"
              className="text-main font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className="rounded-4 font-medium"
              onClick={() => onDeleteConfirm()}
            >
              Confirm
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default ConfirmDiscard;
