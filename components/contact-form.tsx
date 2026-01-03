'use client';

import { ArrowUpRight, Check, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

type FormState = Readonly<{
  status: FormStatus;
  message: string;
}>;

type ContactPayload = Readonly<{
  name: string;
  email: string;
  subject: string;
  message: string;
}>;

const INITIAL_STATE: FormState = { status: 'idle', message: '' };

const submitContact = async (payload: ContactPayload) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return { ok: true as const };
  }

  const errorBody = (await response.json().catch(() => ({}))) as { error?: string };
  return {
    ok: false as const,
    message: errorBody.error ?? 'Something went wrong. Please try again.',
  };
};

export function ContactForm() {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const isSending = state.status === 'sending';
  const isSuccess = state.status === 'success';
  const isError = state.status === 'error';
  const buttonLabel = (() => {
    switch (state.status) {
      case 'sending': {
        return 'Sending...';
      }
      case 'success': {
        return 'Sent';
      }
      case 'error': {
        return 'Try again';
      }
      default: {
        return 'Send message';
      }
    }
  })();

  const buttonIcon = (() => {
    if (isSending) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (isSuccess) {
      return <Check className="h-4 w-4" />;
    }
    if (isError) {
      return <X className="h-4 w-4" />;
    }
    return (
      <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:max-w-[1rem] group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    );
  })();

  useEffect(() => {
    if (state.status !== 'success' && state.status !== 'error') {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      setState(INITIAL_STATE);
    }, 3000);

    return () => globalThis.clearTimeout(timeoutId);
  }, [state.status]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      subject: String(data.get('subject') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };

    setState({ status: 'sending', message: '' });

    try {
      const result = await submitContact(payload);
      if (!result.ok) {
        setState({ status: 'error', message: result.message });
        toast.error(result.message);
        return;
      }

      form.reset();
      setState({ status: 'success', message: 'Message sent successfully.' });
      toast.success('Message sent.');
    } catch {
      const message = 'Network error. Please try again.';
      setState({ status: 'error', message });
      toast.error(message);
    }
  };

  return (
    <form
      aria-busy={isSending}
      className="border-border/70 bg-card/90 w-full space-y-4 rounded-2xl border p-4 shadow-sm md:max-w-[520px] md:justify-self-start lg:max-w-[560px]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            required
            autoComplete="name"
            id="contact-name"
            name="name"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            required
            autoComplete="email"
            id="contact-email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input required id="contact-subject" name="subject" placeholder="Let's collaborate" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          required
          id="contact-message"
          name="message"
          placeholder="Tell me about your idea."
          rows={6}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          className={cn(
            'group gap-2 transition-all duration-300',
            isError && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            isSuccess && 'bg-primary text-primary-foreground',
            (isSuccess || isError) && 'shadow-md shadow-black/10',
            isSuccess && 'scale-[1.02]',
          )}
          disabled={isSending}
          type="submit"
        >
          {buttonLabel}
          <span className="inline-flex items-center">{buttonIcon}</span>
        </Button>
      </div>
    </form>
  );
}
