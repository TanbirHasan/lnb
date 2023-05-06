import { useRouter } from 'next/router';
import React, {Suspense} from 'react';
const Companyprofile = React.lazy(() => import('../../components/common/Companyprofile/Companyprofile'));

import Fallback from "../loading";


const Slug = () => {
  const router = useRouter();
  const companynumber = router.query.slug;

  return (
    <div>
      <Suspense fallback={<Fallback />}>
        <Companyprofile />
      </Suspense>

  
    </div>
  );
};

export default Slug;
