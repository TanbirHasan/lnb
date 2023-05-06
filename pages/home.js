import React, { useEffect, useState } from "react";

import AboutUsSecond from "../components/common/AboutUsSecond/AboutUsSecond";


import DashboardSlider from "../components/Home/DashboardSlider/DashboardSlider";
import FindCompanies from "../components/Home/FindCompanies/FindCompanies";
import Footer from "../components/Layout/Footer/Footer";
import HomeAboutUs from "../components/Home/HomeAboutUs/HomeAboutUs";
import HowitWorks from "../components/Home/HowitWorks/HowitWorks";

import Banner from "../components/Home/Banner/Banner";

import Navbar from "../components/Layout/Navbar/Navbar";
import StaticPrintPost from "../components/AboutUs/staticPrintPost";
import Stepper from "../components/common/Stepper/Stepper";

import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";

import Head from "next/head";
import { formStateRecoil } from "../store/atoms/formStateRecoil";



const Home = ({ children }) => {
  const [isShown, setIsShown] = useState(false);
  const [data, setData] = useState();
  const [showNavHidden, setNavVisibility] = useState(true);

   

  

  const [templateString, setTemplateString] = useRecoilState(formStateRecoil);
  const route = useRouter();

  useEffect(() => {
    const totaldata = JSON.parse(localStorage.getItem("inputdata"));
    setData(totaldata);

    if (route.pathname === "/") {
      localStorage.removeItem("formStateRecoil");
      setTemplateString((prev) => ({
        ...prev,
        step_three: "",
        emailSubject: "",
      }));
    }
  }, []);

  // function for showing result component or home page componenst based on condition

  useEffect(() => {
    if (route.pathname === "/" || route.pathname === "/home") {
      setIsShown(true);
      localStorage.removeItem("inputdata");
    } else {
      setIsShown(false);
      if(route.pathname === "/stepperpages/step1"){
        window.scroll({
          top: 800,
          behavior: 'smooth'
        });
      }
   
    }
    if (
      route.pathname === "/stepperpages/step4" ||
      route.pathname === "/stepperpages/paymentcomplete" ||
      route.pathname == "/stepperpages/step3" ||
      route.pathname == "/stepperpages/emailservice" ||
      route.pathname == "/stepperpages/companylistsender" ||
      route.pathname == "/stepperpages/previewtemplate"
    ) {
      setNavVisibility(false);
    } else {
      setNavVisibility(true);
    }
  }, [route]);

  useEffect(() => {}, [showNavHidden]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>
          Local New Business | Get Business Leads from New Business Openings
          Near You{" "}
        </title>
        <meta
          name="description"
          content="Looking for new business opportunities? Easily WebCheck Companies House and discover and reach out to new businesses opening near you."
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Local New Business | Get Business Leads from New Business Openings Near You "
        />
        <meta
          property="og:description"
          content="Looking for new business opportunities? Easily WebCheck Companies House and discover and reach out to new businesses opening near you."
        />
        <meta property="og:url" content="https://localnewbusiness.com" />
        <meta property="og:site_name" content="local new business" />
      </Head>

      <Navbar />

      {showNavHidden && <Banner inputdata={data} />}

      {isShown ? (
        <>
          <FindCompanies />
          <StaticPrintPost />
          <DashboardSlider />
          <HowitWorks />
          <HomeAboutUs />
          <AboutUsSecond />
          {/* <Conversation /> */}
        </>
      ) : (
        <>
          <Stepper>{children}</Stepper>
        </>
      )}
     
      <Footer />
     

     
    </div>
  );
};

// Home.getInitialProps = (context) => {
//   const isVerified = context?.res?.getHeader('X-ISVERFIED');

//   context.res.removeHeader('X-ISVERFIED');
//   return { isVerified };
// };

// export async function getServerSideProps(context) {
//   let cookies = context.req.headers.cookie

//   if (typeof cookies !== 'string') {
//     return {
//       redirect: {
//       permanent: false,
//       destination: "auth/login",
//       },
//       props:{},
//     }
//   }
//   else
//   return {
//     props: {},
//   }
//   // else {
//   //     return {
//   //         props: { auth: true },
//   //     }
//   // }
// }

export default Home;
