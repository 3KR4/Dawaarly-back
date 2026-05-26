const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "no-reply@dawaarly.com";

exports.sendVerificationEmail = async (to, code) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const { data, error } = await resend.emails.send({
    from: `"Dawaarly" <${fromEmail}>`,
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

  if (error) {
    throw new Error(error.message || "Failed to send verification email");
  }

  return data;
};

exports.sendPendingAdReviewEmail = async ({
  to,
  adTitle,
  adId,
  tableId,
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const appUrl = process.env.FRONTEND_URL || process.env.BASE_URL || "https://dawaarly.com";
  const reviewUrl = `${appUrl.replace(/\/$/, "")}/dashboard/ads/form?dep=${tableId}&id=${adId}`;
  const safeTitle = adTitle || `Ad #${adId}`;

  const { data, error } = await resend.emails.send({
    from: `"Dawaarly" <${fromEmail}>`,
    to,
    subject: "New ad is waiting for review",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>New Pending Ad</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden;">
                <tr>
                  <td align="center" style="padding:18px; background:#fafafa;">
                    <img src="https://www.dawaarly.com/logo.png" alt="Dawaarly" width="110" style="display:block;" />
                    <h2 style="margin:14px 0 0; color:#333;">New ad waiting for review</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding:22px; text-align:center;">
                    <p style="font-size:16px; color:#333; margin:0 0 10px;">
                      A new ad has been submitted and is pending your review.
                    </p>
                    <p style="font-size:15px; color:#666; margin:0 0 24px;">
                      ${safeTitle}
                    </p>
                    <a href="${reviewUrl}" style="display:inline-block; background:#8f59f2; color:#fff; text-decoration:none; padding:12px 22px; border-radius:8px; font-weight:bold;">
                      Open ad review
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background:#fafafa; padding:16px; text-align:center; font-size:12px; color:#999;">
                    Dawaarly admin notification
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

  if (error) {
    throw new Error(error.message || "Failed to send pending ad email");
  }

  return data;
};

exports.sendAdStatusDecisionEmail = async ({
  to,
  adTitle,
  status,
  reason,
  changedAt,
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const safeTitle = adTitle || "Your ad";
  const isAccepted = status === "ACTIVE";
  const decisionText = isAccepted ? "accepted and published" : "rejected";
  const changedAtText = new Date(changedAt || Date.now()).toLocaleString("en-GB", {
    timeZone: "Africa/Cairo",
  });

  const { data, error } = await resend.emails.send({
    from: `"Dawaarly" <${fromEmail}>`,
    to,
    subject: `Your ad has been ${isAccepted ? "accepted" : "rejected"}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Ad status update</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden;">
                <tr>
                  <td align="center" style="padding:18px; background:#fafafa;">
                    <img src="https://www.dawaarly.com/logo.png" alt="Dawaarly" width="110" style="display:block;" />
                    <h2 style="margin:14px 0 0; color:#333;">Ad status update</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding:22px; text-align:center;">
                    <p style="font-size:16px; color:#333; margin:0 0 10px;">
                      Your ad <strong>${safeTitle}</strong> has been ${decisionText}.
                    </p>
                    <p style="font-size:14px; color:#666; margin:0 0 12px;">
                      Decision time: ${changedAtText}
                    </p>
                    ${
                      !isAccepted && reason
                        ? `<p style="font-size:14px; color:#666; margin:0; background:#fff4f4; padding:12px; border-radius:8px;">Reject reason: ${reason}</p>`
                        : ""
                    }
                  </td>
                </tr>
                <tr>
                  <td style="background:#fafafa; padding:16px; text-align:center; font-size:12px; color:#999;">
                    Dawaarly notification
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

  if (error) {
    throw new Error(error.message || "Failed to send ad status email");
  }

  return data;
};
