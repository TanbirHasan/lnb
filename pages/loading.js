import {Backdrop} from "@mui/material";
import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

const Fallback = () => {
  return (
    <Backdrop open={true} sx={{ background:'#fff', color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress sx={{color:'#fd5c5c'}} />
    </Backdrop>
  );
};

export default Fallback
