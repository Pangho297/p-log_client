import { useEffect, useMemo, useState } from "react";

import { getToc } from "./getToc";
import { Heading } from "./type";

interface Props {
  content: string;
}

export function useTOC({ content }: Props) {
  const [activeId, setActiveId] = useState("");
  const headings = useMemo(() => getToc(content), [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      ) as HTMLElement[];

      for (const element of headingElements) {
        const rect = element.getBoundingClientRect();

        if (rect.top >= 0 && rect.top <= 100) {
          setActiveId(element.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 초기 로드 시 실행
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const goToHeading = (heading: Heading) => {
    const element = document.getElementById(heading.id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  return { activeId, headings, goToHeading };
}
