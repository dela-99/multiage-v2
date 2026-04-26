const { sendReplyToUserEmail } = require("../services/emailService");

const replyToUserEmail = async (req, res, next) => {
  try {
    const { userEmail, message } = req.body;

    if (!userEmail || !message) {
      return res.status(400).json({ message: "userEmail and message are required" });
    }

    const result = await sendReplyToUserEmail({
      userEmail,
      message,
      adminName: req.user?.name || "Admin",
    });

    return res.status(200).json({
      message: "Reply email sent successfully",
      accepted: result.accepted || [],
      rejected: result.rejected || [],
      messageId: result.messageId || "",
    });
  } catch (error) {
    console.error("Admin reply email failed:", error.message);
    next(error);
  }
};

module.exports = { replyToUserEmail };
