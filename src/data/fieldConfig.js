const fieldConfig = {
    locationExact: {
        label: "Localisation",
        validate: (v) => v.trim().length > 0,
        helperText: "",
    },
    facebook: {
        label: "Facebook",
        validate: (v) => /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9\.]+/.test(v),
        helperText: "Must be a full facebook.com URL (https://www.facebook.com/...)",
    },
    whatsapp: {
        label: "WhatsApp",
        validate: (v) => /^[259]\d{7}$/.test(v),
        helperText: "8 digits, starting with 2, 5, or 9",
    },
    instagram: {
        label: "Instagram",
        validate: (v) => /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_\.]+/.test(v),
        helperText: "Must be a full instagram.com URL",
    },
    tiktok: {
        label: "TikTok",
        validate: (v) => /^https:\/\/(www\.)?tiktok\.com\/@[\w\.]+/.test(v),
        helperText: "Must be a full tiktok.com URL",
    },
    youtube: {
        label: "YouTube",
        validate: (v) => /^https:\/\/(www\.)?youtube\.com\/(channel|c)\/[\w-]+/.test(v),
        helperText: "Must be a valid YouTube channel URL",
    },
};
export default fieldConfig;