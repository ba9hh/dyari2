import React from "react";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Link } from "react-router-dom";
const ShopContact = ({ shopId }) => {
  const [shopContact, setShopContact] = useState({});
  useEffect(() => {
    const fetchShopInformation = async () => {
      try {
        const { data, error } = await supabase
          .from("shop_contact")
          .select("*")
          .eq("shop_id", shopId)
          .single(); // only one row per shop

        if (error && error.code !== "PGRST116") {
          setShopContact({});
          console.error("Error fetching shop information:", error);
        } else {
          setShopContact(data); // null if no row
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchShopInformation();
  }, [shopId]);
  console.log(shopContact);
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pt-3 pb-8">
      <Typography
        variant="body1"
        align="center"
        sx={{
          py: 2,
          color: "grey.800",
        }}
      >
        Contact (Facebook ,Whatsapp , ...)
      </Typography>

      <div className="flex flex-col gap-6 px-6">
        {shopContact ? (
          <>
            {shopContact.facebook && (
              <div className="flex items-center gap-2">
                <FacebookIcon
                  style={{ fontSize: "1.6rem", color: "#1e88e5" }}
                />
                <a
                  href={shopContact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  {shopContact.facebook}
                </a>
              </div>
            )}

            {shopContact.instagram && (
              <div className="flex items-center gap-2">
                <InstagramIcon
                  style={{ fontSize: "1.6rem", color: "#e1306c" }}
                />
                <a
                  href={shopContact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  {shopContact.instagram}
                </a>
              </div>
            )}
            {shopContact.whatsapp && (
              <div className="flex items-center gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  style={{ width: "24px", height: "24px" }}
                />
                <h1 className="text-sm underline text-blue-600">
                  {shopContact.whatsapp}
                </h1>
              </div>
            )}
            {shopContact.tiktok && (
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg"
                  alt="TikTok"
                  style={{ width: "24px", height: "24px" }}
                />

                <a
                  href={shopContact.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  {shopContact.tiktok}
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
            <h1 className="text-3xl">🚫</h1>
            <h1> This shop hasn’t provided any contact information yet.</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopContact;
