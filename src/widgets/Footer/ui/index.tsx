import { Mail } from "lucide-react";
import { ICON } from "@/shared";

export function Footer() {
  return (
    <footer className="flex justify-center border-t px-5">
      <section className="w-container flex w-full gap-40 py-5">
        <article className="flex flex-col gap-2">
          <h3 className="text-ring text-lg font-bold">Developer</h3>
          <div className="flex flex-row gap-3">
            <a href="https://github.com/pangho297" target="_blank">
              <ICON.GithubIcon className="fill-ring size-6" />
            </a>
            <a href="mailto:pangho297@gmail.com">
              <Mail className="text-ring size-6" />
            </a>
          </div>
        </article>
        <article className="flex w-full flex-col gap-2">
          <h3 className="text-ring text-lg font-bold">Made with</h3>
          <div className="flex flex-row gap-3">
            <ICON.NextjsIcon className="size-6" />
            <ICON.ShadcnIcon className="size-6" />
            <ICON.NestjsIcon className="size-6" />
            <ICON.DrizzleIcon className="size-6" />
          </div>
        </article>
      </section>
    </footer>
  );
}
