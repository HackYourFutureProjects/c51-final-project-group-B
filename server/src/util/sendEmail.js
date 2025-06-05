import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text,
  });
};

export default sendEmail;
