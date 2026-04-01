import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
async function getUserProfile(userId) {
  let data, error;

  ({ data, error } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", userId)
    .single());

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data; // { id, profile_picture }
}
const AuthContext = React.createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Get current session (restores from localStorage if available)
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error getting session:", error);
      const authUser = data?.session?.user;
      console.log(authUser);
      if (authUser) {
        const profile = await getUserProfile(authUser.id);
        setUser(profile);
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
        redirectTo: "http://localhost:5173/auth/customer",
        data: {
          role: "user",
        },
      },
    });
    if (error) console.error("Google login error:", error.message);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        return;
      }
      setUser(null);
      navigate("/auth");
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
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
