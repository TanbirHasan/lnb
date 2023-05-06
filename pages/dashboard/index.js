import React, { Suspense } from "react";
const DashboardComponent = React.lazy(() => import('../../components/Dashboard/Dashboard'));

import Fallback from "../loading";
const dashboard = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <DashboardComponent>Dashboard</DashboardComponent>
    </Suspense>
  );
};
export default dashboard;
