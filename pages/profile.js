import React, {Suspense} from 'react';
import Fallback from "./loading";

const MyProfile = React.lazy(() => import('../components/common/MyProfile/MyProfile'));
const Footer = React.lazy(() => import('../components/Layout/Footer/Footer'));
const Navbar = React.lazy(() => import('../components/Layout/Navbar/Navbar'));


const profile = () => {
  return (
        <Suspense fallback={<Fallback />}>
            <Navbar />
            <MyProfile />
            <Footer />
        </Suspense>
  );
};

export default profile;
