import React, { Suspense, useEffect } from "react";

const CListSenderTemplate = React.lazy(() => import('../../components/Search/CListSenderTemplate/CListSenderTemplate'));
const Home = React.lazy(() => import('../home'));

import Fallback from "../loading";

const Previewtemplate = () => {
  useEffect(() => {
    window.scrollTo({ top: 800, behavior: "instant" });
  }, []);
  return (
    <Suspense fallback={<Fallback />}>
      <Home>
        <div>
          <CListSenderTemplate />
        </div>
      </Home>
    </Suspense>
  );
};

export default Previewtemplate;
