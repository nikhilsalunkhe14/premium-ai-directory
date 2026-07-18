import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@example.com";

function createTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendSubmissionStatusEmail(email: string, toolName: string, approved: boolean) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP is not configured, skipping submission status email.");
    return;
  }
  const subject = approved
    ? "Your tool submission has been approved"
    : "Your tool submission has been rejected";

  const message = approved
    ? `Hi,

Your submission for "${toolName}" has been approved. Thank you for contributing! The tool is now published in our directory.

Best,
The Team`
    : `Hi,

We reviewed your submission for "${toolName}" and unfortunately it was not approved at this time.

Best,
The Team`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject,
    text: message,
  });
}
