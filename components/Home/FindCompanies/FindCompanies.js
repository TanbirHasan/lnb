import Image from "next/image";
import { useState } from "react";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";

const information = [
  {
    id: 1,
    style: "col-span-1",
    headline: "Simple To Use",
    icon: <SentimentSatisfiedAltOutlinedIcon />,
    description:
      "We are a simple online service for filtering Companies House information for the names and addresses of companies, and the director names, of new UK companies of interest to you.",
  },
  {
    id: 2,
    style: "col-span-1",
    headline: "Filtered for You",
    icon: <NearMeOutlinedIcon />,
    description:
      "Not only do we filter by area, we filter addresses out by known virtual address providers so you don’t send mail to the wrong addresses (i.e Registered Offices) saving you time and money.",
  },
  {
    id: 3,
    style: "col-span-2",
    headline: "New Data",
    icon: <PostAddOutlinedIcon />,
    description:
      "Utilising our technology integrated with Companies House we are able to filter their data for you in next to real time, meaning we can deliver you Utilising our technology integrated with Companies House we are able to filter their data for you in next to real time, meaning we can deliver you the resulting company data of interest to you within 24 hours of the companies having been formed.",
  },
];

const FindCompanies = () => {
  const [data, setData] = useState(information);

  return (
    <div className="py-20 max-w-7xl mx-auto">
      <div className="pl-10 pr-10 lg:pl-20 md:pl-20 flex  lg:pr-0 md:pr-0 justify-between">
        <div>
          <h2 className="headline2 headline2Res w-full lg:w-3/4 md:w-3/4  mb-5">
            Find the names and addresses of newly formed companies in your area
            or industry.
          </h2>
        </div>
        <div className="hidden lg:block absolute right-0">
          <Image
            src="/assets/LocationLogo.png"
            width="80"
            height="145"
            alt="locationImage"
          />
        </div>
      </div>

      <div className="px-10 grid grid-cols-1  md:grid-cols-2 gap-5 mt-5 lg:px-20 md:px-20">
        {data.map((data) => (
          <div
            className={`card px-10 py-10 rounded-[10px] lg:${data.style} md:${data.style}`}
            key={data.id}
          >
            <div className="text-primary border-2 border-gray-50 shadow-lg p-2 h-14 w-14 rounded-full border-2 border-gray-200">
              <div className="text-center mt-[.4rem]">{data.icon}</div>
            </div>
            <h3 className="headline5 mb-5 headline5Res">{data.headline}</h3>
            <p className="headline6 text-[14px] lg:text-[18px] md:text-[18px]">
              {data.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindCompanies;
