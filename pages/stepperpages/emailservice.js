import React, {Suspense, useEffect} from "react";
const Emailsender = React.lazy(() => import('../../components/Search/Emailsender/Email'));
const Home = React.lazy(() => import('../home'));
import Fallback from "../loading";

const EmailService = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return (
      <Suspense fallback={<Fallback />}>
          <Home>
              <div>
                  <Emailsender />
              </div>
          </Home>
      </Suspense>

  );
};

export default EmailService;
