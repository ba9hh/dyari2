// src/utils/shopSlug.js

// Turns "Le Petit Café" into "le-petit-cafe"
const slugify = (text = "") =>
    text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // strip accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

// shop -> "le-petit-cafe--8f14e45f-eb1a-4a7d-8b1c-3d9e2f1a0b7c"
export const buildShopSlug = (shop) => {
    const slug = slugify(shop?.business_name) || "boutique";
    return `${slug}--${shop.id}`;
};

// "le-petit-cafe--8f14e45f-eb1a-..." -> "8f14e45f-eb1a-..."
// We use "--" as separator since a uuid itself contains single dashes.
export const extractShopId = (slugParam = "") => {
    const parts = slugParam.split("--");
    return parts[parts.length - 1];
};