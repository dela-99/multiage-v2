const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");

const COMPANY_EMAIL = "multiagetechnologies@gmail.com";
const EMAIL_USER = process.env.EMAIL_USER || COMPANY_EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS || "";
const APP_NAME = process.env.APP_NAME || "Multiage Technologies";
const CLIENT_URL = (process.env.CLIENT_URL || "https://multiage-v2-updated-1.vercel.app").replace(/\/+$/, "");
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || COMPANY_EMAIL;
const BRAND_LOGO_URL = process.env.EMAIL_LOGO_URL || `${CLIENT_URL}/assets/logo.png`;

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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function infoRow(label, value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return `
    <tr>
      <td style="padding:0 0 10px;color:#8c7767;font-size:13px;font-weight:600;vertical-align:top;width:148px;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:0 0 10px;color:#22160f;font-size:14px;line-height:1.6;">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function emailShell({ eyebrow, title, intro, bodyHtml, ctaLabel, ctaUrl, outroHtml = "" }) {
  const actionBlock = ctaLabel && ctaUrl
    ? `
      <div style="margin:28px 0 26px;">
        <a
          href="${ctaUrl}"
          style="display:inline-block;padding:14px 22px;border-radius:12px;background:linear-gradient(135deg,#C5620B,#6A2B09);background-color:#C5620B;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;"
        >
          ${escapeHtml(ctaLabel)}
        </a>
      </div>
    `
    : "";

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;padding:0;background:#f6efe8;font-family:Arial,Helvetica,sans-serif;color:#22160f;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6efe8;padding:28px 14px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid rgba(106,43,9,0.10);box-shadow:0 18px 60px rgba(28,17,11,0.10);">
                <tr>
                  <td style="padding:28px 28px 22px;background:linear-gradient(145deg,#20120b 0%,#120905 55%,#2f1609 100%);">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <img src="${BRAND_LOGO_URL}" alt="${escapeHtml(APP_NAME)}" width="46" height="46" style="display:block;border-radius:12px;background:#ffffff;object-fit:contain;" />
                        </td>
                        <td style="padding-left:14px;vertical-align:middle;">
                          <div style="color:#ffffff;font-size:20px;font-weight:800;line-height:1.2;">${escapeHtml(APP_NAME)}</div>
                          <div style="margin-top:4px;color:rgba(255,255,255,0.72);font-size:12px;letter-spacing:1.3px;text-transform:uppercase;">${escapeHtml(eyebrow)}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px 28px 18px;">
                    <h1 style="margin:0 0 12px;color:#22160f;font-size:30px;line-height:1.15;font-weight:800;">${escapeHtml(title)}</h1>
                    <p style="margin:0;color:#5b4638;font-size:15px;line-height:1.8;">${intro}</p>
                    ${actionBlock}
                    <div style="color:#2f231b;font-size:14px;line-height:1.8;">
                      ${bodyHtml}
                    </div>
                    ${outroHtml ? `<div style="margin-top:24px;color:#5b4638;font-size:14px;line-height:1.8;">${outroHtml}</div>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 28px 28px;border-top:1px solid #efe4d8;background:#fffaf6;">
                    <p style="margin:0 0 8px;color:#7a6557;font-size:12px;line-height:1.7;">
                      This email was sent by ${escapeHtml(APP_NAME)}.
                    </p>
                    <p style="margin:0;color:#7a6557;font-size:12px;line-height:1.7;">
                      Need help? Reply to this email or contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#C5620B;text-decoration:none;">${escapeHtml(SUPPORT_EMAIL)}</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

async function sendEmail({ to, subject, text, html, direction, meta = {}, replyTo = EMAIL_USER }) {
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
      replyTo,
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

async function sendWelcomeNotification(user) {
  if (!user?.email) {
    return { skipped: true, reason: "missing-recipient" };
  }

  const html = emailShell({
    eyebrow: "Welcome",
    title: "Your account is ready",
    intro: `Hello ${escapeHtml(user.name || "there")}, welcome to ${escapeHtml(APP_NAME)}.`,
    bodyHtml: `
      <p style="margin:0 0 14px;">Your account has been created successfully and you can now explore our devices, services, and support channels with ease.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0 0;padding:18px;border-radius:18px;background:#fff7f0;border:1px solid #f0dfcf;">
        ${infoRow("Account email", user.email)}
        ${infoRow("Account name", user.name || "Not provided")}
      </table>
    `,
    ctaLabel: "Visit MultiAge",
    ctaUrl: CLIENT_URL,
    outroHtml: `We're glad to have you with us. If you have any questions, our team is ready to help.`,
  });

  return sendEmail({
    to: [user.email],
    subject: `Welcome to ${APP_NAME}`,
    text: `Hello ${user.name || "there"},\n\nYour account has been created successfully. You can now sign in and continue with ${APP_NAME}.\n\nVisit us: ${CLIENT_URL}`,
    html,
    direction: "company_to_user",
    meta: {
      userEmail: user.email,
      category: "welcome",
    },
  });
}

async function sendPasswordResetEmail({ user, resetLink, expiresInMinutes = 15 }) {
  if (!user?.email) {
    return { skipped: true, reason: "missing-recipient" };
  }

  const html = emailShell({
    eyebrow: "Password Reset",
    title: "Reset your password",
    intro: `Hello ${escapeHtml(user.name || "there")}, we received a request to reset your password.`,
    bodyHtml: `
      <p style="margin:0 0 14px;">Use the secure button below to create a new password for your account.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0 0;padding:18px;border-radius:18px;background:#fff7f0;border:1px solid #f0dfcf;">
        ${infoRow("Email", user.email)}
        ${infoRow("Link expires in", `${expiresInMinutes} minutes`)}
      </table>
      <p style="margin:18px 0 0;">If the button does not open, copy and paste this link into your browser:</p>
      <p style="margin:10px 0 0;word-break:break-word;color:#C5620B;">${escapeHtml(resetLink)}</p>
    `,
    ctaLabel: "Reset Password",
    ctaUrl: resetLink,
    outroHtml: `If you did not request this reset, you can safely ignore this email and your password will remain unchanged.`,
  });

  return sendEmail({
    to: [user.email],
    subject: `${APP_NAME} password reset request`,
    text: `Hello ${user.name || "there"},\n\nWe received a request to reset your password.\n\nReset your password here:\n${resetLink}\n\nThis link will expire in ${expiresInMinutes} minutes.\nIf you did not request this, you can ignore this email.`,
    html,
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

  const html = emailShell({
    eyebrow: "Security Notice",
    title: "Your password was changed",
    intro: `Hello ${escapeHtml(user.name || "there")}, this is a confirmation that your account password was changed successfully.`,
    bodyHtml: `
      <p style="margin:0 0 14px;">If you made this change, no further action is needed.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0 0;padding:18px;border-radius:18px;background:#fff7f0;border:1px solid #f0dfcf;">
        ${infoRow("Email", user.email)}
        ${infoRow("Changed at", new Date().toLocaleString())}
      </table>
    `,
    ctaLabel: "Contact Support",
    ctaUrl: `mailto:${SUPPORT_EMAIL}`,
    outroHtml: `If this was not you, contact support immediately so we can help secure your account.`,
  });

  return sendEmail({
    to: [user.email],
    subject: `${APP_NAME} password changed successfully`,
    text: `Hello ${user.name || "there"},\n\nYour password was changed successfully.\nIf this was not you, contact support immediately at ${SUPPORT_EMAIL}.`,
    html,
    direction: "company_to_user",
    meta: {
      userEmail: user.email,
      category: "password-changed",
    },
  });
}

async function sendUserRequestEmail(message) {
  const submittedAt = message.createdAt
    ? new Date(message.createdAt).toLocaleString()
    : new Date().toLocaleString();
  const requestType = message.kind === "used-device-inquiry" ? "Used Device Inquiry" : "Service Request";

  const html = emailShell({
    eyebrow: "New Lead",
    title: `New ${requestType}`,
    intro: `A new customer message has been submitted through ${escapeHtml(APP_NAME)}.`,
    bodyHtml: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:18px;border-radius:18px;background:#fff7f0;border:1px solid #f0dfcf;">
        ${infoRow("Name", message.name)}
        ${infoRow("Email", message.email)}
        ${infoRow("Phone", message.phone || "N/A")}
        ${infoRow("Service", message.service || "N/A")}
        ${infoRow("Request type", requestType)}
        ${infoRow("Device requested", message.deviceRequested || "N/A")}
        ${infoRow("Source", message.source || "website")}
        ${infoRow("Submitted at", submittedAt)}
      </table>
      <div style="margin-top:20px;padding:18px;border-radius:18px;background:#ffffff;border:1px solid #f0dfcf;">
        <div style="margin:0 0 8px;color:#8c7767;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Request details</div>
        <div style="color:#2f231b;font-size:14px;line-height:1.8;">${nl2br(message.message || "")}</div>
      </div>
    `,
    ctaLabel: "Open Admin Portal",
    ctaUrl: `${CLIENT_URL}/admin/messages`,
    outroHtml: `Use the admin communications workspace to review and respond quickly.`,
  });

  const text = `${requestType}\nName: ${message.name}\nEmail: ${message.email}\nPhone: ${message.phone || "N/A"}\nService: ${message.service || "N/A"}\nDevice Requested: ${message.deviceRequested || "N/A"}\nSource: ${message.source || "website"}\nSubmitted At: ${submittedAt}\n\nRequest Details:\n${message.message}`;

  return sendEmail({
    to: [COMPANY_EMAIL],
    subject: `[${APP_NAME}] New ${requestType}`,
    text,
    html,
    direction: "user_to_company",
    meta: {
      requestId: message._id ? String(message._id) : "",
      userEmail: message.email,
      category: "service-request",
    },
    replyTo: message.email || EMAIL_USER,
  });
}

async function sendAutoReplyEmail(message) {
  if (!message?.email) {
    return { skipped: true, reason: "missing-recipient" };
  }

  const requestType = message.kind === "used-device-inquiry" ? "Used Device Inquiry" : "Message";

  const html = emailShell({
    eyebrow: "We Received Your Message",
    title: "Thanks for reaching out",
    intro: `Hello ${escapeHtml(message.name || "there")}, thank you for contacting ${escapeHtml(APP_NAME)}.`,
    bodyHtml: `
      <p style="margin:0 0 14px;">Your message has been received successfully and our team will review it shortly.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:18px;border-radius:18px;background:#fff7f0;border:1px solid #f0dfcf;">
        ${infoRow("Request type", requestType)}
        ${infoRow("Service", message.service || "General inquiry")}
        ${infoRow("Phone", message.phone || "N/A")}
      </table>
      <div style="margin-top:20px;padding:18px;border-radius:18px;background:#ffffff;border:1px solid #f0dfcf;">
        <div style="margin:0 0 8px;color:#8c7767;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Your message</div>
        <div style="color:#2f231b;font-size:14px;line-height:1.8;">${nl2br(message.message || "")}</div>
      </div>
    `,
    ctaLabel: "Visit Our Website",
    ctaUrl: CLIENT_URL,
    outroHtml: `Our team typically responds during business hours. If your request is urgent, you can also reply directly to this email.`,
  });

  return sendEmail({
    to: [message.email],
    subject: `${APP_NAME} received your message`,
    text: `Hello ${message.name || "there"},\n\nThank you for contacting ${APP_NAME}. We have received your ${requestType.toLowerCase()} and will get back to you shortly.\n\nYour message:\n${message.message}\n\nRegards,\n${APP_NAME}`,
    html,
    direction: "company_to_user",
    meta: {
      requestId: message._id ? String(message._id) : "",
      userEmail: message.email,
      category: "contact-auto-reply",
    },
  });
}

async function sendReplyToUserEmail({ userEmail, message, adminName = "Admin" }) {
  const html = emailShell({
    eyebrow: "Support Reply",
    title: "Response from MultiAge Technologies",
    intro: `Hello, our team has replied to your recent request.`,
    bodyHtml: `
      <div style="padding:18px;border-radius:18px;background:#ffffff;border:1px solid #f0dfcf;color:#2f231b;font-size:14px;line-height:1.8;">
        ${nl2br(message)}
      </div>
    `,
    ctaLabel: "Reply to This Email",
    ctaUrl: `mailto:${SUPPORT_EMAIL}`,
    outroHtml: `Regards,<br />${escapeHtml(adminName)}<br />${escapeHtml(APP_NAME)}`,
  });

  return sendEmail({
    to: [userEmail],
    subject: `${APP_NAME} response to your request`,
    text: `Hello,\n\n${message}\n\nRegards,\n${adminName}\n${APP_NAME}`,
    html,
    direction: "company_to_user",
    meta: {
      userEmail,
      adminName,
      category: "admin-reply",
    },
  });
}

async function sendAdminNewOrderNotification(order, user) {
  const itemsText = (order.items || [])
    .map((item) => `- ${item.name} x${item.quantity} (GHS ${item.price})`)
    .join("\n");

  const html = emailShell({
    eyebrow: "New Order",
    title: "New order received",
    intro: `A new order has been placed on ${escapeHtml(APP_NAME)}.`,
    bodyHtml: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:18px;border-radius:18px;background:#fff7f0;border:1px solid #f0dfcf;">
        ${infoRow("Customer", user?.name || "Customer")}
        ${infoRow("Email", user?.email || "N/A")}
        ${infoRow("Order ID", order._id)}
        ${infoRow("Total", `GHS ${order.totalPrice}`)}
      </table>
      <div style="margin-top:20px;padding:18px;border-radius:18px;background:#ffffff;border:1px solid #f0dfcf;">
        <div style="margin:0 0 8px;color:#8c7767;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Items</div>
        <ul style="margin:0;padding-left:18px;color:#2f231b;line-height:1.8;">
          ${(order.items || []).map((item) => `<li>${escapeHtml(item.name)} x${escapeHtml(item.quantity)} (GHS ${escapeHtml(item.price)})</li>`).join("")}
        </ul>
      </div>
    `,
    ctaLabel: "Open Admin Portal",
    ctaUrl: `${CLIENT_URL}/admin/dashboard`,
  });

  return sendEmail({
    to: [COMPANY_EMAIL],
    subject: `[${APP_NAME}] New Order ${order._id}`,
    text: `A new order has been created.\nCustomer: ${user?.name || "Customer"}\nEmail: ${user?.email || "N/A"}\nOrder ID: ${order._id}\nTotal: GHS ${order.totalPrice}\n\n${itemsText}`,
    html,
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

  const adminHtml = emailShell({
    eyebrow: "Payment Confirmed",
    title: "Order payment confirmed",
    intro: `A payment has been confirmed for one of your orders.`,
    bodyHtml: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:18px;border-radius:18px;background:#fff7f0;border:1px solid #f0dfcf;">
        ${infoRow("Customer", user?.name || "Customer")}
        ${infoRow("Email", user?.email || "N/A")}
        ${infoRow("Order ID", order._id)}
        ${infoRow("Payment reference", paymentReference)}
        ${infoRow("Amount paid", `GHS ${order.totalPrice}`)}
      </table>
    `,
    ctaLabel: "Open Admin Portal",
    ctaUrl: `${CLIENT_URL}/admin/dashboard`,
  });

  jobs.push(sendEmail({
    to: [COMPANY_EMAIL],
    subject: `[${APP_NAME}] Payment Confirmed ${order._id}`,
    text: `Payment confirmed for order ${order._id}.\nCustomer: ${user?.name || "Customer"}\nEmail: ${user?.email || "N/A"}\nReference: ${paymentReference}\nAmount: GHS ${order.totalPrice}`,
    html: adminHtml,
    direction: "user_to_company",
    meta: {
      orderId: String(order._id),
      userEmail: user?.email || "",
      category: "payment-admin",
    },
  }));

  if (user?.email) {
    const userHtml = emailShell({
      eyebrow: "Payment Confirmed",
      title: "Your payment was confirmed",
      intro: `Hello ${escapeHtml(user.name || "Customer")}, your payment has been confirmed successfully.`,
      bodyHtml: `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:18px;border-radius:18px;background:#fff7f0;border:1px solid #f0dfcf;">
          ${infoRow("Order ID", order._id)}
          ${infoRow("Payment reference", paymentReference)}
          ${infoRow("Amount paid", `GHS ${order.totalPrice}`)}
        </table>
      `,
      ctaLabel: "View Your Orders",
      ctaUrl: `${CLIENT_URL}/my-orders`,
      outroHtml: `Thank you for choosing ${escapeHtml(APP_NAME)}.`,
    });

    jobs.push(sendEmail({
      to: [user.email],
      subject: `${APP_NAME} payment confirmed`,
      text: `Hello ${user.name || "Customer"}, your payment has been confirmed. Order ID: ${order._id}. Reference: ${paymentReference}. Total: GHS ${order.totalPrice}.`,
      html: userHtml,
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

module.exports = {
  COMPANY_EMAIL,
  EMAIL_USER,
  isEmailConfigured,
  sendEmail,
  sendUserRequestEmail,
  sendAutoReplyEmail,
  sendReplyToUserEmail,
  sendWelcomeNotification,
  sendAdminNewOrderNotification,
  sendPaidOrderConfirmation,
  sendPasswordResetEmail,
  sendPasswordChangedAlert,
};
