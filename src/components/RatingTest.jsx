import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";

const RatingTest = ({ shopId }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(null);
  const [initialRating, setInitialRating] = useState(null);
  const [message, setMessage] = useState("");
  const [canRate, setCanRate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const checkEligibilityToRate = async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", user.id)
        .eq("shop_id", shopId)
        .eq("order_state", "accepted")
        .maybeSingle(); // one accepted order is enough

      if (error && error.code !== "PGRST116") throw error;
      return !!data;
    } catch (err) {
      console.error("Error checking eligibility:", err.message);
      return false;
    }
  };
  useEffect(() => {
    const loadRatingAndEligibility = async () => {
      if (!user) return;

      const eligible = await checkEligibilityToRate();
      setCanRate(eligible);

      if (!eligible) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("ratings")
          .select("rating")
          .eq("shop_id", shopId)
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          setRating(data.rating);
          setInitialRating(data.rating);
        } else {
          setRating(null);
          setInitialRating(null);
        }
      } catch (err) {
        console.error("Error fetching rating:", err.message);
      }
    };

    loadRatingAndEligibility();
  }, [user, shopId]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setIsDirty(initialRating === null || newRating !== initialRating);
  };

  const handleSubmit = async () => {
    if (!user) {
      setMessage("You must be logged in to rate.");
      return;
    }
    if (user.role === "shop") {
      setMessage("You must be logged as a user in to rate.");
      return;
    }
    if (!canRate) {
      setMessage(
        "You can only rate if you have an accepted order with this shop."
      );
      return;
    }
    if (!rating) {
      setMessage("Please select a rating first.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("ratings")
        .upsert([{ shop_id: shopId, user_id: user.id, rating }], {
          onConflict: ["shop_id", "user_id"],
        });

      if (error) throw error;

      toast.success("Rating submitted successfully!");
      setInitialRating(rating);
      setIsDirty(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="pl-1">
      <ReactStars
        key={initialRating} // re-mount on initial change
        count={5}
        value={rating}
        size={25}
        activeColor="#ffd700"
        onChange={handleRatingChange}
      />

      {/* Show submit only if there's no initial rating (new) or the user modified it */}
      {((initialRating === null && rating > 0) || isDirty) && (
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="mt-[2px] px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Submit Rating
        </button>
      )}

      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default RatingTest;
