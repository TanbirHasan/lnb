const VerifyEmailComponent = React.lazy(() => import('../../components/common/VerifyEmail'));
const Navbar = React.lazy(() => import('../../components/Layout/Navbar/Navbar'));
import React, {Suspense} from "react";
import Fallback from "../loading";

const VerifyEmail = () => {
  return (
    <div>
      <Suspense fallback={<Fallback />}>
        <Navbar />
        <VerifyEmailComponent />
      </Suspense>
    </div>
  );
};
export default VerifyEmail;
