import React, {Suspense} from "react";
const Registration = React.lazy(() => import('../../components/auth/registration'));
import Fallback from "../loading";

const registration = () => {
  return (
    <div>
        <Suspense fallback={<Fallback />}>
            <Registration />
        </Suspense>

    </div>
  );
};

export default registration;
