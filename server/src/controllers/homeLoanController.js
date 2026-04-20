import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export const submitHomeLoan = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      loanType,
      amount,
      callbackTime,
    } = req.body;

    // ✅ Validation
    if (!name || !email || !phone || !loanType || !callbackTime) {
      return res.status(400).json({
        error: "Name, email, phone, loan type, and callback time are required",
      });
    }
    const sentFrom = new Sender(
        process.env.FROM_EMAIL, "Brickstone"
    );
    const admin = [new Recipient(process.env.ADMIN_EMAIL)];
    const adminEmail = new EmailParams()
      .setFrom(sentFrom)
      .setTo(admin)
      .setSubject("New Home Loan Inquiry")
      .setHtml(`
        <h2>New Home Loan Inquiry</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>

        <hr/>

        <p><b>Loan Type:</b> ${loanType}</p>
        <p><b>Estimated Loan Amount:</b> ${amount || "Not specified"}</p>
        <p><b>Preferred Callback Time:</b> ${callbackTime}</p>
      `);
    await mailerSend.email.send(adminEmail);

    res.status(200).json({
      success: true,
      message: "Home loan inquiry sent successfully",
    });

  } catch (error) {
    console.error("MailerSend Error:", error);
    res.status(500).json({
      error: "Failed to send inquiry",
    });
  }
};