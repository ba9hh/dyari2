import { Outlet } from "react-router-dom";
import loginbg from "@/assets/loginbg.jpg";
import DyariLogo from "./DyariLogo";
export default function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <DyariLogo />
      <img
        src={loginbg}
        className="absolute inset-0 object-cover w-full h-screen"
      />
      <div className="flex-1 flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
}
