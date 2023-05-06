import React, {Suspense} from "react";
const TotalCompany = React.lazy(() => import('../../components/Search/TotalCompnay/TotalCompany'));
const Home = React.lazy(() => import('../home'));

import Fallback from "../loading";

const Totalcompany = () => {
  return (
      <Suspense fallback={<Fallback />}>
          <Home>
              <div>
                  <TotalCompany />
              </div>
          </Home>
      </Suspense>

  );
};

export default Totalcompany;
