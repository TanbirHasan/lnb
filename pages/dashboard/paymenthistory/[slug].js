import { useRouter } from 'next/router';
import React, {Suspense} from 'react';
const PaymentHistory = React.lazy(() => import('../../../components/componentsDashboard/PaymentHistory'));

import Fallback from "../../loading";
const slug = () => {
  return (
      <Suspense fallback={<Fallback />}>
          <PaymentHistory/>
      </Suspense>
  );
};
export default slug;