const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (to, code) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your email",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px; ">
    <tr>
      <td align="center">

        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:15px; padding-bottom: 9px; background-color:#fafafa;">
              <img src="https://www.dawaarly.com/logo.png" alt="Brand Logo" width="120" style="display:block; margin-bottom:0px;" />
              <h2 style="color:#333; margin:0;">Verify Your Email</h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:15px; padding-top: 0; text-align:center;">
              <p style="font-size:16px; color:#333;">Thanks for signing up 👋</p>
              <p style="font-size:15px; color:#666;">
                Use the verification code below to complete your registration.
              </p>

              <div style="margin:18px 0;">
                <span style="display:inline-block; background:#f1ebff; color:#8f59f2; font-size:32px; letter-spacing:5px; padding:6px 26px; border-radius:8px; font-weight:bold;">
                  ${code}
                </span>
              </div>

              <p style="font-size:13px; color:#999; margin: 2px;">
                This code will expire in 10 minutes.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa; padding:20px; text-align:center; font-size:12px; color:#999;">
              If you didn’t request this, you can safely ignore this email.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};
