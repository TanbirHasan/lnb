import AboutUsSecond from "../common/AboutUsSecond/AboutUsSecond";

import Footer from "../Layout/Footer/Footer";
import Goal from "./Goal";

import ReserveData from "./ReserveData";
import Responsibilities from "./Responsibilities";
import Navbar from "../Layout/Navbar/Navbar";
import Link from "next/link";

const Index = () => {
  const colour = "transparent";
  return (
    <div>
      <div className="about lg:text-center md:text-center sm:text-center">
        <Navbar colour={colour} />
        <div className="px-10 text-center lg:text-center md:text-center lg:px-20 my-20 sm:px-10 max-w-7xl mx-auto lg:3/4">
          <h3 className="Tagline taglineRes mb-5 text-[#D16F32]">ABOUT US</h3>
          <h2 className="headline3 headline3Res pt-3 mb-5">
            Empowering businesses to succeed and build
            <br /> meaningful connections.
          </h2>
          <p className="headline6 headline6Res  hidden lg:block md:block">
            Discover how New Local Business can help your business grow.
          </p>
        </div>
      </div>

      <ReserveData />
      <AboutUsSecond />
      <Responsibilities />
      <Goal />

      <div className="text-start py-10 px-10 xl:px-20  lg:px-20 md:px-20   lg:py-20 md:py-20 lg:text-center md:text-center  max-w-7xl mx-auto">
        <h3 className="headline3 headline3Res text-center  mb-5">
          Be the first to access new companies contact.
        </h3>
        <p className="headline6 headline6Res w-full md:w-11/12 my-4 custom-text-opacity-60 text-center mx-auto">
          Be the first to access new companies contact details with New Start
          Data. Be the first to access new companies contact details with New
          Start Data. Be the first to access new companies contact details with
          New Start Data. Be the first to access new companies contact details
          with New Start Data. Be the first to access new companies contact
          details with New Start Data. Be the first to access new companies
          contact details with New Start Data. Be the first to access new
          companies contact details. Be the first to access new companies
          contact details with New Start Data. Be the first to access new
          companies accesss.
        </p>
        <Link href="/">
          <button className="text-white bg-primary hover:bg-primaryHover cursor-pointer my-5 capitalize p-4 rounded-md font-bold shadow-none hover:shadow-none w-full md:w-48 ">
            Explore
          </button>
        </Link>
      </div>
      {/* <Conversation /> */}
      <Footer />
    </div>
  );
};

export default Index;
