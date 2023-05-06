import React, { Suspense } from "react";
const Result = React.lazy(() => import('../components/Search/TotalCompnay/TotalCompany'));

import Fallback from "./loading";

const result = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Result />
    </Suspense>
  );
};

export default result;
