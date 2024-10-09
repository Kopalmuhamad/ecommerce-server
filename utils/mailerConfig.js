const mailerConfig = {
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  secure: process.env.SMTP_PORT === "465", // Menggunakan true jika secure port 465
  auth: {
    user: process.env.SMTP_USER || "f870ec47df332a", // User dari konfigurasi SMTP
    pass: process.env.SMTP_PASS || "e7c0f8d8c568d5", // Password dari konfigurasi SMTP
  },
};

export default mailerConfig;
