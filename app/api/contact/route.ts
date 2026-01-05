import { Resend } from 'resend';

type ContactPayload = Readonly<{
  name: string;
  email: string;
  subject: string;
  message: string;
}>;

const SERVICE_ERROR =
  'Sorry, something went wrong. Please try again later or use another contact method.';

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

function isValidPayload(payload: ContactPayload) {
  return (
    payload.name.length > 0 &&
    payload.email.length > 0 &&
    payload.subject.length > 0 &&
    payload.message.length > 0
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY ?? '';
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? '';
  const toEmail = process.env.RESEND_FORWARD_TO || fromEmail;

  if (!apiKey || !fromEmail) {
    return Response.json({ error: SERVICE_ERROR }, { status: 500 });
  }

  let payload: ContactPayload | null = null;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: 'Please provide valid contact details.' }, { status: 400 });
  }

  if (!payload || !isValidPayload(payload)) {
    return Response.json({ error: 'Please provide valid contact details.' }, { status: 400 });
  }

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = escapeHtml(payload.message).replaceAll('\n', '<br />');

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: payload.email,
    subject: `${payload.subject}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="margin: 0 0 12px; font-size: 20px;">New contact message</h2>
        <p style="margin: 0 0 16px; color: #475569;">
          You received a new message from the portfolio contact form.
        </p>
        <div
          style="
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 16px;
            background: #f8fafc;
          "
        >
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin: 0;"><strong>Subject:</strong> ${safeSubject}</p>
        </div>
        <div style="margin-top: 16px;">
          <p style="margin: 0 0 8px;"><strong>Message</strong></p>
          <p style="margin: 0; color: #1e293b;">${safeMessage}</p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('[contact] send failed', error);
    return Response.json({ error: SERVICE_ERROR }, { status: 500 });
  }

  console.warn('[contact] sent message', {
    id: data?.id ?? null,
    replyTo: payload.email,
  });

  return Response.json({ id: data?.id ?? null });
}
