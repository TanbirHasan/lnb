import Fallback from "./loading";
import React, {Suspense} from "react";
import Head from "next/head";

const AboutUsComponent = React.lazy(() => import('../components/AboutUs'));

const About = () => {
    return (
        <>
            <Head>
                <title>About Us -Find New Businesses Opening Near You | LNB</title>
                <meta name="description" content="Learn more about how our platform can help you discover new businesses opening near you. Sign up today for our business lead generation services!" />
                <meta property="og:locale" content="en_US"/>
                <meta property="og:type" content="website"/>
                <meta property="og:title" content="Contact -CheckLatest Webcheck Companies House Data | LNB"/>
                <meta property="og:description" content="Access the latest Webcheck Companies House data and take advantage of our business lead generation services. Contact us now!"/>
                <meta property="og:url" content="https://localnewbusiness.com"/>
                <meta property="og:site_name" content="local new business"/>
            </Head>
            <Suspense fallback={<Fallback />}>
            <AboutUsComponent/>
             </Suspense>
        </>
    );
};
export default About;