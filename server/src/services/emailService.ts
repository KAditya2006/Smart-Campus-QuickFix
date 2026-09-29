import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const mailOptions = {
      from: `"Smart Campus QuickFix" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] Sent email to ${to}`);
  } catch (error) {
    console.error(`[EMAIL SERVICE] Error sending email to ${to}:`, error);
  }
};
