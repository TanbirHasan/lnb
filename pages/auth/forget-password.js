import React, {Suspense} from "react";
import Fallback from "../loading";
const ForgotPasswordComponent = React.lazy(() => import('../../components/auth/forgotPassword'));


const forgetPassword = () => {
  return (
    <div>
        <Suspense fallback={<Fallback />}>
            <ForgotPasswordComponent />
        </Suspense>

    </div>
  );
};

export default forgetPassword;
