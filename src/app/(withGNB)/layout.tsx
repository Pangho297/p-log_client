import { GNB } from "@/features";

export default function GNBLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-dvh flex-col justify-between">
      <section className="flex flex-col">
        <GNB />
        <article className="flex justify-center">
          <article className="w-container my-8 w-full">{children}</article>
        </article>
      </section>
      <footer className="flex justify-center border-t">
        <article className="w-container w-full">Footer</article>
      </footer>
    </main>
  );
}
