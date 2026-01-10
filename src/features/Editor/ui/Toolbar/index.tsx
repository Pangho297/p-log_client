import { EditorView } from "@codemirror/view";
import { ICON } from "@/shared";

import { useToolbar } from "../../model/useToolbar";
import { ToolbarItem } from "../ToolbarItem";
import { Heading } from "./Heading";
import { Separator } from "./Separator";

interface Props {
  editorView: EditorView | undefined;
}

export function Toolbar({ editorView }: Props) {
  const { handleItemClick } = useToolbar({ editorView });

  return (
    <div
      id="editor_toolbar"
      className="sticky top-0 flex w-full flex-wrap items-center not-xl:gap-0.5 not-xl:px-2"
    >
      <ToolbarItem
        icon={<Heading level={"1"} />}
        onClick={() => handleItemClick("heading1")}
      />
      <ToolbarItem
        icon={<Heading level={"2"} />}
        onClick={() => handleItemClick("heading2")}
      />
      <ToolbarItem
        icon={<Heading level={"3"} />}
        onClick={() => handleItemClick("heading3")}
      />
      <ToolbarItem
        icon={<Heading level={"4"} />}
        onClick={() => handleItemClick("heading4")}
      />
      <Separator />
      <ToolbarItem
        icon={<ICON.BoldIcon />}
        onClick={() => handleItemClick("bold")}
      />
      <ToolbarItem
        icon={<ICON.ItalicIcon />}
        onClick={() => handleItemClick("italic")}
      />
      <ToolbarItem
        icon={<ICON.StrikethroughIcon />}
        onClick={() => handleItemClick("strike")}
      />
      <Separator />
      <ToolbarItem
        icon={<ICON.QuoteIcon />}
        onClick={() => handleItemClick("quote")}
      />
      <ToolbarItem
        icon={<ICON.InsertLinkIcon />}
        onClick={() => handleItemClick("link")}
      />
      <ToolbarItem
        icon={<ICON.ImageIcon />}
        onClick={() => handleItemClick("image")}
      />
      <ToolbarItem
        icon={<ICON.CodeIcon />}
        onClick={() => handleItemClick("codeblock")}
      />
    </div>
  );
}
