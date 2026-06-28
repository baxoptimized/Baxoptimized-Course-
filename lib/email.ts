import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  toEmail: string,
  setPasswordUrl: string
): Promise<void> {
  await resend.emails.send({
    from: "Baxoptimized <onboarding@resend.dev>",
    to: toEmail,
    subject: "Welcome to Baxoptimized — set your password to get started",
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:40px 48px 0;text-align:center;">
              <p style="margin:0 0 24px;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#c9a84c;">
                Baxoptimized
              </p>
              <h1 style="margin:0 0 16px;font-size:26px;font-weight:700;color:#f0f4ff;">
                Your purchase is confirmed
              </h1>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#94a3b8;">
                Click the button below to set your password and access the full course.
                This link expires in 24 hours.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 48px 40px;text-align:center;">
              <a href="${setPasswordUrl}"
                 style="display:inline-block;padding:14px 36px;background:#c9a84c;color:#0a0f1e;font-size:15px;font-weight:700;border-radius:8px;text-decoration:none;">
                Set Your Password
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #1e2d47;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                If you didn't purchase this course, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
