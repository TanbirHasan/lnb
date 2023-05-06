import React, {Suspense} from "react";
import Fallback from "./loading";
import Head from "next/head";

const ContactUs = React.lazy(() => import('../components/ContactUs/ContactForm/ContactForm'));
const ContactForm = React.lazy(() => import('../components/ContactUs/ContactUs/ContactUs'));
const Footer = React.lazy(() => import('../components/Layout/Footer/Footer'));
const Navbar = React.lazy(() => import('../components/Layout/Navbar/Navbar'));

const Contact = () => {
  const colour = "transparent";

  return (
    <div>
      <Head>
        <title>Contact -CheckLatest Webcheck Companies House Data | LNB</title>
        <meta name="description" content="Access the latest Webcheck Companies House data and take advantage of our business lead generation services. Contact us now!" />
        <meta property="og:locale" content="en_US"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Contact -CheckLatest Webcheck Companies House Data | LNB"/>
        <meta property="og:description" content="Access the latest Webcheck Companies House data and take advantage of our business lead generation services. Contact us now!"/>
        <meta property="og:url" content="https://localnewbusiness.com"/>
        <meta property="og:site_name" content="local new business"/>
    
      </Head>
      <Suspense fallback={<Fallback />}>
        <div className="contact h-screen">
          <Navbar colour={colour} />
          <ContactUs />
        </div>
        <ContactForm />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Contact;
