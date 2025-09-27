import axios from 'axios';

/**
 * CaptchaService - Handles CAPTCHA verification using Google reCAPTCHA v3
 */
export class CaptchaService {
  private static readonly RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || 'your-secret-key-here';
  private static readonly RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

  /**
   * Verify reCAPTCHA token
   * @param token The reCAPTCHA token from the client
   * @param remoteIp Optional remote IP address
   * @returns Promise<boolean> True if verification passes
   */
  static async verifyToken(token: string, remoteIp?: string): Promise<boolean> {
    try {
      console.log('🔐 CaptchaService: Verifying reCAPTCHA token');

      const response = await axios.post(this.RECAPTCHA_VERIFY_URL, null, {
        params: {
          secret: this.RECAPTCHA_SECRET_KEY,
          response: token,
          remoteip: remoteIp,
        },
        timeout: 10000, // 10 second timeout
      });

      const { success, score, 'error-codes': errorCodes } = response.data;

      if (!success) {
        console.log('❌ CaptchaService: reCAPTCHA verification failed:', errorCodes);
        return false;
      }

      // For reCAPTCHA v3, check the score (0.0 - 1.0)
      // Typically, scores >= 0.5 are considered valid
      if (score !== undefined && score < 0.5) {
        console.log('❌ CaptchaService: reCAPTCHA score too low:', score);
        return false;
      }

      console.log('✅ CaptchaService: reCAPTCHA verification successful, score:', score);
      return true;

    } catch (error) {
      console.error('❌ CaptchaService: Error verifying reCAPTCHA:', error);
      // In production, you might want to fail closed (return false)
      // For development, you might want to allow if reCAPTCHA is not configured
      return process.env.NODE_ENV === 'development' && !this.RECAPTCHA_SECRET_KEY;
    }
  }

  /**
   * Check if CAPTCHA is required for the current environment
   */
  static isRequired(): boolean {
    return !!this.RECAPTCHA_SECRET_KEY && this.RECAPTCHA_SECRET_KEY !== 'your-secret-key-here';
  }
}

export const captchaService = new CaptchaService();