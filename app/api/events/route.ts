import { Resend } from 'resend';

export const runtime = 'nodejs';

type EmailReceivedEvent = Readonly<{
  type: string;
  data?: {
    email_id?: string;
    subject?: string;
    from?: string;
  };
}>;

const SERVICE_ERROR =
  'Sorry, something went wrong. Please try again later or use another contact method.';

const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export async function POST(request: Request) {
  let event: EmailReceivedEvent | null = null;
  try {
    event = (await request.json()) as EmailReceivedEvent;
  } catch {
    return Response.json({ error: 'Please provide valid contact details.' }, { status: 400 });
  }

  if (!event || event.type !== 'email.received' || !event.data?.email_id) {
    return Response.json({ ok: true });
  }

  const forwardTo = process.env.RESEND_FORWARD_TO ?? '';
  if (!forwardTo) {
    return Response.json({ ok: true, skipped: true });
  }

  const apiKey = process.env.RESEND_API_KEY ?? '';
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? '';
  if (!apiKey || !fromEmail) {
    return Response.json({ error: SERVICE_ERROR }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const receivingEmailResult = await resend.emails.receiving.get(event.data.email_id);
  const { data: email, error: emailError } = receivingEmailResult;

  if (emailError || !email) {
    return Response.json({ error: SERVICE_ERROR }, { status: 500 });
  }

  const attachmentsResult = await resend.emails.receiving.attachments.list({
    emailId: event.data.email_id,
  });
  const { data: attachmentsResponse } = attachmentsResult;

  const rawAttachments = attachmentsResponse?.data ?? [];
  const downloadResults = await Promise.all(
    rawAttachments.map(async (attachment) => {
      try {
        const response = await fetch(attachment.download_url);
        if (!response.ok) {
          return null;
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        return {
          content: buffer.toString('base64'),
          filename: attachment.filename ?? undefined,
          contentType: attachment.content_type,
          contentId: attachment.content_id,
        };
      } catch {
        return null;
      }
    }),
  );
  const forwardAttachments = downloadResults.filter((attachment) => isDefined(attachment));

  const emailSubject = email.subject ?? event.data.subject ?? 'Forwarded email';
  const html = email.html ?? undefined;
  const text =
    email.text ?? (email.from ? `Forwarded message from ${email.from}.` : 'Forwarded message.');
  const content = html ? { html } : { text };

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: forwardTo,
    replyTo: email.from ?? undefined,
    subject: emailSubject,
    attachments: forwardAttachments.length > 0 ? forwardAttachments : undefined,
    ...content,
  });

  if (error) {
    return Response.json({ error: SERVICE_ERROR }, { status: 500 });
  }

  return Response.json({ id: data?.id ?? null });
}
