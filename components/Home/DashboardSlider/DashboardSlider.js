import Image from "next/image";

const DashboardSlider = () => {
  return (
    <div className="lg:px-[200px] md:px-[150px] mx-auto">
      <div className="flex justify-center items-center w-full">
        <Image
          src="/assets/Laptop.png"
          width="700"
          height="500"
          alt="laptop pic"
        />
      </div>
    </div>
  );
};

export default DashboardSlider;
