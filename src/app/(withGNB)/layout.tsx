import { GNB } from "@/features";
import { Footer } from "@/widgets";

export default function GNBLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <nav className="flex min-h-dvh flex-col justify-between">
      <section className="flex flex-col">
        <GNB />
        <article className="mt-16 flex justify-center">
          <article className="w-container w-full">{children}</article>
        </article>
      </section>
      <Footer />
    </nav>
  );
}
