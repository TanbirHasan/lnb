import React, {Suspense, useEffect} from "react";

const CompanyList = React.lazy(() => import('../../components/Search/CompanyList/CompanyList'));
const Home = React.lazy(() => import('../home'));
import Fallback from "../loading";

const CompanylistPage = () => {
 

  return (
      <Suspense fallback={<Fallback />}>
          <Home>
              <div>
                  <CompanyList />
              </div>
          </Home>
      </Suspense>

  );
};

export default CompanylistPage;
