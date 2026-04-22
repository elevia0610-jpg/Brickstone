import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export const submitBuildDesign = async (req, res) => {
  try {
    const { name, phone, city, plotSize, budget, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: "Name and phone are required",
      });
    }

    const sentFrom = new Sender(
      process.env.FROM_EMAIL, "Brickstone"
    );

    const admin = [new Recipient(process.env.ADMIN_EMAIL)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(admin)
      .setSubject("New Build & Design Inquiry")
      .setHtml(`
        <h2>Build & Design Inquiry</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>City:</b> ${city || "-"}</p>
        <p><b>Plot Size:</b> ${plotSize || "-"}</p>
        <p><b>Budget:</b> ${budget || "-"}</p>
        <p><b>Message:</b> ${message || "-"}</p>
      `);

    await mailerSend.email.send(emailParams);

    res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to send inquiry",
    });
  }
};