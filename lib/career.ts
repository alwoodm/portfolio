export type CareerTimelineItem = Readonly<{
  period: string;
  role: string;
  company: string;
  companyUrl: string;
  description: string;
  isActive: boolean;
}>;

export type CareerContent = Readonly<{
  badge: string;
  title: string;
  description: string;
  timeline: CareerTimelineItem[];
}>;
