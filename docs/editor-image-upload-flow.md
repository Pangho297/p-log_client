# Markdown 에디터 이미지 업로드 플로우 구상

이 문서는 현재 Markdown 에디터에 Cloudflare Images Direct Upload 방식의 이미지 업로드를 추가할 때, 프론트엔드에서 어떤 흐름으로 동작해야 하는지 정리합니다.

기준 정책은 `docs/cloudflare-image-flow.md`의 백엔드 공유 문서입니다.

## 핵심 전제

현재 백엔드 정책에서는 이미지 업로드 URL을 요청할 때 `postId`가 필요합니다.

따라서 프론트엔드는 게시글이 아직 생성되지 않은 상태에서는 이미지 업로드용 `uploadURL`을 받을 수 없습니다.

즉, 이미지 업로드가 가능한 Markdown 에디터를 만들려면 작성 플로우는 다음 중 하나로 정리되어야 합니다.

1. 게시글을 먼저 생성하고, 이후 이미지를 업로드한다.
2. 백엔드가 `postId` 없이 임시 이미지 업로드를 허용하도록 정책을 바꾼다.

현재 공유된 백엔드 문서 기준으로는 1번만 가능합니다.

## 권장 플로우

현재 백엔드 정책을 그대로 따른다면, 프론트엔드는 게시글을 먼저 생성한 뒤 에디터를 이미지 업로드 가능한 상태로 전환하는 방식이 가장 자연스럽습니다.

```text
작성 화면 진입
  ↓
제목/본문/태그 입력
  ↓
이미지 삽입 시도
  ↓
postId 존재 여부 확인
  ↓
postId가 없으면 게시글을 먼저 생성
  ↓
생성 응답의 id를 postId로 저장
  ↓
POST /images/direct-upload-url 요청
  ↓
uploadURL, imageId, deliveryURL 수신
  ↓
uploadURL로 Cloudflare에 파일 업로드
  ↓
deliveryURL을 Markdown 본문에 삽입
  ↓
최종 저장 시 PATCH /post/:slug 호출
```

## 사용자가 보는 동작

사용자는 에디터에서 이미지 버튼을 누릅니다.

프론트엔드는 파일 선택창을 띄웁니다.

사용자가 이미지 파일을 선택하면, 프론트엔드는 현재 작성 중인 글이 서버에 생성되어 있는지 확인합니다.

아직 생성된 게시글이 없다면 먼저 `POST /post`를 호출해 게시글을 생성합니다. 이때 현재까지 입력된 `title`, `content`, `tags`를 함께 보냅니다.

게시글 생성 응답에서 `id`와 `slug`를 받습니다.

이후 프론트엔드는 받은 `id`를 `postId`로 사용해 `POST /images/direct-upload-url`을 호출합니다.

백엔드는 Cloudflare에서 Direct Upload URL을 발급받고, 이미지 정보를 DB에 `temp` 상태로 저장한 뒤 프론트엔드에 `imageId`, `uploadURL`, `deliveryURL`을 반환합니다.

프론트엔드는 `uploadURL`로 이미지 파일을 직접 업로드합니다.

Cloudflare 업로드가 성공하면 `deliveryURL`을 Markdown 이미지 문법으로 현재 커서 위치에 삽입합니다.

```md
![image](https://imagedelivery.net/accountHash/image-id/public)
```

사용자가 글 작성을 마치고 게시하기 버튼을 누르면, 프론트엔드는 최종 본문을 `PATCH /post/:slug`로 서버에 전달합니다.

서버는 최종 `content` 안에 남아있는 Cloudflare 이미지 URL을 기준으로 이미지를 `attached` 또는 `delete_pending` 상태로 정리합니다.

## 프론트엔드 상태 모델

에디터는 작성 중인 게시글의 서버 상태를 별도로 들고 있어야 합니다.

```ts
type EditorPostState = {
  id: string;
  slug: string;
} | null;
```

초기 작성 화면에서는 `null`입니다.

이미지 업로드가 처음 발생하거나, 임시 저장/게시 같은 서버 저장이 먼저 일어나면 `id`와 `slug`를 저장합니다.

```text
editorPost === null
  아직 서버에 게시글이 없음

editorPost !== null
  서버에 게시글이 생성되어 있고 이미지 업로드 가능
```

## 이미지 버튼 처리 흐름

이미지 버튼은 단순히 Markdown 템플릿을 넣는 역할이 아니라, 파일 업로드 전체 흐름을 실행해야 합니다.

```text
이미지 버튼 클릭
  ↓
파일 선택 input 열기
  ↓
이미지 파일 검증
  ↓
postId 확보
  ↓
Direct Upload URL 요청
  ↓
Cloudflare 업로드
  ↓
Markdown 본문에 deliveryURL 삽입
```

예상 함수 구조는 다음과 같습니다.

```ts
async function handleImageUpload(file: File) {
  const post = await ensurePostCreated();

  const { uploadURL, deliveryURL } = await requestDirectUploadUrl({
    postId: post.id,
  });

  await uploadFileToCloudflare(uploadURL, file);

  insertMarkdownImage(deliveryURL);
}
```

## postId 확보 흐름

이미지 업로드 전에 반드시 `postId`가 있어야 합니다.

```ts
async function ensurePostCreated() {
  if (editorPost) {
    return editorPost;
  }

  const createdPost = await createPost({
    title: getValues("title"),
    content: getValues("content"),
    tags: getValues("hashtagList"),
  });

  const post = {
    id: createdPost.data.id,
    slug: createdPost.data.slug,
  };

  setEditorPost(post);

  return post;
}
```

이 흐름을 쓰면 사용자가 이미지를 처음 삽입하는 순간 게시글이 서버에 먼저 생성됩니다.

따라서 UX나 백엔드 정책상 다음 내용을 함께 결정해야 합니다.

- 제목이 비어있는 상태에서도 임시 게시글 생성을 허용할지
- 생성된 게시글이 바로 공개되는지, draft 상태로 남는지
- 사용자가 작성 화면을 이탈했을 때 빈 게시글을 삭제할지
- `POST /post` 이후 URL을 `/editor?postId=...` 또는 수정 모드 경로로 바꿀지

## Cloudflare 업로드 요청

`uploadURL`은 백엔드에서 발급받지만, 이미지 파일은 프론트엔드가 Cloudflare로 직접 업로드합니다.

```ts
async function uploadFileToCloudflare(uploadURL: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(uploadURL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }
}
```

이 요청에는 일반적인 서비스 API용 `axiosInstance`를 쓰지 않는 편이 안전합니다.

`uploadURL`은 Cloudflare에서 발급한 외부 URL이고, 서비스 API의 baseURL, 인증 인터셉터, 응답 인터셉터와 분리하는 것이 명확합니다.

## Markdown 삽입 방식

업로드가 끝나면 `deliveryURL`을 현재 커서 위치에 삽입합니다.

```md
![image](deliveryURL)
```

사용자가 이미지를 선택한 순간 바로 placeholder를 넣고, 업로드 완료 후 URL을 교체하는 방식도 가능합니다.

```md
![uploading](업로드 중...)
```

다만 초기 구현에서는 업로드가 완료된 뒤 Markdown을 삽입하는 방식이 더 단순합니다.

## 게시하기 버튼 처리

이미지가 한 번이라도 업로드된 글은 이미 `POST /post`로 생성된 상태입니다.

따라서 게시하기 버튼은 상황에 따라 동작이 달라집니다.

```text
editorPost가 없음
  ↓
POST /post로 새 게시글 생성

editorPost가 있음
  ↓
PATCH /post/:slug로 최종 내용 저장
```

즉 게시하기 버튼은 단순히 항상 `POST /post`를 호출하면 안 됩니다.

이미지 업로드 과정에서 생성된 게시글이 있다면, 최종 저장은 `PATCH /post/:slug`로 처리해야 합니다.

## 이미지 삭제 처리

프론트엔드는 삭제된 이미지 목록을 별도로 계산해서 보낼 필요가 없습니다.

사용자가 본문에서 이미지 Markdown을 지우면, 최종 저장 시 해당 URL이 `content`에서 사라집니다.

서버는 최종 `content`를 기준으로 같은 `postId`에 묶인 이미지 상태를 정리합니다.

```text
최종 content에 남아있는 이미지
  → attached

최종 content에서 사라진 이미지
  → delete_pending
```

따라서 기존 `uploadImages`, `deletedUrlList` 기반의 프론트 삭제 계산 로직은 백엔드 정책과 맞지 않습니다.

최종 저장 시 서버에 보내야 하는 것은 삭제 목록이 아니라 최종 `content`입니다.

## 실패 케이스

이미지 업로드에서는 다음 실패 상황을 고려해야 합니다.

### 게시글 생성 실패

`POST /post`가 실패하면 이미지 업로드를 진행할 수 없습니다.

사용자에게 게시글 생성 실패 메시지를 보여주고 이미지 삽입을 중단합니다.

### Direct Upload URL 발급 실패

`POST /images/direct-upload-url`이 실패하면 Cloudflare 업로드를 진행할 수 없습니다.

이 경우 본문에 이미지 Markdown을 삽입하지 않습니다.

### Cloudflare 업로드 실패

Cloudflare 업로드가 실패하면 `deliveryURL`을 본문에 삽입하지 않습니다.

이미 백엔드에는 `temp` 상태의 이미지 레코드가 생겼을 수 있으므로, 서버 Cron이 정리하거나 별도 정리 API가 필요할 수 있습니다.

### 최종 저장 실패

이미지는 Cloudflare에 업로드됐지만 `PATCH /post/:slug`가 실패할 수 있습니다.

이 경우 본문에는 이미지 URL이 남아있지만 서버의 최종 content 반영이 실패한 상태입니다.

사용자에게 재시도 UI를 제공하는 것이 필요합니다.

## 현재 코드 기준 변경 지점

현재 코드에서 구현이 필요한 주요 지점은 다음과 같습니다.

- `src/features/Editor/model/useToolbar.tsx`
  - 이미지 버튼 TODO 구현
  - 파일 선택 input 또는 외부 핸들러 연결 필요

- `src/features/Editor/ui/index.tsx`
  - 이미지 업로드 핸들러를 Toolbar로 전달할 수 있도록 props 확장 필요

- `src/widgets/EditorForm/model/useEditorForm.tsx`
  - 작성 중 게시글 상태 `editorPost` 추가
  - `ensurePostCreated` 추가
  - 이미지 업로드 핸들러 추가
  - 게시하기 시 `POST`와 `PATCH` 분기 처리
  - 삭제 이미지 목록 계산 로직 제거 가능

- `src/shared/api/image/index.ts`
  - `getDirectUploadUrl`은 이미 존재하므로 재사용 가능

## 구현 시 권장 순서

1. `EditorForm`에서 작성 중 게시글 상태를 추가한다.
2. `ensurePostCreated`를 구현한다.
3. `uploadURL` 발급 요청과 Cloudflare 업로드 함수를 구현한다.
4. Toolbar 이미지 버튼에서 파일 선택을 실행한다.
5. 업로드 성공 후 현재 커서 위치에 Markdown 이미지 문법을 삽입한다.
6. 게시하기 버튼에서 `editorPost` 존재 여부에 따라 `POST` 또는 `PATCH`로 분기한다.
7. 기존 삭제 이미지 목록 계산 로직을 제거하고 최종 `content`만 서버에 전달한다.

## 남은 백엔드 확인 사항

프론트 구현 전에 백엔드와 다음 내용을 확인해야 합니다.

- `POST /post`로 생성된 글이 즉시 공개되는지
- 임시 저장 또는 draft 상태가 있는지
- 제목/본문이 비어 있어도 게시글 생성이 가능한지
- 이미지 업로드 때문에 먼저 생성된 게시글을 사용자가 이탈했을 때 어떻게 정리할지
- `POST /images/direct-upload-url`의 `postId`가 게시글 `id`인지, URL의 `slug`나 `postId`와 혼동될 여지가 없는지
- Cloudflare 업로드 실패 후 `temp` 이미지 레코드 정리 정책이 있는지

## 결론

현재 백엔드 정책을 그대로 따르면, Markdown 에디터의 이미지 업로드는 "이미지 먼저 업로드 후 게시글 생성" 방식이 아니라 "게시글을 먼저 생성한 뒤 이미지 업로드" 방식으로 설계해야 합니다.

프론트엔드는 Cloudflare에 `uploadURL` 발급을 직접 요청하지 않습니다.

프론트엔드는 백엔드에서 받은 `uploadURL`로 이미지 파일만 Cloudflare에 직접 업로드하고, 업로드 성공 후 백엔드가 함께 내려준 `deliveryURL`을 Markdown 본문에 삽입합니다.
