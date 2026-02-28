import { Heading as MdastHeading, PhrasingContent } from "mdast";

// mdast는 2015년에 remark와 병합도었지만 타입은 여전히 사용하고 있음
// 커스텀 타입을 만드는 것 보다 안전성이 보장되므로 @types/mdast 패키지는 사용 가능
// 다만 이에 대한 검증은 별도로 해보지 않았으며 이는 온전히 GPT, Gemini의 의견임

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface HeadingNode extends MdastHeading {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: PhrasingContent[];
}
