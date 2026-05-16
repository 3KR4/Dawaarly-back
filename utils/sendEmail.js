const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendVerificationEmail = async (to, code) => {
  try {
    await resend.emails.send({
      from: `"Dawaarly" <no-reply@dawaarly.com>`,
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

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px;">
    <tr>
      <td align="center">

        <table width="500" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:12px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td align="center"
              style="padding:10px; background:#fafafa;">

              <img
                src="https://www.dawaarly.com/logo.png"
                alt="Dawaarly"
                width="120"
                style="display:block;"
              />

              <h2 style="margin-top:15px; color:#333;">
                Verify Your Email
              </h2>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:15px; text-align:center;">

              <p style="font-size:16px; color:#333;">
                Thanks for signing up 👋
              </p>

              <p style="font-size:15px; color:#666;">
                Use the verification code below
                to complete your registration.
              </p>

              <div style="margin:25px 0;">
                <span
                  style="
                    display:inline-block;
                    background:#f1ebff;
                    color:#8f59f2;
                    font-size:32px;
                    letter-spacing:5px;
                    padding:10px 28px;
                    border-radius:8px;
                    font-weight:bold;
                  "
                >
                  ${code}
                </span>
              </div>

              <p style="font-size:13px; color:#999;">
                This code will expire in 10 minutes.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              style="
                background:#fafafa;
                padding:20px;
                text-align:center;
                font-size:12px;
                color:#999;
              "
            >
              If you didn’t request this email,
              you can safely ignore it.
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

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
