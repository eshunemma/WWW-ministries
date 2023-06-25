import nodemailer from "nodemailer";

export const sendEmail = (template: string, to: string, subject: string) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    // service: "gmail",
    auth: {
      user: "28333fa25d7714",
      pass: "bd4712bdf1d758",
    },

    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `WorldWide Word Ministries <${process.env.USER_EMAIL}>`,
    to,
    subject,
    html: template,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return error;
    } else {
      return "Email sent";
    }
  });
};
