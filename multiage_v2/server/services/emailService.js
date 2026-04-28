const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");

const COMPANY_EMAIL = "multiagetechnologies@gmail.com";
const EMAIL_USER = process.env.EMAIL_USER || COMPANY_EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS || "";
const APP_NAME = process.env.APP_NAME || "Multiage Technologies";

const isEmailConfigured = Boolean(EMAIL_USER && EMAIL_PASS);

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  return transporter;
}

async function writeEmailLog(payload) {
  try {
    await EmailLog.create(payload);
  } catch (error) {
    console.error("[email-log] failed to save log:", error.message);
  }
}

async function sendEmail({ to, subject, text, html, direction, meta = {} }) {
  const recipients = Array.isArray(to) ? to : [to];

  if (!isEmailConfigured) {
    const error = new Error("Email credentials are not configured");
    console.error("[email] configuration error:", error.message);
    throw error;
  }

  const transport = getTransporter();
  console.log("[email] sending", {
    from: EMAIL_USER,
    to: recipients,
    subject,
    direction,
  });

  try {
    const info = await transport.sendMail({
      from: `"${APP_NAME}" <${EMAIL_USER}>`,
      to: recipients.join(", "),
      subject,
      text,
      html,
      replyTo: EMAIL_USER,
    });

    console.log("[email] sent successfully", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    await writeEmailLog({
      sender: EMAIL_USER,
      receiver: recipients.join(", "),
      subject,
      message: text || "",
      direction,
      status: "sent",
      meta: {
        ...meta,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      },
    });

    return info;
  } catch (error) {
    console.error("[email] send failed", {
      recipient: recipients,
      subject,
      error: error.message,
    });

    await writeEmailLog({
      sender: EMAIL_USER,
      receiver: recipients.join(", "),
      subject,
      message: text || "",
      direction,
      status: "failed",
      meta: {
        ...meta,
        error: error.message,
      },
    });

    throw error;
  }
}

function serviceRequestHtml(message, submittedAt) {
  return `
    <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
      <h2 style="margin-top:0;">New Service Request</h2>
      <p><strong>Name:</strong> ${message.name}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Phone:</strong> ${message.phone || "N/A"}</p>
      <p><strong>Service:</strong> ${message.service || "N/A"}</p>
      <p><strong>Request Type:</strong> ${message.kind || "contact"}</p>
      <p><strong>Device Requested:</strong> ${message.deviceRequested || "N/A"}</p>
      <p><strong>Source:</strong> ${message.source || "website"}</p>
      <p><strong>Submitted At:</strong> ${submittedAt}</p>
      <p><strong>Request Details:</strong></p>
      <p>${String(message.message || "").replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

async function sendUserRequestEmail(message) {
  const submittedAt = message.createdAt
    ? new Date(message.createdAt).toLocaleString()
    : new Date().toLocaleString();
  const requestType = message.kind === "used-device-inquiry" ? "Used Device Inquiry" : "Service Request";
  const text = `${requestType}\nName: ${message.name}\nEmail: ${message.email}\nPhone: ${message.phone || "N/A"}\nService: ${message.service || "N/A"}\nDevice Requested: ${message.deviceRequested || "N/A"}\nSource: ${message.source || "website"}\nSubmitted At: ${submittedAt}\n\nRequest Details:\n${message.message}`;

  return sendEmail({
    to: [COMPANY_EMAIL],
    subject: `[${APP_NAME}] New ${requestType}`,
    text,
    html: serviceRequestHtml(message, submittedAt),
    direction: "user_to_company",
    meta: {
      requestId: message._id ? String(message._id) : "",
      userEmail: message.email,
    },
  });
}

function replyHtml(message) {
  return `
    <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
      <h2 style="margin-top:0;">Reply from ${APP_NAME}</h2>
      <p>${String(message).replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

async function sendReplyToUserEmail({ userEmail, message, adminName = "Admin" }) {
  return sendEmail({
    to: [userEmail],
    subject: `${APP_NAME} response to your request`,
    text: `Hello,\n\n${message}\n\nRegards,\n${adminName}\n${APP_NAME}`,
    html: replyHtml(`Hello,<br /><br />${String(message).replace(/\n/g, "<br />")}<br /><br />Regards,<br />${adminName}<br />${APP_NAME}`),
    direction: "company_to_user",
    meta: {
      userEmail,
      adminName,
    },
  });
}

async function sendWelcomeNotification(user) {
  if (!user?.email) {
    return { skipped: true, reason: "missing-recipient" };
  }

  return sendEmail({
    to: [user.email],
    subject: `Welcome to ${APP_NAME}`,
    text: `Hello ${user.name || "there"}, your account has been created successfully.`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
        <h2 style="margin-top:0;">Welcome to ${APP_NAME}</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>Your account has been created successfully.</p>
      </div>
    `,
    direction: "company_to_user",
    meta: {
      userEmail: user.email,
      category: "welcome",
    },
  });
}

async function sendAdminNewOrderNotification(order, user) {
  const itemsText = (order.items || [])
    .map((item) => `- ${item.name} x${item.quantity} (GHS ${item.price})`)
    .join("\n");

  return sendEmail({
    to: [COMPANY_EMAIL],
    subject: `[${APP_NAME}] New Order ${order._id}`,
    text: `A new order has been created.\nCustomer: ${user?.name || "Customer"}\nEmail: ${user?.email || "N/A"}\nOrder ID: ${order._id}\nTotal: GHS ${order.totalPrice}\n\n${itemsText}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
        <h2 style="margin-top:0;">New Order Received</h2>
        <p><strong>Customer:</strong> ${user?.name || "Customer"}</p>
        <p><strong>Email:</strong> ${user?.email || "N/A"}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> GHS ${order.totalPrice}</p>
        <ul>${(order.items || []).map((item) => `<li>${item.name} x${item.quantity} (GHS ${item.price})</li>`).join("")}</ul>
      </div>
    `,
    direction: "user_to_company",
    meta: {
      orderId: String(order._id),
      userEmail: user?.email || "",
      category: "order-admin",
    },
  });
}

async function sendPaidOrderConfirmation(order, user) {
  const paymentReference = order.paymentReference || "N/A";
  const jobs = [];

  jobs.push(sendEmail({
    to: [COMPANY_EMAIL],
    subject: `[${APP_NAME}] Payment Confirmed ${order._id}`,
    text: `Payment confirmed for order ${order._id}.\nCustomer: ${user?.name || "Customer"}\nEmail: ${user?.email || "N/A"}\nReference: ${paymentReference}\nAmount: GHS ${order.totalPrice}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
        <h2 style="margin-top:0;">Payment Confirmed</h2>
        <p><strong>Customer:</strong> ${user?.name || "Customer"}</p>
        <p><strong>Email:</strong> ${user?.email || "N/A"}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Payment Reference:</strong> ${paymentReference}</p>
        <p><strong>Amount Paid:</strong> GHS ${order.totalPrice}</p>
      </div>
    `,
    direction: "user_to_company",
    meta: {
      orderId: String(order._id),
      userEmail: user?.email || "",
      category: "payment-admin",
    },
  }));

  if (user?.email) {
    jobs.push(sendEmail({
      to: [user.email],
      subject: `${APP_NAME} payment confirmed`,
      text: `Hello ${user.name || "Customer"}, your payment has been confirmed. Order ID: ${order._id}. Reference: ${paymentReference}. Total: GHS ${order.totalPrice}.`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
          <h2 style="margin-top:0;">Payment Confirmed</h2>
          <p>Hello ${user.name || "Customer"},</p>
          <p>Your payment has been confirmed successfully.</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Payment Reference:</strong> ${paymentReference}</p>
          <p><strong>Amount Paid:</strong> GHS ${order.totalPrice}</p>
        </div>
      `,
      direction: "company_to_user",
      meta: {
        orderId: String(order._id),
        userEmail: user.email,
        category: "payment-user",
      },
    }));
  }

  return Promise.allSettled(jobs);
}

async function sendPasswordResetEmail({ user, resetLink, expiresInMinutes = 15 }) {
  if (!user?.email) {
    return { skipped: true, reason: "missing-recipient" };
  }

  return sendEmail({
    to: [user.email],
    subject: `${APP_NAME} password reset request`,
    text: `Hello ${user.name || "there"},\n\nWe received a request to reset your password.\n\nReset your password here:\n${resetLink}\n\nThis link will expire in ${expiresInMinutes} minutes.\nIf you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
        <h2 style="margin-top:0;">Reset your password</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:#C5620B;color:#ffffff;text-decoration:none;font-weight:700;">
            Reset Password
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p>${resetLink}</p>
        <p>This link will expire in ${expiresInMinutes} minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
    direction: "company_to_user",
    meta: {
      userEmail: user.email,
      category: "password-reset",
    },
  });
}

async function sendPasswordChangedAlert(user) {
  if (!user?.email) {
    return { skipped: true, reason: "missing-recipient" };
  }

  return sendEmail({
    to: [user.email],
    subject: `${APP_NAME} password changed successfully`,
    text: `Hello ${user.name || "there"},\n\nYour password was changed successfully.\nIf this was not you, contact support immediately.`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;color:#111827;">
        <h2 style="margin-top:0;">Password changed successfully</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>Your password was changed successfully.</p>
        <p>If this was not you, contact support immediately.</p>
      </div>
    `,
    direction: "company_to_user",
    meta: {
      userEmail: user.email,
      category: "password-changed",
    },
  });
}

module.exports = {
  COMPANY_EMAIL,
  EMAIL_USER,
  isEmailConfigured,
  sendEmail,
  sendUserRequestEmail,
  sendReplyToUserEmail,
  sendWelcomeNotification,
  sendAdminNewOrderNotification,
  sendPaidOrderConfirmation,
  sendPasswordResetEmail,
  sendPasswordChangedAlert,
};
