"use client";

import { createElement, Fragment, useEffect, useState } from "react";
import * as prod from "react/jsx-runtime";

import type { Element, Properties } from "hast";
import { isElement } from "hast-util-is-element";
import { unified } from "unified";
import { Node } from "unist";
import { visit } from "unist-util-visit";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import remarkBreak from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import { H1 } from "../ui/H1";
import { H2 } from "../ui/H2";
import { H3 } from "../ui/H3";
import { H4 } from "../ui/H4";
import { UnorderedList } from "../ui/UnorderedList";
import { OrderedList } from "../ui/OrderedList";
import { Hyperlink } from "../ui/Hyperlink";
import { Blockquote } from "../ui/Blockquote";
import { Code } from "../ui/Code";
import { Pre } from "../ui/Pre";

type HeadingTagName = "h1" | "h2" | "h3" | "h4";

interface HeadingElement extends Element {
  tagName: HeadingTagName;
  properties: Properties & {
    id?: string;
  };
}

// TODO: HTML을 React 컴포넌트로 대체
const production = {
  Fragment: prod.Fragment,
  jsx: prod.jsx,
  jsxs: prod.jsxs,
  components: {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    ul: UnorderedList,
    ol: OrderedList,
    a: Hyperlink,
    code: Code,
    pre: Pre,
    blockquote: Blockquote,
  },
};

function isHeadingElement(node: unknown): node is HeadingElement {
  return isElement(node, ["h1", "h2", "h3", "h4"]);
}

function addHeadingIds() {
  const usedIds = new Set<string>();

  return (tree: Node) => {
    visit(tree, "element", (node) => {
      if (isHeadingElement(node)) {
        const headingNode = node as HeadingElement;
        const text = headingNode.children
          .filter((child) => child.type === "text")
          .map((child) => child.value)
          .join("");

        /** 기본 Id 생성 (Heading에 입력된 문자열) */
        const baseId = text
          ?.toLowerCase()
          .replace(/[^a-zA-Z0-9가-힣\s]/g, "")
          .replace(/\s+/g, "-");

        /** Heading 레벨을 접두사로 추가 */
        let id = `${headingNode.tagName}-${baseId}`;

        if (usedIds.has(id)) {
          let counter = 1;
          while (usedIds.has(`${id}-${counter}`)) {
            counter++;
          }

          id = `${id}-${counter}`;
        }

        usedIds.add(id);
        headingNode.properties.id = id;
      }
    });
  };
}

/** 마크다운 문자열을 HTML로 변환한 뒤 React에서 사용할 수 있도록 변환시켜주는 Hook
 *
 * @param doc 마크다운 문자열
 * @return JSX.Element
 * @example const Content = useProcessor(doc);
 */
export function useProcessor(doc: string) {
  const [Content, setContent] = useState(createElement(Fragment));

  useEffect(() => {
    (async () => {
      const md = await unified()
        .use(remarkBreak)
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype, { allowDangerousHtml: true })
        // TODO: HTML 코드 입력 방지 추가해야함
        .use(rehypeRaw)
        .use(rehypeKatex)
        .use(rehypeHighlight)
        .use(addHeadingIds)
        .use(rehypeReact, production)
        .process(doc);

      setContent(md.result);
    })();
  }, [doc]);

  return Content;
}
