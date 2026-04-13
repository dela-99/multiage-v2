const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER || "resend").toLowerCase();
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const APP_NAME = process.env.APP_NAME || "Multiage Technologies";

const isEmailConfigured = Boolean(RESEND_API_KEY && EMAIL_FROM);

async function sendWithResend({ to, subject, html, text }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error?.message || "Failed to send email");
  }

  return data;
}

async function sendEmail({ to, subject, html, text }) {
  if (!to) {
    return { skipped: true, reason: "missing-recipient" };
  }

  if (!isEmailConfigured) {
    console.warn("Email skipped: provider credentials are not configured yet.");
    return { skipped: true, reason: "not-configured" };
  }

  if (EMAIL_PROVIDER !== "resend") {
    throw new Error(`Unsupported email provider: ${EMAIL_PROVIDER}`);
  }

  return sendWithResend({ to, subject, html, text });
}

function adminRecipients() {
  return ADMIN_EMAIL
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function layout(title, body) {
  return `
    <div style="font-family:Arial,sans-serif;background:#f6f7fb;padding:24px;color:#1f2937;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
        <div style="padding:20px 24px;background:linear-gradient(135deg,#C5620B,#6A2B09);color:#ffffff;">
          <h1 style="margin:0;font-size:22px;">${APP_NAME}</h1>
        </div>
        <div style="padding:24px;">
          <h2 style="margin-top:0;color:#111827;">${title}</h2>
          ${body}
        </div>
      </div>
    </div>
  `;
}

async function sendNewMessageNotifications(message) {
  const adminTo = adminRecipients();
  const customerText = `Hello ${message.name}, we have received your message and will get back to you shortly.`;
  const typeLabel = message.kind === "used-device-inquiry" ? "Used Device Inquiry" : "Contact Message";

  const jobs = [];

  if (adminTo.length > 0) {
    jobs.push(sendEmail({
      to: adminTo,
      subject: `[${APP_NAME}] New ${typeLabel}`,
      text: `${typeLabel} from ${message.name} (${message.email})\nPhone: ${message.phone || "N/A"}\nDevice: ${message.deviceRequested || "N/A"}\nService: ${message.service || "N/A"}\nSource: ${message.source || "website"}\n\n${message.message}`,
      html: layout(`New ${typeLabel}`, `
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Phone:</strong> ${message.phone || "N/A"}</p>
        <p><strong>Device Requested:</strong> ${message.deviceRequested || "N/A"}</p>
        <p><strong>Service:</strong> ${message.service || "N/A"}</p>
        <p><strong>Source:</strong> ${message.source || "website"}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message.message || "").replace(/\n/g, "<br />")}</p>
      `),
    }));
  }

  jobs.push(sendEmail({
    to: message.email,
    subject: `${APP_NAME} received your message`,
    text: customerText,
    html: layout("We received your message", `
      <p>Hello ${message.name},</p>
      <p>Thanks for reaching out to ${APP_NAME}. We have received your message and our team will get back to you shortly.</p>
      <p><strong>Reference Type:</strong> ${typeLabel}</p>
    `),
  }));

  return Promise.allSettled(jobs);
}

async function sendOrderNotifications(order, user) {
  const adminTo = adminRecipients();
  const itemsText = order.items.map((item) => `- ${item.name} x${item.quantity} (GHS ${item.price})`).join("\n");
  const jobs = [];

  if (adminTo.length > 0) {
    jobs.push(sendEmail({
      to: adminTo,
      subject: `[${APP_NAME}] New Order ${order._id}`,
      text: `A new order has been created.\nCustomer: ${user?.name || "Customer"}\nEmail: ${user?.email || "N/A"}\nOrder ID: ${order._id}\nTotal: GHS ${order.totalPrice}\n\n${itemsText}`,
      html: layout("New Order Received", `
        <p><strong>Customer:</strong> ${user?.name || "Customer"}</p>
        <p><strong>Email:</strong> ${user?.email || "N/A"}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> GHS ${order.totalPrice}</p>
        <p><strong>Items:</strong></p>
        <ul>${order.items.map((item) => `<li>${item.name} x${item.quantity} (GHS ${item.price})</li>`).join("")}</ul>
      `),
    }));
  }

  if (user?.email) {
    jobs.push(sendEmail({
      to: user.email,
      subject: `${APP_NAME} order confirmation`,
      text: `Hello ${user.name || "Customer"}, your order has been received. Order ID: ${order._id}. Total: GHS ${order.totalPrice}.`,
      html: layout("Order Confirmation", `
        <p>Hello ${user.name || "Customer"},</p>
        <p>Your order has been received successfully.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> GHS ${order.totalPrice}</p>
        <p>We will contact you with the next update.</p>
      `),
    }));
  }

  return Promise.allSettled(jobs);
}

async function sendWelcomeNotification(user) {
  if (!user?.email) {
    return { skipped: true, reason: "missing-recipient" };
  }

  return sendEmail({
    to: user.email,
    subject: `Welcome to ${APP_NAME}`,
    text: `Hello ${user.name}, your account has been created successfully.`,
    html: layout("Welcome", `
      <p>Hello ${user.name},</p>
      <p>Your account has been created successfully on ${APP_NAME}.</p>
      <p>You can now sign in and continue with your orders and requests.</p>
    `),
  });
}

module.exports = {
  isEmailConfigured,
  sendEmail,
  sendNewMessageNotifications,
  sendOrderNotifications,
  sendWelcomeNotification,
};
