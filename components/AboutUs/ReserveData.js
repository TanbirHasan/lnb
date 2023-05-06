import Image from "next/image";

const ReserveData = () => {
  return (
    <div className="flex flex-col px-10 lg:px-20 md:px-20  justify-center items-center my-20 xl:flex-row lg:flex-row lg:justify-evenly md:justify-evenly  max-w-7xl mx-auto">
      <div className="w-full xl:w-1/4 lg:w-1/4">
        <h2 className="reserveHeadlintext mb-5 text-[24px] text-left xl:text-[48px] lg:text-[48px] sm:text-[38px] ">
          Our database covers the whole UK
        </h2>
      </div>
      <div className="w-full mb-5 text-center xl:w-1/4 lg:w-1/4 md:w-full">
        <Image
          src="/assets/GlobalMap.png"
          width="423"
          height="500"
          alt="globalmap"
        />
      </div>
      <div className="flex flex-col mt-10 items-center w-full xl:w-1/4 lg:w-1/4 md:w-full xl:items-start lg:items-start">
        <Image
          src="/assets/Discover.png"
          width="160"
          height="92"
          alt="Discover"
        />
        <span className="headline3 mb-5">Participants</span>
        <div className=" border-solid border-b-2 pb-5 mb-5">
          <span className="mr-3">
            {" "}
            <Image
              src="/assets/Participant1.png"
              width="48"
              height="48"
              alt=""
            />
          </span>
          <span className="mr-3">
            <Image
              src="/assets/Participant2.png"
              width="48"
              height="48"
              alt=""
            />
          </span>
          <span className="mr-3">
            <Image
              src="/assets/Participant3.png"
              width="48"
              height="48"
              alt=""
            />
          </span>
          <span className="mr-3">
            <Image
              src="/assets/Participant4.png"
              width="48"
              height="48"
              alt=""
            />
          </span>
        </div>
        <p className="text-center text-[20px] lg:text-start custom-text-opacity-60 mb-4">
          Be the first to access new companies contact details with New Start
          Data. Be the first to access new companies.
        </p>
        <span className="font-semibold">-Rapid Patel</span>
      </div>
    </div>
  );
};

export default ReserveData;
