type MessageKey = "message" | "errorMessage" | "error" | string;

interface GetNestedMessageOptions {
  messageKey?: MessageKey | MessageKey[]; // 찾고자 하는 메세지 키
  stopOnFirst?: boolean; // 첫 번째 메세지 발견 시 중단
  separator?: string; // 여러 메세지 연결 시 구분자
}

/**
 * 에러 메세지를 반환하는 함수,
 *
 * 깊은 중첩 구조를 처리해 재귀적으로 객체의 모든 깊이를 탐색
 *
 * @example ```ts
 * // 기본 사용
 * const message = getErrorMessage(errors);
 *
 * // 여러 메세지 키 지정
 * const message = getErrorMessage(errors, {
 *    messageKey: ["message", "errorMessage", "error"]
 * })
 *
 * // 모든 에러 메세지 수집
 * const allMessages = getErrorMessage(errors, {
 *    stopOnFirst: false,
 *    separator: " | "
 * })
 * ```
 * @param obj 백엔드, react-hook-form 등에서 에러 발생 시 생성되는 에러 메세지 객체
 * @param options.messageKey 찾고자 하는 메세지 키, 실제 메세지가 출력되는 key: value 중 key값
 * @param options.stopOnFirst 첫 번째 메세지 발견 시 중단, 메세지를 찾은 후 함수 실행을 멈출지 선택, 여러개의 메세지를 받고자할 경우 사용
 * @param options.separator 여러 메세지 연결 시 구분자, 여러 메세지를 받을 때 사용
 */
export function getErrorMessage(
  obj: Record<string, any>,
  options: GetNestedMessageOptions = {}
): string | undefined {
  const {
    messageKey = "message",
    stopOnFirst = true,
    separator = ", ",
  } = options;

  const messages: string[] = [];
  const messageKeys = Array.isArray(messageKey) ? messageKey : [messageKey];

  const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
  };

  const extract = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach((item) => extract(item));
    } else if (isRecord(value)) {
      // 메세지 키 확인
      for (const key of messageKeys) {
        if (key in value) {
          const message = value[key];

          if (typeof message === "string") {
            messages.push(message);
          }

          if (stopOnFirst) return;
        }
      }

      // 재귀적으로 객체 탐색
      Object.values(value).forEach((v) => extract(v));
    }
  };

  extract(obj);

  return messages.length > 0
    ? stopOnFirst
      ? messages[0]
      : messages.join(separator)
    : undefined;
}
