import React, {Suspense, useEffect} from "react";

const Tdesign = React.lazy(() => import('../../components/Search/TemplateDesign/Tdesign'));
const Home = React.lazy(() => import('../home'));

import Fallback from "../loading";

const Templatedesign = () => {
  useEffect(() => {
    window.scrollTo({ top: 800, behavior: "instant" });
  }, []);
  return (
      <Suspense fallback={<Fallback />}>
          <Home>
              <div>
                  <Tdesign />
              </div>
          </Home>
      </Suspense>

  );
};

export default Templatedesign;
