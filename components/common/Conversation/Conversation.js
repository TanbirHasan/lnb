import Image from "next/image";
import logo from "../../../public/assets/logo.png";

const Conversation = () => {
  return (
    <div className="lg:px-20 py-10 px-10 lg:py-20 md:py-20 md:px-20  max-w-7xl mx-auto relative">
      <div className="flex flex-col justify-evenly items-start px-10 bg-[#9BCCE9]  py-20 rounded-2xl xl:flex-row lg:flex-row md:flex-row  lg:mx-0 md:mx-0">
        <div className="flex flex-col justify-center items-center sm:pr-5 lg:items-start md:items-start">
          <h3 className="headline3 headline3Res mb-5">
            Get full conversion access with{" "}
          </h3>

          <div className="">
            <div className="flex py-3 relative">
              <Image src={logo} alt="logo" className="" />
              <span className="headline6Res ml-4 bg-[#3294D1] px-5 rounded-lg text-white h-7 my-auto">
                Pro
              </span>
            </div>
            <button className="sm:px-14 sm:py-4 px-16 py-2 font-medium headline5Res rounded-lg my-5 text-center bg-[color:var(--primary1-color)] text-white cursor-pointer ">
              Upgrade to Pro
            </button>
          </div>
        </div>
        <div>
          <h3 className="headline4 headline4Res mb-5">
            Featrues that you will get
          </h3>
          <div className="flex items-center mb-3">
            <span className="mr-5">
              <Image src="/assets/bluetick.png" width="25" height="20" alt="" />
            </span>
            <p className="headline6">Unlimited Storge</p>
          </div>
          <div className="flex items-center  mb-3">
            <span className="mr-5">
              <Image src="/assets/bluetick.png" width="25" height="20" alt="" />
            </span>
            <p className="headline6">More Cloud Storge</p>
          </div>
          <div className="flex items-center  mb-3">
            <span className="mr-5">
              <Image src="/assets/bluetick.png" width="25" height="20" alt="" />
            </span>
            <p className="headline6">Download in 3 More formats</p>
          </div>
          <div className="flex items-center  mb-3">
            <span className="mr-5">
              <Image src="/assets/bluetick.png" width="25" height="20" alt="" />
            </span>
            <p className="headline6">1 Year membershio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
