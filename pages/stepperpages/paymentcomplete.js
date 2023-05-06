import React, {Suspense} from "react";
const PaymentComplete = React.lazy(() => import('../../components/Search/PaymentComplete/PaymentComplete'));
const Home = React.lazy(() => import('../home'));

import Fallback from "../loading";

const Paymentcomplete = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Home>
        <div>
          <PaymentComplete />
        </div>
      </Home>
    </Suspense>
  );
};

export default Paymentcomplete;
