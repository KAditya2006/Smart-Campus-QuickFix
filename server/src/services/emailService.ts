import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const fromName = process.env.EMAIL_FROM_NAME || 'Smart Campus QuickFix';
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject,
      text,
    });

    if (error) {
      console.error(`[EMAIL SERVICE] Provider error sending email to ${to}:`, error);
      throw new Error(error.message);
    }
    
    // Kept for basic internal logging, but sanitized. No raw details exposed.
    console.log(`[EMAIL SERVICE] Successfully sent email to ${to}`);
  } catch (err: any) {
    console.error(`[EMAIL SERVICE] Exception sending email to ${to}:`, err);
    throw new Error('Email delivery failed');
  }
};
