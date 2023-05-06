import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function ViewTemplateModal(props) {
  const { open, setOpen, letterPdfUrl } = props;
  const [loading, setLoading] = React.useState(false);
  const url = `https://lnb-data.s3.eu-west-2.amazonaws.com/pdf/${letterPdfUrl}`;

  const handleClose = () => {
    setOpen(false);
  };

  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        maxWidth="md"
        fullWidth={true}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {!loading && (
          <DialogContent>
            <div className="flex justify-between my-5">
              <div className="text-xl font-semibold">Template</div>
            </div>
            {url && (
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
                        url: url,
                      }}
                      loading={
                        <div className="flex justify-center my-10">
                          <CircularProgress />
                        </div>
                      }
                      className="pdf-document"
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
              </div>
            )}
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
