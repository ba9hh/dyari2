import { Outlet } from "react-router-dom";
import loginbg from "@/assets/loginbg.jpg";

export default function AuthLayout() {
  return (
    <div className="flex justify-center items-center h-screen">
      <img
        src={loginbg}
        className="absolute inset-0 h-screen w-full object-cover"
      />
      <div className="bg-white border-2 border-gray-400 w-96 z-10 rounded-md">
        <Outlet />
      </div>
    </div>
  );
}
