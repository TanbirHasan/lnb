import React, {Suspense} from "react";
import Fallback from "./loading";

const Tdesign = React.lazy(() => import('../components/Search/TemplateDesign/Tdesign'));

const template = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Tdesign />
    </Suspense>
  );
};

export default template;
