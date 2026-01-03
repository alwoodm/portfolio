export type ContactEmail = Readonly<{
  label: string;
  iconId: string;
  base64: string;
}>;

export type ContactContent = Readonly<{
  badge: string;
  title: string;
  email: ContactEmail;
}>;
