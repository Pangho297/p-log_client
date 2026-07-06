# Frontend CI/CD

GitHub Actions에서 프론트엔드 이미지를 Docker Hub에 push하고, Lightsail 서버에서 `frontend` 서비스만 갱신한다.

## GitHub Secrets

Repository secrets에 아래 값을 등록한다.

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_OWNER_USER_ID
LIGHTSAIL_HOST
LIGHTSAIL_USER
LIGHTSAIL_SSH_KEY
LIGHTSAIL_DEPLOY_PATH
```

운영 값 예시:

```text
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_OWNER_USER_ID=<owner-user-uuid>
LIGHTSAIL_USER=admin
LIGHTSAIL_DEPLOY_PATH=/home/admin/apps/p-log
```

`NEXT_PUBLIC_*` 값은 Next.js 클라이언트 번들에 빌드 시점에 포함되므로 GitHub Actions의 Docker build args로 전달한다.

## Docker Hub 이미지

workflow는 아래 두 태그를 push한다.

```text
<DOCKERHUB_USERNAME>/p-log-frontend:latest
<DOCKERHUB_USERNAME>/p-log-frontend:<commit-sha>
```

## 서버 docker-compose.yml

Lightsail 서버의 `docker-compose.yml`에서 `frontend` 서비스는 Docker Hub 이미지를 사용해야 한다.

```yaml
frontend:
  image: <DOCKERHUB_USERNAME>/p-log-frontend:latest
  container_name: p-log-frontend
  restart: unless-stopped
  env_file:
    - frontend.env
  ports:
    - "127.0.0.1:3000:3000"
```

`build:` 설정이 남아 있으면 서버에서 로컬 빌드를 시도할 수 있으므로 운영 compose에서는 `image:` 기준으로 관리한다.

## 배포 흐름

`main` 브랜치에 push되거나 workflow를 수동 실행하면 다음 순서로 진행된다.

```text
1. pnpm build
2. Docker image build and push
3. Lightsail SSH 접속
4. docker-compose pull frontend
5. docker-compose up -d frontend
```
