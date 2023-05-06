import React, { Suspense } from "react";
import Fallback from "../loading";

const Overview = React.lazy(() =>
  import("../../components/componentsDashboard/Overview/Overview")
);

const overview = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Overview />
    </Suspense>
  );
};

export default overview;
