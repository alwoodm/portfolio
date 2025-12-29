export type AboutListItem = Readonly<{
  label: string;
  iconId: string;
  level?: string;
}>;

export type AboutInfoBlock = Readonly<{
  label: string;
  iconId: string;
  value?: string;
  items?: AboutListItem[];
}>;

export type AboutHobbiesBlock = Readonly<{
  title: string;
  subtitle: string;
  items: AboutListItem[];
}>;

export type AboutContent = Readonly<{
  badge: string;
  title: string;
  description: string;
  hobbies: AboutHobbiesBlock;
  languages: AboutInfoBlock;
  gender: AboutInfoBlock;
  nationality: AboutInfoBlock;
}>;
