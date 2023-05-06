import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useState } from "react";
import { useSnackbar } from "notistack";
import apiClient from "../../../library/apis/api-client";

const EditLabelDataModal = ({ open, setOpen, labeldata }) => {
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiClient
        .post(`/history/set-service-label`, {
          label: data.label,
          service_req_id: labeldata.id,
        })
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar("Label Added Successfully", {
              variant: "success",
            });
            setOpen(false);
            reset();
          }
        });
      setLoading(false);
    } catch (e) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
      setLoading(false);
    }
  };
  const handleClose = () => {
    reset();
    setOpen(false);
  };
  return (
    <div className="w-[400px]">
      <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
        <div className="form-wrapper" style={{ position: "relative" }}>
          <IconButton
            className="close-button"
            onClick={handleClose}
            style={{ position: "absolute", top: 0, right: 0 }}
          >
            <HighlightOffIcon />
          </IconButton>
          {!loading && (
            <form onSubmit={handleSubmit(onSubmit)} >
              <div className="py-10 px-10">
                <TextField
                  label="Label"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...register("label", { required: true })}
                  error={!!errors.label}
                  helperText={errors.label ? "Label is required" : ""}
                 
                  autoFocus={true}
                  autoComplete="off"
                />
                 <button
                type="submit"
                className="min-w-[100px] py-2 text-[16px] bg-[#D16F32] text-white cursor-pointer rounded-sm"
              >
                Submit
              </button>
              </div>

             
            </form>
          )}
          {!!loading && (
            <div className="flex justify-center my-10">
              <CircularProgress />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default EditLabelDataModal;
