import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetEmail({ to, token, userId }) {
  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontend}/auth/reset-password?token=${token}&id=${userId}`;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject: "Password reset",
    text: `You requested a password reset. Use this link to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <p><a href="${resetUrl}">Reset password</a></p>
           <p>If you didn't request this, ignore this email.</p>`,
  };

  return transporter.sendMail(mailOptions);
}
