export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-8 px-6 text-center sm:px-10">
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
          Portfolio Starter
        </p>
        <h1 className="text-foreground text-4xl leading-tight font-semibold text-balance sm:text-5xl">
          Build and ship fast with Next.js, Tailwind v4, and shadcn/ui.
        </h1>
        <p className="text-muted-foreground text-lg">
          Toggle themes in the header to preview the light and dark palettes.
        </p>
      </div>
    </main>
  );
}
