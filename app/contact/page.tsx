import fs from 'node:fs/promises';
import path from 'node:path';

import { Mail } from 'lucide-react';

import AnimatedContent from '@/components/animation/animated-content';
import { ContactDetails } from '@/components/contact-details';
import { ContactForm } from '@/components/contact-form';
import { Badge } from '@/components/ui/badge';
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
            <ContactForm />
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
