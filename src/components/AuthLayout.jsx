import { Outlet } from "react-router-dom";
import loginbg from "@/assets/loginbg.jpg";
import DyariLogo from "./DyariLogo";
export default function AuthLayout() {
  return (
    <div className="">
      <DyariLogo />
      <img
        src={loginbg}
        className="absolute inset-0 object-cover w-full h-screen"
      />
      <div className="flex justify-center sm:items-center pt-6 sm:pt-0 h-screen">
        <Outlet />
      </div>
    </div>
  );
}
