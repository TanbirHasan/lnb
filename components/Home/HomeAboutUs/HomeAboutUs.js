import React from "react";

const HomeAboutUs = () => {
  return (
    <div className="px-10 text-center lg:text-center md:text-center lg:px-20 my-20 sm:px-10">
      <div className="mx-auto">
        <img
          src="assets/Searchlogo.png"
          alt="search"
          className="mx-auto mb-5 max-h-36 w-auto object-cover "
        />
      </div>
      <h3 className="Tagline taglineRes mb-5  text-[#D16F32] tracking-wider">
        ABOUT US
      </h3>
      <h2 className="headline3 headline3Res tracking-wide">
        Be the first to access new companies contact
        <br /> details with new start data.
      </h2>
    </div>
  );
};

export default HomeAboutUs;
