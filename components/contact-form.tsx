'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

type FormState = Readonly<{
  status: FormStatus;
  message: string;
}>;

const INITIAL_STATE: FormState = { status: 'idle', message: '' };
export function ContactForm() {
  const [state, setState] = useState<FormState>(INITIAL_STATE);

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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({}))) as { error?: string };
        const message = errorBody.error ?? 'Something went wrong. Please try again.';
        setState({ status: 'error', message });
        toast.error(message);
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
      aria-busy={state.status === 'sending'}
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
        <Button className="group gap-0" disabled={state.status === 'sending'} type="submit">
          {state.status === 'sending' ? 'Sending...' : 'Send message'}
          <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:max-w-[1rem] group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </form>
  );
}
