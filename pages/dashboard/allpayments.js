import React, { Suspense } from "react";
const AllPayments = React.lazy(() => import('../../components/componentsDashboard/AllPayments'));

import Fallback from "../loading";

const allpayments = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <AllPayments />
    </Suspense>
  );
};

export default allpayments;
