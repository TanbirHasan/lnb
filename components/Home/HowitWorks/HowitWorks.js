import Image from "next/image";

const HowitWorks = () => {
  return (
    <div className="px-10 lg:px-20 md:px-20 mt-10 Howitworks py-20 text-white">
      <div className="max-w-7xl mx-auto">
        <div>
          <h2 className="headline1 headline1Res text-center mb-5">
            How It Works
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3  lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 md:gap-1">
          <div className="howitworksOption">
            <div className="howitworkslogo">
              <Image src="/assets/Gps.png" width="24" height="24" alt="" />
            </div>

            <h3 className="headline4 headline4Res">Enter Postcode</h3>
            <p className="headline6 headline6Res sm:text-[18px]">
              Once you enter a postcode, our back end servers know what location
              to look up.
            </p>
          </div>
          <div className="howitworksOption">
            <div className="howitworkslogo">
              <Image src="/assets/Select.png" width="24" height="24" alt="" />
            </div>

            <h3 className="headline4 headline4Res">Enter SIC Code</h3>
            <p className="headline6 headline6Res sm:text-[18px]">
              The SIC (Standard Industrial Classification) code refines your
              search to specific industries.
            </p>
          </div>
          <div className="howitworksOption">
            <div className="howitworkslogo">
              <Image src="/assets/Search.png" width="24" height="24" alt="" />
            </div>
            <h3 className="headline4 headline4Res">Search</h3>
            <p className="headline6 headline6Res sm:text-[18px]">
              Hit the search button to get the process going!
            </p>
          </div>
          <div className="howitworksOption">
            <div className="howitworkslogo">
              <Image src="/assets/Database.png" width="24" height="24" alt="" />
            </div>
            <h3 className="headline4 headline4Res">Database</h3>
            <p className="headline6 headline6Res sm:text-[18px]">
              The information is automatically retrieved from our database based
              on the postcode and SIC code.
            </p>
          </div>
          <div className="howitworksOption">
            <div className="howitworkslogo">
              <Image src="/assets/Payment.png" width="24" height="24" alt="" />
            </div>
            <h3 className="headline4 headline4Res">Payment</h3>
            <p className="headline6 headline6Res sm:text-[18px]">
              Select your desired delivery method, and complete the payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowitWorks;
