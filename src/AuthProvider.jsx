import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
async function getUserProfile(userId) {
  let data, error;

  ({ data, error } = await supabase
    .from("users")
    .select("id, role, has_selected_role")
    .eq("id", userId)
    .single());

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}
const AuthContext = React.createContext();
const ROLE_SELECTION_ALLOWED_PATHS = ["/role-selection", "/shop-creation"];

const AuthProvider = ({ children }) => {
  console.log("AuthProvider rendered");
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect started");

    const redirectIfRoleNotSelected = (profile) => {
      if (
        profile &&
        !profile.has_selected_role &&
        !ROLE_SELECTION_ALLOWED_PATHS.includes(window.location.pathname)
      ) {
        navigate("/role-selection");
      }
    };

    const getSession = async () => {
      try {
        console.log("Before getSession");
        const { data, error } = await supabase.auth.getSession();

        console.log("After getSession");

        console.log("SESSION:", data);
        console.log("ERROR:", error);
        if (error) console.error("Error getting session:", error);
        const authUser = data?.session?.user;

        if (authUser) {
          console.log("AUTH USER:", authUser);
          const profile = await getUserProfile(authUser.id);
          console.log("Fetched profile:", profile);
          setUser(profile);
          redirectIfRoleNotSelected(profile);
        }
        setSessionChecked(true);
      } catch (err) {
        console.error("GET SESSION CRASHED:", err);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const authUser = session?.user;

        if (authUser) {
          (async () => {
            const profile = await getUserProfile(authUser.id);
            setUser(profile);
            setSessionChecked(true);
            redirectIfRoleNotSelected(profile);
          })();
        } else {
          setUser(null);
          setSessionChecked(true);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://dyaritunisie.com",
      },
    });
    if (error) console.error("Google login error:", error.message);
  };
  const signupWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://dyaritunisie.com",
      },
    });
    if (error) console.error("Google signup error:", error.message);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        return;
      }
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Unexpected logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authError,
        sessionChecked,
        setUser,
        loginWithGoogle,
        signupWithGoogle,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
