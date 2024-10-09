import nodemailer from "nodemailer";
import mailerConfig from "./mailerConfig.js";

const sendEmail = async ({ to, subject, html }) => {
  // Membuat transport menggunakan konfigurasi mailerConfig
  const transporter = nodemailer.createTransport(mailerConfig);

  try {
    // Mengirim email menggunakan konfigurasi transporter
    await transporter.sendMail({
      from: '"Your Admin" <admin@example.com>', // Alamat pengirim
      to, // Daftar penerima
      subject, // Subjek email
      html, // Isi HTML dari email
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
