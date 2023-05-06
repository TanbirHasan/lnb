import React, { useState } from "react";
import Preview from "../Preview/Preview";
import { useRecoilState, useRecoilValue } from "recoil";
import { formStateRecoil } from "../../../store/atoms/formStateRecoil";
import { companyListRecoilState } from "../../../store/atoms/companyListRecoil";
import { serviceRequestClient } from "../../../library/utils/queryClient";
import { useRouter } from "next/router";
import { serviceResquestResponseRecoilState } from "../../../store/atoms/serviceRequestResponseRecoil";
import { senderDataRecoil } from "../../../store/atoms/senderDataRecoil";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";

const CListSenderTemplate = ({ ondatasubmit, data }) => {
  const route = useRouter();

  const templateStrings = useRecoilValue(formStateRecoil);
  const companyList = useRecoilValue(companyListRecoilState);
  const senderInfo = useRecoilValue(senderDataRecoil);
  const [serviceRequestData, setServiceRequestData] = useRecoilState(
    serviceResquestResponseRecoilState
  );
  const [emailBodyHtml, setEmailBodyHtml] = useState();
  const router = useRouter();

  //console.log("This is sender data from template", senderInfo);

  const handleBack = () => {
    router.push("/stepperpages/companylistsender");
  };

  const handleServiceConfirmation = async () => {
    try {
      const emailBody = templateStrings.step_three;
      const emailSubject = templateStrings.emailSubject;

      //console.log("emailBody ->", emailBody);

      const response = await serviceRequestClient({
        companyNumberList: companyList,
        emailBody: emailBody,
        //To send hole page as html
        // emailBody: emailBodyHtml || emailBody,
        emailSubject: emailSubject,
        service_type: "MAIL_PRINT_SERVICE",
        sendersData: senderInfo,
        letterKey : null
      });

      if (response.status === 200) {
        setServiceRequestData(response);
        route.push("/stepperpages/step4");
      }
    } catch (error) {
      console.error(error);
    }
  };
  //console.log("EMAIL BODY",emailBodyHtml);

  return (
    <div className="py-5 px-3 shadow-lg lg:py-10 relative">
      <div className="grid grid-cols-2 mt-5 items-center">
        <div>
          <button
            className="text-center ml-2 p-2 bg-[#D16F32] text-white w-20 cursor-pointer rounded-md "
            type="button"
            onClick={() => handleBack()}
          >
            Back
          </button>
        </div>

        <div className="flex items-center">
          <span className="mr-3">
            <FindInPageOutlinedIcon />
          </span>
          <div className="text-xl font-medium">Preview</div>
        </div>
      </div>
      <div className="mt-5 w-full flex justify-center">
        {/* <img
          src="/assets/ClistsenderTemplate.png"
          width="350"
          height="600"
          alt=""
          className="shadow-lg"
        /> */}
        <Preview setEmailBodyHtml={setEmailBodyHtml} />
      </div>
      <div className="absolute right-0 top-[100%]">
        <button
          className="headline6 bg-[color:var(--form-button-color)] text-white cursor-pointer my-5 border-none py-2 px-5 rounded-lg"
          onClick={handleServiceConfirmation}
        >
          Continue To Next Step
        </button>
      </div>
    </div>
  );
};

export default CListSenderTemplate;
