import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const fromUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const mailOptions = {
      from: `"Smart Campus QuickFix" <${fromUser}>`,
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] Sent email to ${to}`);
  } catch (error) {
    console.error(`[EMAIL SERVICE] Error sending email to ${to}:`, error);
    throw error;
  }
};
