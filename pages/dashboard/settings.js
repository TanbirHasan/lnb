import React, { Suspense } from "react";
const Settings  = React.lazy(() => import('../../components/componentsDashboard/Settings'));

import Fallback from "../loading";

const settings = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Settings />
    </Suspense>
  );
};

export default settings;
