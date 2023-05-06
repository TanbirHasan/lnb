import React, {Suspense} from "react";
import Fallback from "../../loading";
const ResetPassword = React.lazy(() => import('../../../components/auth/resetPassword'));


const resetPassword = () => {
  return (
    <div>
        <Suspense fallback={<Fallback />}>
            <ResetPassword />
        </Suspense>

    </div>
  );
};

export default resetPassword;
