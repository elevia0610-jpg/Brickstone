import { sendEmail } from "../utils/sendEmail.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message, reasonToBuy, isDealer, interests } =
      req.body;

    if (!name || !email || !phone || !message || !reasonToBuy || !isDealer) {
      return res.status(400).json({
        error:
          "Name, email, phone, message, reason to buy, and dealer status are required",
      });
    }

    await sendEmail({
      name,
      email,
      phone,
      message,
      reasonToBuy,
      isDealer,
      interests: Array.isArray(interests) ? interests : [],
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};