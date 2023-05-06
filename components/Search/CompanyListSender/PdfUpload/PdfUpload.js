import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import apiClient from "../../../../library/apis/api-client";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConvertToContString } from "../../../../library/utils/contString";
import { useSnackbar } from "notistack";
import UploadModal from "./UploadModal";
import { Document, Page, pdfjs } from "react-pdf";

import { useRecoilState } from "recoil";

import { formStateRecoil } from "../../../../store/atoms/formStateRecoil";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfUpload = ({ selectedletter, setSelectedLetter }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [apiLoading, setApiLoading] = React.useState(false);
  const [letter, setletter] = React.useState([]);
  const [templateString, setTemplateString] = useRecoilState(formStateRecoil);
  const [pdfurl, setPdfUrl] = React.useState();
  const [letterUploaded, setLetterUploaded] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = () => {
    setSelectedLetter(null)
    setOpen(true);
  };

  React.useEffect(() => {
    getletterlist().then((r) => r);
    setLetterUploaded(false);
  }, [letterUploaded]);

  const getletterlist = async () => {
    try {
      setApiLoading(true);
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/fetch/letter-list?limit=500`
      );
      if (res.status === 200) {
        setletter(res?.data.letterData);

        setApiLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLetterClick = (data) => {
    setIsLoading(true);
    generateS3PdfLink(data.letter_key);
    setSelectedLetter(data);
    setTemplateString((prev) => ({
      ...prev,
      letterKey: data.letter_key,
    }));
  };

  const generateS3PdfLink = (key) => {
    const url = `https://lnb-data.s3.eu-west-2.amazonaws.com/pdf/${key}`;

    setPdfUrl(url);
  };

  const handleDeletePdf = async (data,event) => {
    event.stopPropagation()
    try {
      const res = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/delete-letter`,
        { key: data.letter_key, letterId: data._id }
      );
      if (res.status === 200) {
        enqueueSnackbar("Deleted Successfully", { variant: "success" });
        getletterlist();
        setSelectedLetter(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="col-span-1 md:col-span-2 shadow-lg py-5 px-2">
          {!letter && (
            <Box className="flex justify-center my-5">
              <h3>No Letter</h3>
            </Box>
          )}
          {!!letter && (
            <div>
              <div className="flex flex-col lg:flex-col xl:flex-row justify-between items-center mb-2 text-xl text-grey pr-1">
                <span>Templates</span>
                <div>
                  <button
                    className="min-w-[100px] py-1 text-[16px] bg-[#D16F32] text-white cursor-pointer rounded-sm"
                    type="button"
                    onClick={handleOpen}
                  >
                    Upload
                  </button>
                </div>
              </div>
              {!apiLoading ? (
                <div className="h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
                  {letter.map((letter, index) => {
                    const isSelected = selectedletter?._id === letter._id;
                    const borderClass = isSelected
                      ? "border-2 border-[#D16F32]"
                      : "border-2 border-gray-300";
                    return (
                      <div
                        key={letter._id}
                        className={`p-3 rounded-md my-2 cursor-pointer flex items-center justify-between mr-1 ${borderClass}`}
                        onClick={() => handleLetterClick(letter)}
                      >
                        <div className="flex items-center gap-1">
                          <div>{index + 1}.</div>
                          <Tooltip title={letter.letter_title}>
                            <div className="text-[15px]">
                              {ConvertToContString(letter.letter_title, 30)}
                            </div>
                          </Tooltip>
                        </div>

                        <IconButton
                          aria-label="delete"
                          size="small"
                          color="error"
                          onClick={(event) => handleDeletePdf(letter,event)}
                         
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center w-full mt-10">
                  <CircularProgress />
                </div>
              )}
            </div>
          )}
          <div></div>
        </div>
        <div className="col-span-1 md:col-span-4 flex-col justify-start">
          <div className="  min-h-[78vh]">
            {selectedletter ? (
              <div className="mt-3">
                <div
                  style={{
                    overflowY: "scroll",
                    overflowX: "auto",
                  }}
                  className="shadow-lg max-h-[78vh]"
                >
                  {isLoading && (
                    <div className="flex justify-center w-full items-center h-screen">
                      <CircularProgress />
                    </div>
                  )}

                  <Document
                    file={{
                      url: pdfurl,
                    }}
                    loading={
                      <div className="flex justify-center my-10">
                        <CircularProgress />
                      </div>
                    }
                    className="p-5"
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        wrap
                        loading={
                          <div className="flex justify-center my-10">

                          </div>
                        }
                        size={"A4"}
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        renderTextLayer={false}
                      />
                    ))}
                  </Document>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center mt-5 ml-5">
                <span className="">No Letter Selected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <UploadModal
        open={open}
        setOpen={setOpen}
        setLetterUploaded={setLetterUploaded}
      />
    </div>
  );
};

export default PdfUpload;
