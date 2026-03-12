type SendSubmissionEmailParams = {
  submissionId: string;
  itemDescription: string;
  pickupLocation: string;
  contactDetails: string;
  signedImageUrls: string[];
};

export async function sendSubmissionEmail(params: SendSubmissionEmailParams) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const toEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const baseUrl = process.env.APP_BASE_URL;

  if (!apiKey || !fromEmail || !toEmail || !baseUrl) {
    return; // Skip when not configured
  }

  const adminDetailUrl = `${baseUrl}/admin/${params.submissionId}`;

  const body = {
    personalizations: [{ to: [{ email: toEmail }] }],
    from: { email: fromEmail, name: "Junk Quote" },
    subject: `New Junk Quote Request #${params.submissionId.slice(0, 8)}`,
    content: [
      {
        type: "text/html",
        value: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif; line-height:1.6; color:#333;">
  <h2>New Junk Quote Request</h2>
  <p><strong>Submission ID:</strong> ${params.submissionId}</p>
  <p><strong>Item Description:</strong></p>
  <p>${escapeHtml(params.itemDescription)}</p>
  <p><strong>Pickup Location:</strong></p>
  <p>${escapeHtml(params.pickupLocation)}</p>
  <p><strong>Contact Details:</strong></p>
  <p>${escapeHtml(params.contactDetails)}</p>
  <p><strong>Image(s):</strong> ${params.signedImageUrls.length === 0 ? "—" : params.signedImageUrls.map((url, i) => `<a href="${url}">View image ${i + 1}</a>`).join(" | ")}</p>
  <p><a href="${adminDetailUrl}" style="display:inline-block; padding:10px 20px; background:#16a34a; color:white; text-decoration:none; border-radius:6px;">Open in Admin</a></p>
</body>
</html>`,
      },
    ],
  };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("SendGrid error:", res.status, errText);
    throw new Error(`Failed to send email: ${res.status}`);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
