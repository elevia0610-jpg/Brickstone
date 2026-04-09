import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export const sendEmail = async ({
  name,
  email,
  phone,
  message,
  reasonToBuy,
  isDealer,
  interests = [],
}) => {
  const sentFrom = new Sender(process.env.FROM_EMAIL, "Brickstone");

  const recipients = [
    new Recipient(process.env.ADMIN_EMAIL, "Admin"),
  ];

  const interestsText =
    interests.length > 0 ? interests.join(", ") : "—";

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("New Contact Form Submission")
    .setHtml(`
      <h2>New Inquiry Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Reason to Buy:</strong> ${reasonToBuy}</p>
      <p><strong>Dealer:</strong> ${isDealer}</p>
      <p><strong>Interests:</strong> ${interestsText}</p>
      <p><strong>Message:</strong> ${message}</p>
    `)
    .setText(`
      New Inquiry Received

      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Reason to Buy: ${reasonToBuy}
      Dealer: ${isDealer}
      Interests: ${interestsText}
      Message: ${message}
    `);

  await mailerSend.email.send(emailParams);
};