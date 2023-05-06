import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Close, KeyboardArrowRight } from "@mui/icons-material";

import { useSnackbar } from "notistack";

import LoadingButton from "@mui/lab/LoadingButton";
import { ConvertToContString } from "../../../../library/utils/contString";
import apiClient from "../../../../library/apis/api-client";
import ErrorMessageModal from "../ErrorMessageModal";

const UplaodModal = (props) => {
  const { open, setOpen, setLetterUploaded } = props;
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [file, setFile] = useState();
  const [templateName, setTemplateName] = useState();
  const [showError, setShowError] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setTemplateName(null);
    setShowError(false);
  };

  const handleOpen = (message) => {
    setErrorMessage(message);
    setOpen(false);
    setErrorOpen(true);
  };

  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // handleFiles(e.dataTransfer.files);
      setFile(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // handleFiles(e.target.files);
      setFile(e.target.files[0]);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };
  const handleSubmit = async (e) => {
    setShowError(true);
    setApiLoading(true);
    e.preventDefault();
    if (!!file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", templateName);
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      try {
        await apiClient
          .post(`/users/letter-pdf-upload`, formData, config)
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              enqueueSnackbar("Template uploaded successfully", {
                variant: "success",
              });
              setLetterUploaded(true);
            }
          });
        setApiLoading(false);
      } catch (e) {
        // enqueueSnackbar(e.message, {
        //   variant: "error",
        //   anchorOrigin : {
        //     vertical : 'center',
        //     horizontal : 'bottom'
        //    },

        // });
        handleOpen(e.message);
      }

      setOpen(false);
      setFile(null);
      setTemplateName(null);
      setShowError(false);
    } else {
      enqueueSnackbar("Select a template to continue", { variant: "error" });
    }
    setApiLoading(false);
  };

  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth={true}
        open={open}
        onClose={() => {
          setOpen(false);
          setFile(null);
          setTemplateName(null);
          setShowError(false);
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <div className="flex justify-between items-center px-5 mt-3">
            Upload Template
            <IconButton aria-label="close" onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="p-5">
            <form id="form-file-upload" onDragEnter={handleDrag}>
              <div className="my-5">
                <TextField
                  id="outlined-basic"
                  label="Template Name"
                  variant="outlined"
                  placeholder="Template Name"
                  required
                  fullWidth
                  onChange={(e) => setTemplateName(e.target.value)}
                  helperText={
                    !templateName && !!showError ? "Enter Template Name" : ""
                  }
                  error={!templateName}
                />
              </div>
              <div className="h-40">
                <input
                  ref={inputRef}
                  type="file"
                  id="input-file-upload"
                  multiple={true}
                  onChange={handleChange}
                  accept={"application/pdf"}
                />
                <label
                  id="label-file-upload"
                  htmlFor="input-file-upload"
                  className={dragActive ? "drag-active" : ""}
                >
                  <div>
                    {!!file && (
                      <div className="text-[18px] font-semibold">
                        {ConvertToContString(file?.name, 40)}
                      </div>
                    )}
                    {!file && (
                      <div>
                        <div className="text-[18px] font-semibold">
                          Drag and drop your Template
                        </div>
                        <div className="text-[14px]">
                          Only A4 size PDF is accepted
                        </div>
                      </div>
                    )}
                    {!!file && (
                      <button
                        type="button"
                        className="bg-primary text-white px-4 py-2  my-3 hover:bg-primaryHover font-semibold rounded-md"
                        onClick={onButtonClick}
                      >
                        Replace
                      </button>
                    )}
                    {!file && (
                      <button
                        type="button"
                        className="bg-primary text-white px-4 py-2  my-3 hover:bg-primaryHover font-semibold rounded-md"
                        onClick={onButtonClick}
                      >
                        Select
                      </button>
                    )}
                  </div>
                </label>
                {dragActive && (
                  <div
                    id="drag-file-element"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  ></div>
                )}
                {!file && !!showError && (
                  <div className="text-red-600 flex justify-start self-start my-2 text-[14px]">
                    Select Template to continue
                  </div>
                )}
              </div>
              <div className="w-full flex justify-end items-end">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  className="text-white font-semibold hover:bg-primaryHover mt-5 bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 rounded text-sm px-5 py-2.5 text-center inline-flex items-center"
                >
                  <span className="mr-2">Upload</span>
                  {apiLoading && (
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline mr-3 w-4 h-4 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      ></path>
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>

              {/*<div className="w-full flex justify-end items-end">*/}
              {/*  <button*/}
              {/*    type="submit"*/}
              {/*    className=" bg-primary px-4 py-2 rounded-sm text-white font-semibold hover:bg-primaryHover mt-5"*/}
              {/*  >*/}
              {/*    Upload Template*/}
              {/*  </button>*/}
              {/*</div>*/}
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <ErrorMessageModal
        open={errorOpen}
        setOpen={setErrorOpen}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default UplaodModal;
