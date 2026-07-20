import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@example.com';
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || '';

function createTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body || {};

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.warn('SMTP not configured - cannot send contact email');
      return NextResponse.json({ error: 'SMTP not configured on server' }, { status: 500 });
    }

    const to = TO_EMAIL || FROM_EMAIL;
    const mailText = `Contact form submission

From: ${name} <${email}>
Subject: ${subject}

${message}`;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `Contact form: ${subject}`,
      text: mailText,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
