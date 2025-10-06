import React, { useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import DyariLogo from "../components/DyariLogo";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useNavigate } from "react-router-dom";

const AuthCustomer = () => {
  const { user, sessionChecked, loginWithGoogle, authError } =
    useContext(AuthContext);
  const navigate = useNavigate();

  // 🔹 Redirect to home if user is logged in
  useEffect(() => {
    if (user && sessionChecked) {
      navigate("/"); // or your home route
    }
  }, [user, sessionChecked, navigate]);
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen sm:bg-[#f5f5f5] bg-white gap-6">
      <DyariLogo />
      <h1 className=" text-amber-600">
        Se connecter en mode <span className="font-semibold">Client</span> :
      </h1>
      {authError && <h1 className="text-red-600 text-center">{authError}</h1>}
      <div className="w-2/3 sm:w-1/5 flex flex-col gap-y-5 ">
        <div className="bg-white  rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
          <GoogleLoginButton onClick={loginWithGoogle} />
        </div>
      </div>
    </div>
  );
};

export default AuthCustomer;
