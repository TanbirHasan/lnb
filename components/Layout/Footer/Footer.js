import Head from "next/head";
import Link from "next/link";
import React from "react";

const Footer = () => {


  const addJsonLd = () => {
    return {
      __html: `
      {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "Start Search",
          "item": "https://localnewbusiness.com/"  
        },{
          "@type": "ListItem",
          "position": 2,
          "name": "About",
          "item": "https://localnewbusiness.com/about"  
        },{
          "@type": "ListItem",
          "position": 3,
          "name": "Contact",
          "item": "https://localnewbusiness.com/contact"  
        }]
      }
      `
    }
  }

  return (
    
    <footer className="footer text-gray-600 body-font bottom-0 w-full mt-auto">


            <script 
              type="application/ld+json"
              dangerouslySetInnerHTML={addJsonLd()}
            />

      
      <div className="container px-10 py-24 lg:px-20 md:px-20 mx-auto flex justify-between md:items-center lg:items-center md:flex-row flex-col">
        <div className="xl:w-64 lg:w-64 md:w-64 flex-shrink-0 md:mx-0 md:text-left sm:mx-0 sm:w-full">
          <a className="flex title-font justify-start font-medium xl:items-center md:justify-start text-gray-900 sm:justify-start">
            <img
              className="ml-3 text-xl"
              src="/assets/logo.png"
              width="120"
              height=""
              alt="logo"
            />
          </a>
          <p className="mt-2 text-sm text-gray-500 mb-5 ">
            Local New Business is your go-to source for the latest contact
            details of new companies in your area. Our database is updated
            daily, so you can stay on top of the latest opportunities.
          </p>
        </div>

        <div className="">
          <h2 className="title-font font-semibold text-gray-900 tracking-widest text-sm mb-3">
            Company
          </h2>
          <nav className="list-none mb-10">
            <li className="text-gray-600 hover:text-gray-800 hover:underline mb-3">
              <Link href="/">Start Seacrh</Link>
            </li>
            <li className="text-gray-600 hover:text-gray-800 hover:underline  mb-3">
              <Link href="/about">About</Link>
            </li>
            <li className="text-gray-600 hover:text-gray-800 hover:underline">
              <Link href="/contact">Contact</Link>
            </li>
          </nav>
        </div>
      </div>
      <div className="py-10 px-10 text-center">
        <p>© 2023 -All Right Reserved | LocalNewBusiness.com </p>
      </div>
    </footer>
    
  );
};

export default Footer;
