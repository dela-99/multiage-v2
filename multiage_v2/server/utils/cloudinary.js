const crypto = require("crypto");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const hasCloudinaryConfig = Boolean(cloudName && apiKey && apiSecret);

const createSignature = (params) => {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
};

const uploadToCloudinary = async (file, folder = "multiage/products") => {
  if (!file || !hasCloudinaryConfig) {
    return { url: typeof file === "string" ? file : "", publicId: "" };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };
  const signature = createSignature(paramsToSign);

  const payload = new URLSearchParams({
    file,
    folder,
    api_key: apiKey,
    timestamp: String(timestamp),
    signature,
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return {
    url: data.secure_url || data.url || "",
    publicId: data.public_id || "",
  };
};

module.exports = { hasCloudinaryConfig, uploadToCloudinary };
