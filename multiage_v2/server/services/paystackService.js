const crypto = require("crypto");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_CURRENCY = "GHS";

const isPaystackConfigured = Boolean(PAYSTACK_SECRET_KEY);

async function paystackRequest(path, { method = "GET", body } = {}) {
  if (!isPaystackConfigured) {
    throw new Error("Paystack is not configured");
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.status === false) {
    throw new Error(data.message || "Paystack request failed");
  }

  return data;
}

function amountToSubunit(amount) {
  return String(Math.round(Number(amount || 0) * 100));
}

async function initializeTransaction({ email, amount, reference, callbackUrl, metadata }) {
  return paystackRequest("/transaction/initialize", {
    method: "POST",
    body: {
      email,
      amount: amountToSubunit(amount),
      currency: PAYSTACK_CURRENCY,
      reference,
      callback_url: callbackUrl,
      metadata,
    },
  });
}

async function verifyTransaction(reference) {
  return paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
}

function validatePaystackSignature(payload, signature) {
  if (!isPaystackConfigured || !payload || !signature) {
    return false;
  }

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest("hex");

  return hash === signature;
}

module.exports = {
  PAYSTACK_CURRENCY,
  isPaystackConfigured,
  initializeTransaction,
  verifyTransaction,
  validatePaystackSignature,
};
