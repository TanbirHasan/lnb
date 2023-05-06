import React, { Suspense, useEffect } from "react";

const PrintandPost = React.lazy(() =>
  import("../../components/Search/PrintandPost/PrintandPost")
);
const Home = React.lazy(() => import("../home"));

import Fallback from "../loading";

const Selectoptionpage = () => {
 

  return (
    <Suspense fallback={<Fallback />}>
      <Home>
        <div>
          <PrintandPost />
        </div>
      </Home>
    </Suspense>
  );
};

export default Selectoptionpage;
