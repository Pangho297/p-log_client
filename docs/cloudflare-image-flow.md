# 게시글 이미지 업로드/삭제 처리 방식

현재 서버는 Cloudflare Images Direct Upload 방식을 사용합니다.  
프론트엔드는 이미지 파일을 서버로 직접 업로드하지 않고, 서버에서 발급받은 `uploadURL`을 이용해 Cloudflare로 직접 업로드합니다.

## 전체 흐름

1. 프론트엔드가 `POST /post`로 게시글을 먼저 생성합니다.
2. 서버는 생성된 게시글 정보를 반환합니다.
   - 이때 응답의 `id`가 이후 이미지 업로드에 사용할 `postId`입니다.
3. 프론트엔드는 이미지 삽입 시 `POST /images/direct-upload-url`을 호출합니다.
4. 요청 body에는 게시글 생성 응답에서 받은 `postId`를 전달합니다.

```json
{
  "postId": "게시글 id"
}
```

5. 서버는 Cloudflare에서 `uploadURL`과 `imageId`를 발급받습니다.
6. 서버는 `imageId`, `postId`, `ownerUserId`를 DB에 `temp` 상태로 저장합니다.
7. 서버는 프론트엔드에 다음 값을 반환합니다.
   - `imageId`
   - `uploadURL`
   - `deliveryURL`
8. 프론트엔드는 `uploadURL`로 Cloudflare에 이미지를 직접 업로드합니다.
9. 업로드 후 `deliveryURL`을 게시글 본문 `content`에 삽입합니다.
10. 게시글 수정 API인 `PATCH /post/:slug`로 최종 `content`를 서버에 전달합니다.
11. 서버는 `content` 안에 남아있는 Cloudflare 이미지 URL을 파싱하여 사용 중인 이미지 ID를 판별합니다.
12. 같은 `postId`에 묶인 이미지 중:
    - 본문에 남아있는 이미지는 `attached`
    - 본문에서 제거된 이미지는 `delete_pending`
    으로 변경합니다.
13. 이후 서버 Cron 작업이 `delete_pending` 이미지를 Cloudflare에서 실제 삭제합니다.

## 프론트엔드에서 지켜야 할 점

### 1. 이미지 업로드 전 게시글이 먼저 생성되어 있어야 함

이미지 업로드 URL 요청에는 `postId`가 필요합니다.

따라서 프론트엔드는 먼저 게시글 생성 API를 호출하고, 응답으로 받은 `id`를 이미지 업로드 요청에 사용해야 합니다.

```ts
const createdPost = await createPost(...);

const postId = createdPost.id;
```

이 `postId`를 `/images/direct-upload-url` 요청 body에 넣어야 합니다.

```ts
await requestDirectUploadUrl({
  postId,
});
```

## 이미지 삭제 처리 방식

프론트엔드가 삭제할 이미지 ID 목록을 별도로 보낼 필요는 없습니다.

서버는 게시글 수정 시 전달된 최종 `content`를 기준으로 이미지 사용 여부를 판단합니다.

즉 프론트엔드는 이미지를 삭제했다면, 해당 이미지의 `deliveryURL`이 제거된 최종 본문만 서버에 보내면 됩니다.

```ts
await updatePost(slug, {
  content: finalContent,
});
```

서버는 `finalContent` 안에 남아있는 Cloudflare 이미지 URL만 사용 중인 이미지로 간주합니다.

## 예시

기존 본문:

```md
본문 내용

![image](https://imagedelivery.net/accountHash/image-id-1/public)
![image](https://imagedelivery.net/accountHash/image-id-2/public)
```

프론트엔드에서 두 번째 이미지를 삭제한 뒤 저장:

```md
본문 내용

![image](https://imagedelivery.net/accountHash/image-id-1/public)
```

서버 처리 결과:

- `image-id-1`: `attached`
- `image-id-2`: `delete_pending`

`delete_pending` 상태의 이미지는 즉시 삭제되는 것이 아니라, 일정 시간 후 서버 Cron 작업을 통해 Cloudflare에서 삭제됩니다.

## 결론

프론트엔드에서 필요한 처리는 다음과 같습니다.

- 게시글 생성 후 응답의 `id`를 이미지 업로드용 `postId`로 사용
- 이미지 업로드 URL 요청 시 `postId` 전달
- Cloudflare 업로드 완료 후 `deliveryURL`을 본문 `content`에 삽입
- 이미지 삭제 시 별도 `deletedImageIds`를 보내지 않음
- 삭제가 반영된 최종 `content`만 게시글 수정 API로 전달