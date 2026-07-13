"use client";

import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import {
  defaultHighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  placeholder,
  type ViewUpdate,
} from "@codemirror/view";
import { type RefObject, useEffect, useRef, useState } from "react";

import { BOTTOM_STICKY_SCROLL_MARGIN } from "../consts";
import { customHighlightStyle, transparentTheme } from "./editorStyle";

interface Props {
  initialDoc: string;
  onChange?: (state: EditorState) => void;
}

function hasInsertedLineBreak(update: ViewUpdate) {
  let hasLineBreak = false;

  update.changes.iterChanges((_, __, ___, ____, inserted) => {
    if (inserted.toString().includes("\n")) {
      hasLineBreak = true;
    }
  });

  return hasLineBreak;
}

/** 코드미러6 에디터 생성 Hook
 *
 * @param initialDoc - 초기 문서
 * @param onChange - 문서 변경 시 호출할 함수
 * @return [editorRef, editorView]
 * @example
 * const [editorRef, editorView] = useCodemirror({ initialDoc: "" });
 */
export function useCodemirror<T extends Element>({
  initialDoc,
  onChange,
}: Props): [RefObject<T | null>, EditorView?] {
  const editorRef = useRef<T | null>(null);
  const editorDocRef = useRef(initialDoc);
  const [editorView, setEditorView] = useState<EditorView>();

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        placeholder("지금 생각하고있는 이야기를 써보세요..."),
        history(),
        indentOnInput(),
        markdown({
          base: markdownLanguage,
          // HTML 예시 블록은 HTML 파서에 맡기지 않고 코드 텍스트로 유지한다.
          // 포커스 해제 시 재파싱되어 태그가 숨겨지는 것을 방지한다.
          codeLanguages: languages.filter(({ name }) => name !== "HTML"),
          addKeymap: true,
        }),
        transparentTheme,
        // 기본 마크다운 토큰 스타일과 커스텀 크기·색상 스타일을 함께 적용한다.
        // fallback으로 등록하면 커스텀 스타일이 존재하는 경우 기본 스타일이
        // 비활성화되어 일부 마크다운 토큰에 클래스가 생성되지 않는다.
        syntaxHighlighting(defaultHighlightStyle),
        syntaxHighlighting(customHighlightStyle),
        EditorView.lineWrapping,
        EditorView.scrollMargins.of(() => ({
          bottom: BOTTOM_STICKY_SCROLL_MARGIN,
        })),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;

          if (hasInsertedLineBreak(update)) {
            update.view.dispatch({
              effects: EditorView.scrollIntoView(
                update.state.selection.main.head,
                {
                  y: "end",
                  yMargin: BOTTOM_STICKY_SCROLL_MARGIN,
                }
              ),
            });
          }

          editorDocRef.current = update.state.doc.toString();

          if (onChange) {
            onChange(update.state);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    setEditorView(view);

    return () => {
      view.destroy();
    };

    // initialDoc, onChange 들어갈 경우 에디터 리렌더링되어 작성 불가능
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef]);

  useEffect(() => {
    /** 수정 등으로 접근 시 초기 문서 주입 */
    if (!editorView) return;

    // 사용자가 방금 입력한 값은 폼 상태가 다시 전달할 때까지 잠시 이전
    // initialDoc을 유지할 수 있다. 그 값을 다시 주입하면 입력 중인 코드가
    // 되돌아갈 수 있으므로, 에디터에서 발생한 변경의 echo는 무시한다.
    if (initialDoc === editorDocRef.current) return;

    const currentDoc = editorView.state.doc.toString();
    if (currentDoc !== initialDoc) {
      editorDocRef.current = initialDoc;
      editorView.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: initialDoc },
      });
    }
  }, [editorView, initialDoc]);

  return [editorRef, editorView];
}
