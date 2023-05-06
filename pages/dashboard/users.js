import React, { Suspense } from "react";
const UserList = React.lazy(() => import('../../components/componentsDashboard/UserList'));

import Fallback from "../loading";

const users = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <UserList />
    </Suspense>
  );
};

export default users;
