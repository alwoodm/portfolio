import fs from 'node:fs/promises';
import path from 'node:path';

import { ArrowUpRight, Mail } from 'lucide-react';

import AnimatedContent from '@/components/animation/animated-content';
import { ContactDetails } from '@/components/contact-details';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ContactContent } from '@/lib/contact';
import type { HomeContent } from '@/lib/home';

async function getContactContent(): Promise<ContactContent> {
  const filePath = path.join(process.cwd(), 'data', 'contact.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as ContactContent;
}

async function getHomeContent(): Promise<HomeContent> {
  const filePath = path.join(process.cwd(), 'data', 'home.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as HomeContent;
}

export default async function ContactPage() {
  const [contact, home] = await Promise.all([getContactContent(), getHomeContent()]);

  return (
    <main className="w-full px-6 pt-8 pb-16 sm:px-10 lg:pb-20">
      <div className="mx-auto w-full space-y-10 sm:space-y-12 md:w-[70%]">
        <section className="w-full">
          <AnimatedContent animateOpacity className="w-full" distance={32} duration={0.9}>
            <div className="flex flex-col items-start gap-4 text-left">
              <Badge className="gap-1.5" variant="secondary">
                <Mail className="h-4 w-4" />
                {contact.badge}
              </Badge>
              <h1 className="text-primary text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
                {contact.title}
              </h1>
            </div>
          </AnimatedContent>
        </section>

        <section className="grid w-full items-start gap-8 md:grid-cols-[minmax(0,1fr)_260px] lg:grid-cols-[minmax(0,1fr)_320px]">
          <AnimatedContent animateOpacity className="w-full" distance={40} duration={0.9}>
            <form className="border-border/70 bg-card/90 w-full space-y-4 rounded-2xl border p-4 shadow-sm md:max-w-[520px] md:justify-self-start lg:max-w-[560px]">
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
                <Input
                  required
                  id="contact-subject"
                  name="subject"
                  placeholder="Let's collaborate"
                />
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
              <Button className="group gap-0" type="submit">
                Send message
                <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:max-w-[1rem] group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Button>
            </form>
          </AnimatedContent>

          <AnimatedContent
            animateOpacity
            className="w-full"
            delay={0.1}
            direction="vertical"
            distance={40}
            duration={0.9}
          >
            <ContactDetails
              email={contact.email}
              intro={contact.detailsIntro}
              linkedinUrl={home.social.linkedin}
            />
          </AnimatedContent>
        </section>
      </div>
    </main>
  );
}
