# Draft 없이 Markdown 에디터 이미지 업로드 구조 변경 제안

이 문서는 Markdown 에디터에서 이미지를 먼저 업로드하고, 마지막 submit 시점에 게시글을 생성 또는 수정하는 UX를 유지하기 위한 이미지 업로드 정책 변경안을 정리합니다.

전제는 다음과 같습니다.

- 게시글은 작성 완료 후 submit하면 바로 게시된다.
- draft 게시글 상태는 도입하지 않는다.
- 프론트엔드는 Markdown 에디터에서 이미지를 자유롭게 삽입할 수 있어야 한다.
- 게시글 생성 전에는 `postId`를 알 수 없다.
- 따라서 이미지 업로드 URL 발급 단계에서 `postId`를 요구하면 현재 UX를 구현할 수 없다.

## 현재 정책의 문제

현재 공유된 백엔드 정책은 이미지 업로드 URL 요청 시 `postId`를 요구합니다.

```json
{
  "postId": "게시글 id"
}
```

이 구조에서는 게시글 생성 전에 이미지를 업로드할 수 없습니다.

하지만 현재 에디터 UX는 다음 흐름을 목표로 합니다.

```text
작성 화면 진입
  ↓
Markdown 본문 작성
  ↓
이미지 삽입
  ↓
이미지 URL이 본문에 들어감
  ↓
마지막 submit
  ↓
게시글 생성 또는 수정
```

이 흐름에서는 이미지 삽입 시점에 아직 게시글이 없기 때문에 `postId`도 없습니다.

따라서 현재 정책을 유지하면 프론트엔드는 이미지 업로드를 위해 게시글을 먼저 생성해야 하고, 이는 "submit 시점에 게시글을 생성한다"는 작성 UX와 충돌합니다.

## 제안하는 방향

이미지 업로드 정책을 `postId 기준`이 아니라 `ownerUserId 기준 임시 이미지` 방식으로 변경합니다.

핵심은 다음과 같습니다.

1. 이미지 업로드 URL 발급 시 `postId`를 요구하지 않는다.
2. 서버는 업로드 예정 이미지를 `ownerUserId` 기준으로 `temp` 상태 저장한다.
3. 프론트엔드는 발급받은 `uploadURL`로 Cloudflare에 이미지를 직접 업로드한다.
4. 업로드 완료 후 `deliveryURL`을 Markdown 본문에 삽입한다.
5. 게시글 생성 또는 수정 submit 시 서버가 최종 `content`를 파싱한다.
6. `content`에 남아있는 Cloudflare 이미지 URL만 게시글에 연결한다.
7. submit되지 않은 temp 이미지는 일정 시간 후 Cron으로 삭제한다.

이렇게 하면 draft 게시글 없이도 이미지 선업로드가 가능합니다.

## 변경 후 전체 흐름

```text
작성 화면 진입
  ↓
이미지 버튼 클릭
  ↓
파일 선택
  ↓
POST /images/direct-upload-url 요청
  ↓
서버가 ownerUserId 기준 temp 이미지 생성
  ↓
imageId, uploadURL, deliveryURL 반환
  ↓
프론트엔드가 uploadURL로 Cloudflare에 파일 업로드
  ↓
업로드 성공 시 deliveryURL을 Markdown 본문에 삽입
  ↓
사용자가 글 작성 완료 후 submit
  ↓
POST /post 또는 PATCH /post/:slug 요청
  ↓
서버가 최종 content에서 Cloudflare 이미지 URL 파싱
  ↓
본문에 남은 temp 이미지를 게시글에 연결
  ↓
본문에 없는 temp 이미지는 나중에 Cron으로 삭제
```

## API 변경 제안

### 이미지 업로드 URL 발급

기존 요청 body의 `postId`를 제거합니다.

```http
POST /images/direct-upload-url
```

요청 body는 비워도 되고, 추후 확장을 고려해 업로드 목적만 받을 수 있습니다.

```json
{
  "purpose": "post-content"
}
```

응답은 기존과 동일하게 유지할 수 있습니다.

```json
{
  "imageId": "cloudflare-image-id",
  "uploadURL": "https://upload.imagedelivery.net/...",
  "deliveryURL": "https://imagedelivery.net/accountHash/cloudflare-image-id/public"
}
```

서버는 이 시점에 이미지 레코드를 다음 상태로 저장합니다.

```text
imageId
ownerUserId
postId: null
status: temp
deliveryURL
createdAt
uploadedAt: null
```

### Cloudflare 파일 업로드

프론트엔드는 백엔드가 반환한 `uploadURL`로 파일을 직접 업로드합니다.

```ts
const formData = new FormData();
formData.append("file", file);

await fetch(uploadURL, {
  method: "POST",
  body: formData,
});
```

이 요청은 백엔드 API가 아니라 Cloudflare Direct Upload URL로 보내는 요청입니다.

### 게시글 생성

게시글 생성 요청은 기존처럼 최종 본문을 포함합니다.

```http
POST /post
```

```json
{
  "title": "게시글 제목",
  "content": "본문\n\n![image](https://imagedelivery.net/accountHash/image-id/public)",
  "tags": ["tag"]
}
```

서버는 게시글을 생성한 뒤 `content`를 파싱합니다.

파싱된 Cloudflare 이미지 URL 중 다음 조건을 만족하는 이미지만 새 게시글에 연결합니다.

- `ownerUserId`가 현재 로그인 사용자와 일치한다.
- `status`가 `temp` 또는 허용 가능한 임시 상태다.
- `deliveryURL` 또는 `imageId`가 본문에 포함되어 있다.

연결 후 이미지 상태를 변경합니다.

```text
postId: 생성된 게시글 id
status: attached
```

### 게시글 수정

수정 요청도 최종 본문만 전달합니다.

```http
PATCH /post/:slug
```

```json
{
  "title": "수정된 제목",
  "content": "수정된 최종 본문",
  "tags": ["tag"]
}
```

서버는 최종 `content`를 기준으로 이미지 상태를 정리합니다.

```text
수정 후 content에 남아있는 기존 attached 이미지
  → attached 유지

수정 후 content에서 제거된 기존 attached 이미지
  → delete_pending

수정 중 새로 업로드되어 content에 들어온 temp 이미지
  → 현재 postId에 attached

수정 중 업로드했지만 content에서 제거된 temp 이미지
  → temp 유지 후 Cron 삭제
```

## 서버 이미지 상태 모델 제안

이미지 상태는 최소한 다음 값으로 관리할 수 있습니다.

```text
temp
attached
delete_pending
deleted
```

### temp

업로드 URL은 발급됐지만 아직 게시글에 연결되지 않은 상태입니다.

게시글 생성 전 이미지, 또는 수정 중 새로 업로드했지만 아직 저장되지 않은 이미지가 여기에 해당합니다.

### attached

게시글 본문에 포함되어 있고 특정 `postId`와 연결된 상태입니다.

### delete_pending

게시글 수정 후 본문에서 제거되어 삭제 대기 중인 상태입니다.

즉시 Cloudflare에서 삭제하지 않고 Cron이 나중에 삭제합니다.

### deleted

Cloudflare 삭제까지 완료된 상태입니다.

## 프론트엔드 구현 흐름

프론트엔드는 이미지 업로드 시 더 이상 `postId`를 신경 쓰지 않습니다.

```text
이미지 버튼 클릭
  ↓
파일 선택
  ↓
POST /images/direct-upload-url
  ↓
uploadURL 수신
  ↓
Cloudflare에 파일 업로드
  ↓
deliveryURL을 현재 커서 위치에 Markdown으로 삽입
```

예상 함수 구조는 다음과 같습니다.

```ts
async function handleImageUpload(file: File) {
  const { data } = await getDirectUploadUrl({
    purpose: "post-content",
  });

  await uploadFileToCloudflare(data.uploadURL, file);

  insertMarkdownImage(data.deliveryURL);
}
```

본문에 삽입되는 Markdown은 다음 형태입니다.

```md
![image](https://imagedelivery.net/accountHash/image-id/public)
```

submit 시에는 일반 게시글 작성/수정과 동일하게 최종 `content`만 서버에 보냅니다.

```ts
await createPost({
  title,
  content,
  tags,
});
```

또는 수정 모드에서는 다음처럼 처리합니다.

```ts
await updatePost({
  slug,
  title,
  content,
  tags,
});
```

프론트엔드는 삭제된 이미지 목록을 별도로 계산하지 않아도 됩니다.

## 프론트엔드에서 유지할 필요가 없는 상태

이 구조에서는 다음 상태를 프론트엔드가 필수로 관리하지 않아도 됩니다.

```ts
const [uploadImages, setUploadImages] = useState<string[]>([]);
```

삭제 이미지 목록도 submit 시 따로 만들 필요가 없습니다.

```ts
const deletedUrlList = uploadImages.filter(
  (url) => !extractImageUrls(data.content).includes(url)
);
```

이미지 연결과 삭제 판단은 서버가 최종 `content` 기준으로 처리하는 것이 더 안전합니다.

## 보안 및 검증 조건

서버는 게시글 submit 시 본문에 포함된 모든 Cloudflare URL을 무조건 신뢰하면 안 됩니다.

다음 검증이 필요합니다.

- URL이 서비스에서 사용하는 Cloudflare Images delivery 도메인인지 확인한다.
- URL에서 추출한 `imageId`가 DB에 존재하는지 확인한다.
- `ownerUserId`가 현재 요청 사용자와 일치하는지 확인한다.
- 다른 사용자의 temp 이미지를 현재 게시글에 연결하지 않는다.
- 이미 다른 게시글에 attached된 이미지를 임의로 훔쳐 연결하지 않는다.
- 허용된 variant만 본문 이미지로 인정한다.

이 검증을 통과한 이미지만 게시글에 연결해야 합니다.

## submit되지 않은 이미지 정리

이미지를 업로드했지만 사용자가 게시글을 submit하지 않고 이탈할 수 있습니다.

이 경우 게시글은 생성되지 않아야 하므로 draft는 만들지 않습니다.

대신 이미지 레코드만 `temp` 상태로 남습니다.

서버 Cron은 일정 시간이 지난 `temp` 이미지를 삭제합니다.

```text
status = temp
createdAt < now - TTL
  ↓
Cloudflare 이미지 삭제
  ↓
status = deleted
```

TTL은 서비스 정책에 따라 정합니다.

예시:

- 1시간
- 6시간
- 24시간

작성 도중 장시간 머무르는 사용자를 고려하면 너무 짧은 TTL은 피하는 것이 좋습니다.

## 업로드 성공 여부 추적

Direct Upload URL을 발급받은 뒤 실제 Cloudflare 업로드가 실패할 수 있습니다.

가능하면 서버 이미지 레코드에 업로드 완료 여부를 구분하는 필드를 둘 수 있습니다.

```text
uploadedAt: Date | null
```

업로드 완료를 서버가 직접 알 수 있는 방법은 다음 중 하나입니다.

1. Cloudflare webhook 사용
2. 프론트엔드가 업로드 성공 후 서버에 완료 API 호출
3. submit 시점에 서버가 Cloudflare 이미지 상태를 확인

초기 구현에서는 단순화를 위해 `temp` 이미지를 TTL 기반으로 정리하고, submit 시 content에 포함된 이미지 ID만 연결해도 됩니다.

다만 업로드 실패한 이미지가 본문에 들어가지 않도록 프론트엔드는 Cloudflare 업로드 성공 후에만 `deliveryURL`을 삽입해야 합니다.

## 장점

- 게시글 생성 전에도 이미지 업로드가 가능하다.
- 작성 UX가 자연스럽다.
- draft 게시글을 도입하지 않아도 된다.
- 게시글은 submit 시점에만 생성되므로 "작성하면 바로 게시" 정책을 유지할 수 있다.
- 프론트엔드는 최종 `content`만 보내면 되므로 삭제 이미지 목록 관리가 단순해진다.
- 기존 Cloudflare Direct Upload 방식은 유지할 수 있다.

## 단점 및 주의점

- submit되지 않은 temp 이미지를 정리하는 Cron이 필요하다.
- 서버가 content에서 Cloudflare 이미지 URL을 안정적으로 파싱해야 한다.
- 다른 사용자의 이미지 URL을 본문에 넣는 경우를 검증해야 한다.
- 업로드 URL 발급 후 실제 업로드가 실패한 temp 레코드가 생길 수 있다.
- 게시글 생성 시 이미지 연결 처리가 같은 트랜잭션 또는 일관된 후처리로 묶여야 한다.

## 기존 정책과의 차이

| 항목 | 기존 정책 | 변경 제안 |
| --- | --- | --- |
| 업로드 URL 발급 조건 | `postId` 필요 | `postId` 불필요 |
| 이미지 임시 소유 기준 | 게시글 + 사용자 | 사용자 |
| 게시글 생성 전 업로드 | 불가능 | 가능 |
| draft 필요 여부 | 사실상 필요 | 불필요 |
| 최종 이미지 연결 시점 | 게시글 수정 시 | 게시글 생성/수정 submit 시 |
| 삭제 판단 | 최종 content 기준 | 최종 content 기준 |

## 백엔드와 합의가 필요한 API 계약

프론트 구현 전에 다음 계약을 백엔드와 확정해야 합니다.

### 1. `/images/direct-upload-url` 요청 body

`postId`를 제거할지, 선택값으로 둘지 결정해야 합니다.

권장안:

```ts
interface GetDirectUploadUrlRequestDto {
  purpose?: "post-content";
}
```

### 2. 게시글 생성 시 이미지 attach 처리

`POST /post`에서 최종 `content`를 파싱해 temp 이미지를 생성된 게시글에 연결해야 합니다.

### 3. 게시글 수정 시 이미지 상태 정리

`PATCH /post/:slug`에서 기존 attached 이미지와 새 temp 이미지를 함께 정리해야 합니다.

### 4. temp 이미지 TTL

submit되지 않은 temp 이미지를 언제 삭제할지 정해야 합니다.

### 5. 이미지 URL 파싱 규칙

서버가 인정하는 Cloudflare delivery URL 패턴과 variant를 정해야 합니다.

## 결론

현재 목표 UX는 "Markdown 에디터에서 이미지를 먼저 업로드하고, 마지막 submit으로 게시글을 생성 또는 수정한다"입니다.

이 UX를 유지하면서 draft를 도입하지 않으려면, 이미지 업로드 URL 발급 정책에서 `postId` 의존성을 제거해야 합니다.

이미지는 우선 `ownerUserId` 기준의 `temp` 상태로 저장하고, 게시글 생성 또는 수정 submit 시 최종 `content`에 남아있는 이미지 URL만 해당 게시글에 연결하는 구조가 적합합니다.

이 방식이면 게시글은 submit 전까지 생성되지 않고, submit 즉시 게시되는 기존 정책도 유지할 수 있습니다.
