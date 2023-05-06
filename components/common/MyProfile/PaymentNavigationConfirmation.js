import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { serviceResquestResponseRecoilState } from "../../../store/atoms/serviceRequestResponseRecoil";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PaymentNavigationConfirmationModal(props) {
  const { open, setOpen } = props;
  const [serviceRequest, setServiceRequest] = useRecoilState(
    serviceResquestResponseRecoilState
  );
  const router = useRouter();

  const handleClose = () => {
    setServiceRequest({});
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
        <DialogContent>
          <div className="flex justify-end my-5">
            <div className="p-2 bg-red-500 animate-pulse transition duration-200 text-white font-semibold text-sm rounded-md uppercase">
              Pending
            </div>
          </div>
          <div>
            <p className="font-semibold text-center">
              The payment for this service is pending, Would you like to proceed
              to the payment page and complete your purchase ?
            </p>
          </div>
        </DialogContent>

        <DialogActions className="">
          <Button
            className="btn hover:bg-red-400 bg-red-600 text-white m-2"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="btn animate-bounce hover:bg-blue-400 hover:animate-none bg-blue-500 text-white m-2"
            onClick={() => {
              router.push("/stepperpages/step4");
              setOpen(false);
            }}
          >
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PaymentNavigationConfirmationModal;
