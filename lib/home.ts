export type HomeContent = Readonly<{
  intro: string;
  name: string;
  role: string;
  roles: string[];
  social: {
    linkedin: string;
    github: string;
  };
}>;
