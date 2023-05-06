// import StepOne from "../components/AboutUs";
import { useRouter } from "next/router";
import React, { Suspense, useEffect } from "react";
import { useRecoilValue } from "recoil";
const CompanyList = React.lazy(() => import('../../components/Search/CompanyList/CompanyList'));

import { apiClientRecoil } from "../../store/atoms/apiClientRecoil";
import Fallback from "../loading";

const StepOne = () => {
  const router = useRouter();
  const apiClientState = useRecoilValue(apiClientRecoil);
  useEffect(() => {
    if (
      apiClientState.previousRoute !== "/" &&
      apiClientState.previousRoute !== "step-two"
    ) {
      router.push("/");
    } else {
      router.push("/");
    }
  }, [apiClientState.previousRoute, router]);
  return (
    <div>
      <Suspense fallback={<Fallback />}>
        <CompanyList data={apiClientState.data} />
      </Suspense>
    </div>
  );
};

export default StepOne;
