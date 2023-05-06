import * as React from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import apiClient from "../../../library/apis/api-client";
import ReactHtmlParser from "react-html-parser";
import CircularProgress from "@mui/material/CircularProgress";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const { open, setOpen, letterId } = props;
  const [letterData, setLetterData] = React.useState();
  const [loading, setLoading] = React.useState();

  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const getLetterData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/postGrid/getLetterStatus/${letterId}`
      );
      if (res.status === 200) {
        setLetterData(res?.data?.data);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  useEffect(() => {
    getLetterData().then((r) => r);
  }, [letterId]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth={true}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {!loading && (
          <DialogContent>
            <div className="flex justify-between my-5">
              <div className="text-xl font-semibold">Letter Details</div>
              <div className="p-2 bg-teal-500 text-white font-semibold text-sm rounded-md uppercase">
                {letterData?.status}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-y-5">
              <div className="col-span-2">
                <div className="border-2 border-gray-100 rounded-md min-h-[200px]">
                  <div className="p-3 flex gap-3">
                    <SendRoundedIcon className="text-teal-500 -rotate-45" />
                    <div className="text-xl font-medium">Sender</div>
                  </div>
                  <hr />
                  <div className="p-3">
                    <div className="text-lg font-medium">{`${
                      letterData?.from?.firstName || ""
                    }  ${letterData?.from?.lastName || ""}`}</div>
                    <div className="text-lg text-gray-600">
                      {`${letterData?.from?.addressLine1 || ""}, ${
                        letterData?.from?.city || ""
                      },
                                                 \n${
                                                   letterData?.from?.country ||
                                                   ""
                                                 } ${
                        letterData?.from?.postalOrZip || ""
                      }`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-2">
                <div className="border-2 border-gray-100 rounded-md min-h-[200px]">
                  <div className="p-3 flex gap-3">
                    <ReceiptOutlinedIcon className="text-teal-500" />
                    <div className="text-xl font-medium">Recipient</div>
                  </div>
                  <hr />
                  <div className="p-3">
                    <div className="text-lg font-medium">{`${
                      letterData?.to?.companyName || ""
                    }`}</div>
                    <div className="text-lg text-gray-600">
                      {`${letterData?.to?.addressLine1 || ""}, ${
                        letterData?.to?.city || ""
                      },
                                                 \n${
                                                   letterData?.to?.country || ""
                                                 } ${
                        letterData?.to?.postalOrZip || ""
                      }`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Accordion
              className="mt-7 border-2 border-gray-100 overflow-x-scroll"
              style={{ boxShadow: "none" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div className="text-lg text-gray-500 font-semibold">
                  Letter Body
                </div>
              </AccordionSummary>
              {!!letterData && (
                <AccordionDetails>
                  {!!letterData?.uploadedPDF && (
                    <div>
                      <div className="">
                        <div
                          style={{
                            height: "70vh",
                            width: "100%",
                            overflowY: "auto",
                            overflowX: "auto",
                          }}
                        >
                          <Document
                            file={{
                              url: letterData?.uploadedPDF,
                            }}
                            loading={
                              <div className="flex justify-center my-10">
                                <CircularProgress />
                              </div>
                            }
                            onLoadSuccess={onDocumentLoadSuccess}
                          >
                            {Array.from(new Array(numPages), (el, index) => (
                              <Page
                                wrap
                                size={"A4"}
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                renderTextLayer={false}
                                loading={
                                  <div className="flex justify-center my-10">

                                  </div>
                                }
                              />
                            ))}
                          </Document>
                        </div>
                      </div>
                      <p>
                        Page {pageNumber} of {numPages}
                      </p>
                    </div>
                  )}
                  {!letterData?.uploadedPDF && (
                    <div className="w-[900px]">
                      {ReactHtmlParser(letterData?.html)}
                    </div>
                  )}
                </AccordionDetails>
              )}
            </Accordion>
          </DialogContent>
        )}
        {!!loading && (
          <div className="flex justify-center my-10">
            <CircularProgress />
          </div>
        )}
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "white" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
