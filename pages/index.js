import React, {Suspense} from "react";
import Fallback from "./loading";
import Head from "next/head";


const Home = React.lazy(() => import("./home"));

const index = () => {
  return (
    <>
      <Head>
        <meta charset="UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"/>
        <link rel="alternate" href="https://localnewbusiness.com/" hreflang="x-default"/>
        <link rel="alternate" href="https://localnewbusiness.com/" hreflang="en-us"/>
        <meta name="robots" content="index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/>
        <link rel="canonical" href="https://localnewbusiness.com"/>

        <meta name="geo.placename" content="Leicestershire"/>
        <meta name="geo.position" content="52.63876,-1.14123"/>
        <meta name="geo.region" content="United Kingdom"/>
        <meta name="keywords" content="Business Lead Generation Services, WebCheck Companies House , New Businesses Opening Near You"/>
        <link rel="dns-prefetch" href="//maps.googleapis.com"/>
        <link rel="dns-prefetch" href="//www.googletagmanager.com"/>
        <link rel="dns-prefetch" href="//fonts.googleapis.com"/>

        <link rel="icon" href="/favicon.ico" sizes="32x32"/>
        {/* <link rel="icon" href="favicon.io" sizes="192x192"/> */}
        <link rel="apple-touch-icon" href=""/>

        <meta name="msapplication-TileImage" content=" "/>

        <title>Local New Business | Get Business Leads from New Business Openings Near You </title>
        <meta name="description" content="Looking for new business opportunities? Easily WebCheck Companies House and discover and reach out to new businesses opening near you."/>
        <meta property="og:locale" content="en_US"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Local New Business | Get Business Leads from New Business Openings Near You "/>
        <meta property="og:description" content="Looking for new business opportunities? Easily WebCheck Companies House and discover and reach out to new businesses opening near you."/>
        <meta property="og:url" content="https://localnewbusiness.com"/>
        <meta property="og:site_name" content="local new business"/>
      
      </Head>
      <Suspense fallback={<Fallback />}>
        <Home />
      </Suspense>
    </>
  );
};

export default index;
