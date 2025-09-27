import nodemailer from 'nodemailer';

/**
 * EmailService - Handles email sending for authentication features
 * Implements secure email delivery with proper error handling
 */
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter with SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send email verification link
   */
  async sendVerificationEmail(email: string, token: string, userName: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"Milos Shop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verifica tu cuenta - Milos Shop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Bienvenido a Milos Shop, ${userName}!</h2>
          <p>Gracias por registrarte. Para completar tu registro, por favor verifica tu dirección de email haciendo clic en el siguiente enlace:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verificar Email</a>
          </div>
          <p>Este enlace expirará en 24 horas.</p>
          <p>Si no solicitaste esta verificación, puedes ignorar este email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Milos Shop - Servicio de Lavado Automotriz</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ EmailService: Verification email sent to:', email);
    } catch (error) {
      console.error('❌ EmailService: Failed to send verification email:', error);
      throw new Error('Error al enviar email de verificación');
    }
  }

  /**
   * Send password reset link
   */
  async sendPasswordResetEmail(email: string, token: string, userName: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Milos Shop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Restablecer Contraseña - Milos Shop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Restablecer Contraseña</h2>
          <p>Hola ${userName},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer Contraseña</a>
          </div>
          <p>Este enlace expirará en 1 hora por razones de seguridad.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña permanecerá sin cambios.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Milos Shop - Servicio de Lavado Automotriz</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ EmailService: Password reset email sent to:', email);
    } catch (error) {
      console.error('❌ EmailService: Failed to send password reset email:', error);
      throw new Error('Error al enviar email de restablecimiento');
    }
  }

  /**
   * Send MFA code via SMS (placeholder - would integrate with SMS service)
   */
  async sendMFACode(phone: string, code: string): Promise<void> {
    // This is a placeholder for SMS integration
    // In production, integrate with services like Twilio, AWS SNS, etc.
    console.log(`📱 MFA Code for ${phone}: ${code}`);

    // For now, we'll just log it. In production, send actual SMS
    // Example with Twilio:
    // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await twilio.messages.create({
    //   body: `Tu código MFA es: ${code}`,
    //   from: process.env.TWILIO_PHONE,
    //   to: phone
    // });
  }
}

export const emailService = new EmailService();