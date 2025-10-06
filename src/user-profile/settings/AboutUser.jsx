import { useState, useEffect } from "react";
import GeneralAboutUser from "./GeneralAboutUser";
import DeleteUser from "./DeleteUser";
import DyariLogo from "../../components/DyariLogo";

const AboutUser = ({ userId }) => {
  return (
    <div className="flex justify-center items-center pt-16 pb-8 sm:bg-[#F5F5F5] bg-white min-h-screen">
      <DyariLogo />
      <div className="w-fit sm:w-fit bg-white shadow-md rounded-md pt-8 pb-8 px-12">
        <GeneralAboutUser userId={userId} />
        <DeleteUser userId={userId} />
      </div>
    </div>
  );
};

export default AboutUser;
