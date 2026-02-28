import { unified } from "unified";
import { Heading, HeadingNode } from "./type";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string"; // HTML h 태그의 요소만 가져오는 유틸리티 함수
import GithubSlugger from "github-slugger";

export function getToc(markdown: string) {
  const headings: Heading[] = [];
  const slugger = new GithubSlugger();

  const tree = unified().use(remarkParse).parse(markdown);

  visit(tree, "heading", (node: HeadingNode) => {
    const text = toString(node); // 인라인 요소 포함한 전체 텍스트
    const baseId = slugger.slug(text); // 중복 자동 처리 및 Github 의 마크다운 방식으로 Heading 감지
    const id = `h${node.depth}-${baseId}`;

    headings.push({
      id,
      text,
      level: node.depth,
    });
  });

  return headings;
}
