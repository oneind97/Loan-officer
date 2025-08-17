import nodemailer from 'nodemailer';
import type { Lead, ContactForm } from '@shared/schema';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

export class EmailService {
  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@eddielending.com',
        to,
        subject,
        html,
      });
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async notifyNewLead(lead: Lead) {
    const eddieEmail = process.env.EDDIE_EMAIL || 'eddie@example.com';
    
    const subject = `New Mortgage Lead: ${lead.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">New Mortgage Lead Received</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Loan Details</h3>
          <p><strong>Loan Type:</strong> ${lead.loanType}</p>
          <p><strong>Purpose:</strong> ${lead.purpose}</p>
          <p><strong>Credit Score:</strong> ${lead.creditScore}</p>
          <p><strong>Timeline:</strong> ${lead.timeline}</p>
        </div>
        
        ${lead.message ? `
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
            <p>${lead.message}</p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.ADMIN_URL || 'https://your-domain.com'}/admin" 
             style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Dashboard
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; text-align: center;">
          Received on ${new Date(lead.createdAt!).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    `;

    await this.sendEmail(eddieEmail, subject, html);
  }

  async notifyNewContact(contact: ContactForm) {
    const eddieEmail = process.env.EDDIE_EMAIL || 'eddie@example.com';
    
    const subject = `New Contact Form: ${contact.subject || 'General Inquiry'}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">New Contact Form Submission</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
          ${contact.phone ? `<p><strong>Phone:</strong> <a href="tel:${contact.phone}">${contact.phone}</a></p>` : ''}
          ${contact.subject ? `<p><strong>Subject:</strong> ${contact.subject}</p>` : ''}
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
          <p>${contact.message}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.ADMIN_URL || 'https://your-domain.com'}/admin" 
             style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Dashboard
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; text-align: center;">
          Received on ${new Date(contact.createdAt!).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    `;

    await this.sendEmail(eddieEmail, subject, html);
  }

  async sendLeadConfirmation(lead: Lead) {
    const subject = 'Thank you for your mortgage inquiry - Eddie Hernandez';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Thank You for Your Mortgage Inquiry</h2>
        
        <p>Dear ${lead.name},</p>
        
        <p>Thank you for reaching out about your mortgage needs. I've received your inquiry and will be in touch within 24 hours to discuss your ${lead.loanType} loan options.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">What's Next?</h3>
          <ul style="color: #475569;">
            <li>I'll review your information and prepare personalized loan options</li>
            <li>We'll schedule a call to discuss your goals and timeline</li>
            <li>I'll guide you through the pre-approval process step by step</li>
          </ul>
        </div>
        
        <p>In the meantime, feel free to call me directly at <strong>(210) 000-0000</strong> if you have any immediate questions.</p>
        
        <p>Best regards,<br>
        <strong>Eddie Hernandez</strong><br>
        Loan Officer • NMLS #XXXXX<br>
        <a href="mailto:eddie@example.com">eddie@example.com</a><br>
        (210) 000-0000</p>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          Equal Housing Lender. NMLS Consumer Access.
        </p>
      </div>
    `;

    await this.sendEmail(lead.email, subject, html);
  }
}

export const emailService = new EmailService();
