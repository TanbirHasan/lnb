const SigninComponent = React.lazy(() => import('../../components/auth/signin'));

import Fallback from "../loading";
import React, {Suspense} from "react";

const Login = () => {
  return (
    <div>
        <Suspense fallback={<Fallback />}>
            <SigninComponent />
        </Suspense>


    </div>
  );
};

export default Login;
