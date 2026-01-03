'use client';

/* eslint-disable sonarjs/deprecation */
import { Check, Copy, Linkedin, Mail } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { ContactDetailItem } from '@/components/contact-detail-item';
import type { ContactEmail } from '@/lib/contact';
import { cn } from '@/lib/utils';

type ContactDetailsProps = Readonly<{
  email: ContactEmail;
  linkedinUrl: string;
  intro: string;
  className?: string;
}>;

const COPIED_RESET_MS = 2000;

export function ContactDetails({ email, linkedinUrl, intro, className }: ContactDetailsProps) {
  const decodedEmail = useMemo(() => atob(email.base64), [email.base64]);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => setHasCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(decodedEmail);
    setHasCopied(true);
  };

  const copyButtonClass =
    'border-border/60 text-foreground hover:bg-primary hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full border p-2 shadow-md transition-colors duration-200';

  return (
    <div className={cn('w-full space-y-4', className)}>
      <p className="text-muted-foreground text-xl leading-relaxed">{intro}</p>
      <div className="space-y-4">
        <ContactDetailItem label="Email" labelClassName="sr-only">
          <div className="flex flex-wrap items-center gap-3">
            <a
              aria-label={email.label}
              className="border-border/60 text-foreground hover:bg-primary hover:text-primary-foreground flex flex-1 items-center gap-2 rounded-full border px-4 py-2 text-base font-semibold tracking-tight transition-colors"
              href={`mailto:${decodedEmail}`}
            >
              <Mail className="h-5 w-5" />
              <span className="truncate">{decodedEmail}</span>
            </a>
            <button
              aria-label="Copy email to clipboard"
              className={copyButtonClass}
              type="button"
              onClick={handleCopy}
            >
              {hasCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </ContactDetailItem>

        <ContactDetailItem label="LinkedIn" labelClassName="sr-only">
          <a
            aria-label="LinkedIn profile"
            className="border-border/60 text-foreground hover:bg-primary hover:text-primary-foreground group inline-flex h-14 w-full items-center gap-3 rounded-full border px-5 text-lg font-semibold tracking-tight transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.3)]"
            href={linkedinUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Linkedin className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span>LinkedIn</span>
          </a>
        </ContactDetailItem>
      </div>
    </div>
  );
}
