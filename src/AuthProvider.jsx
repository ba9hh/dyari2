import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
async function getUserProfile(userId, role) {
  let data, error;

  if (role === "shop") {
    ({ data, error } = await supabase
      .from("shops")
      .select("id, profile_picture")
      .eq("id", userId)
      .single());
  } else {
    ({ data, error } = await supabase
      .from("users")
      .select("id, profile_picture")
      .eq("id", userId)
      .single());
  }

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return { role, ...data }; // { id, profile_picture }
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
      if (authUser) {
        const role = authUser.user_metadata?.last_name ? "shop" : "user";
        const profile = await getUserProfile(authUser.id, role);
        setUser(profile);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const authUser = session?.user;

        if (authUser) {
          (async () => {
            const role = authUser.user_metadata?.last_name ? "shop" : "user";
            if (role === "user") {
              const email = authUser.email;
              const { data: shopExists } = await supabase
                .from("shops")
                .select("id")
                .eq("email", email)
                .single();

              if (shopExists) {
                // 🚫 It's a shop trying to log in with Google
                await supabase.from("users").delete().eq("id", authUser.id); // Remove trigger-created row
                await supabase.auth.signOut();
                setAuthError(
                  "Cet email est déjà utilisé pour un compte boutique. Veuillez vous essayez un autre gmail."
                );
                setUser(null);
                setSessionChecked(true);
                return;
              }
            }
            const profile = await getUserProfile(authUser.id, role);
            setUser(profile);
            setSessionChecked(true);
          })();
        } else {
          setUser(null);
          setSessionChecked(true);
        }
      }
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
