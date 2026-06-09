import nodemailer, { Transporter } from 'nodemailer';
import env from '../configs/env.config';
import { IEmailService } from './interfaces/email.service.interface';

const transporter: Transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const emailService: IEmailService = {
  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:32px 40px;text-align:center;">
                      <div style="display:inline-block;width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:12px;line-height:48px;font-size:24px;font-weight:bold;color:#fff;margin-bottom:12px;">B</div>
                      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">BookMyVenue</h1>
                      <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Email Verification</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;">Hello,</p>
                      <p style="margin:0 0 28px;color:#e2e8f0;font-size:15px;line-height:1.6;">
                        Use the one-time password below to verify your email address. This code expires in <strong style="color:#f87171;">5 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="background:#0f172a;border:2px dashed #dc2626;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                        <p style="margin:0 0 6px;color:#64748b;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Your OTP Code</p>
                        <p style="margin:0;color:#fff;font-size:40px;font-weight:800;letter-spacing:16px;">${otp}</p>
                      </div>

                      <p style="margin:0 0 6px;color:#64748b;font-size:13px;">If you did not create an account, you can safely ignore this email.</p>
                      <p style="margin:0;color:#64748b;font-size:13px;">Do not share this code with anyone.</p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background:#0f172a;padding:20px 40px;text-align:center;border-top:1px solid #1e293b;">
                      <p style="margin:0;color:#475569;font-size:12px;">© ${new Date().getFullYear()} BookMyVenue. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject: 'Your BookMyVenue OTP Code',
      html,
    });
  },
};
