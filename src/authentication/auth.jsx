import loginbg from "@/assets/loginbg.jpg";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/AuthProvider";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import dyari from "@/assets/dyari.svg";
import Login from "./Login";
import Signup from "./Signup";

const Auth = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <img
        src={loginbg}
        className="absolute inset-0 h-screen w-full object-cover"
      />
      <div className="bg-white border-2 border-gray-400 w-96 z-10 rounded-md">
        <Login />
      </div>
    </div>
  );
};

export default Auth;
