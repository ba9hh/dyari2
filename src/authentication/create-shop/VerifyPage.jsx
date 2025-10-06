import { useEffect, useState, useContext } from "react";
import { supabase } from "../../supabaseClient";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

export default function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }
      console.log(session);
      const user = session.user;
      console.log(user);
      if (user?.email_confirmed_at) {
        // ✅ Only now insert shop info
        const { error } = await supabase.from("shops").upsert([
          {
            id: user.id,
            name: user.user_metadata.name,
            last_name: user.user_metadata.last_name,
            email: user.email,
            // localisation: user.user_metadata.localisation,
            // gender: user.user_metadata.gender,
            // speciality: JSON.parse(user.user_metadata.speciality),
            localisation: "Monastir",
            gender: "Femme",
            speciality: ["salés"],
          },
        ]);
        if (error) console.error("Error inserting shop:", error);

        navigate("/account");
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <CircularProgress />;

  return <h2>Merci d’avoir confirmé votre email 🎉</h2>;
}
