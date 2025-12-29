export type AboutListItem = Readonly<{
  label: string;
  iconId: string;
  level?: string;
}>;

export type AboutInfoItem = Readonly<{
  label: string;
  iconId: string;
  value?: string;
  items?: AboutListItem[];
}>;

export type AboutContent = Readonly<{
  badge?: string;
  title: string;
  description: string;
  personalInfo: AboutInfoItem[];
  hobbies: AboutListItem[];
}>;
