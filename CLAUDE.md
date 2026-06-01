# CLAUDE.md

이 파일은 이 리포지토리에서 작업하는 Claude Code(및 기여자)를 위한 프로젝트 지침이다.

## 프로젝트 개요

단일 사용자용 **Todo 리스트 웹 앱**. 클라이언트 전용이며 데이터는 브라우저 `localStorage`에 저장한다.
서버·DB·인증은 사용하지 않는다.

- 상세 설계: [`docs/todo-app-plan.md`](docs/todo-app-plan.md)
- 초기 바닐라 JS 버전: [`legacy/index.html`](legacy/index.html) (참고용 보존, 더 이상 개발하지 않음)

## 기술 스택

- **Next.js 16 (App Router, Turbopack)** — 리포 **루트**에 구성
- **TypeScript** (`strict: true`)
- **Tailwind CSS v4**
- **shadcn/ui** (Base UI 기반, 코드 복사형) + `lucide-react`
- **next-themes** (다크 모드), **date-fns** (날짜 포맷), **sonner** (토스트)
- 상태: `useTodos` 훅이 `useSyncExternalStore`로 `localStorage`를 외부 스토어로 구독 — 외부 상태 라이브러리 미사용
- 패키지 매니저: **npm** (corepack 권한 이슈로 pnpm 대신 사용)

## 디렉터리 구조

```
app/          # App Router (layout, page, globals.css)
components/    # ui/(shadcn), todo-* 컴포넌트
hooks/         # use-todos.ts (CRUD + localStorage)
lib/           # due.ts(기한 계산), utils.ts(cn 등)
types/         # todo.ts
docs/          # 설계 문서
legacy/        # 초기 바닐라 버전 (보존)
```

## 명령어

```bash
pnpm install      # 의존성 설치
pnpm dev          # 개발 서버 (http://localhost:3000)
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint
```

## 작업 규칙

- **RSC 경계**: 인터랙티브/`localStorage` 영역만 `"use client"`. `app/page.tsx`는 서버 컴포넌트로 두고 클라이언트 컨테이너만 마운트한다. 하이드레이션 미스매치 방지를 위해 todos는 **클라이언트 마운트 후** 렌더한다.
- **기한 입력**은 shadcn `Calendar` + `Popover`로 구현한다(native `<input type="date">` 사용 금지).
- **타입**은 `types/todo.ts`에 집중하고 `any`를 쓰지 않는다.
- **shadcn 컴포넌트**는 직접 작성하지 말고 `pnpm dlx shadcn@latest add <name>`으로 추가한다.
- **클래스 병합**은 `lib/utils.ts`의 `cn()`을 사용한다.
- 새 의존성·상태 라이브러리 도입은 먼저 제안하고 합의 후 추가한다(범위 최소화 원칙).
- `legacy/`는 수정하지 않는다.

## 핵심 도메인 규칙

- 완료된 항목 텍스트는 취소선 처리(`line-through text-muted-foreground`).
- 기한은 D-day로 표시: 오늘 / 내일 / N일 남음 / N일 지남.
- **마감 지난(overdue) 항목만 강조**하며, 완료되면 강조를 해제한다.
- 날짜 비교는 시각이 아닌 **날짜 단위**로 계산한다(`lib/due.ts`).

## 범위 밖 (요청 없이 추가하지 말 것)

서버 영속화/DB, 인증, 멀티유저 동기화, 드래그앤드롭, 반복 일정·알림.
필요 시 `docs/todo-app-plan.md`의 "추후 확장" 항목으로 논의한다.
