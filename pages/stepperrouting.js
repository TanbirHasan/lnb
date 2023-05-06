import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Stepperrouting = () => {
  const router = useRouter();

  const handleRoute = data => {
    router.push("/stepperpages/totalcompany", { shallow: true });
  };

  return (
    <div>
      <ul className="flex justify-evenly">
        <div className="flex ">
          <span>1</span>

          <button
            className="ml-3 cursor-pointer"
            onClick={() => handleRoute("totalcompay")}
          >
            Total Company
          </button>
        </div>
        <div className="flex ">
          <span>2</span>

          <button
            className="ml-3 cursor-pointer"
            onClick={() => handleRoute("totalcompay")}
          >
            Company List
          </button>
        </div>
        <div className="flex ">
          <span>3</span>

          <button className="ml-3 cursor-pointer">Select Option</button>
        </div>
        <div className="flex ">
          <span>4</span>

          <button className="ml-3 cursor-pointer">Payment</button>
        </div>
      </ul>
    </div>
  );
};

export default Stepperrouting;
