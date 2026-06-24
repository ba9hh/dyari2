import { Outlet } from "react-router-dom";
import loginbg from "@/assets/loginbg.jpg";
import DyariLogo from "./DyariLogo";
export default function AuthLayout() {
  return (
    <div className="">
      <DyariLogo />
      <div className="flex justify-center items-center h-screen">
        <img
          src={loginbg}
          className="absolute inset-0 h-screen w-full object-cover"
        />
        <Outlet />
      </div>
    </div>
  );
}
