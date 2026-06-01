# Todo 리스트

체크박스로 할 일을 완료 처리하면 텍스트에 취소선이 그어지고, 각 할 일의 **기한(D-day)**을 표시하는 간단한 Todo 앱입니다. 데이터는 브라우저에 저장되어 새로고침해도 유지됩니다.

> Next.js(App Router) · TypeScript · Tailwind CSS · shadcn/ui 기반의 클라이언트 전용 앱.
> 단일 사용자용이며 서버·DB·인증은 사용하지 않습니다.

## 주요 기능

- ✅ 할 일 추가 / 삭제
- ✅ 체크박스로 완료 토글 → 완료 시 **취소선** 처리
- 📅 할 일별 **기한 표시** 및 D-day 계산(오늘 / 내일 / N일 남음 / N일 지남)
- 🔴 **마감 지난 항목 강조** (완료하면 강조 해제)
- 🔍 필터: 전체 / 진행 중 / 완료, 남은 개수 표시
- 🌙 다크 모드
- 💾 `localStorage` 영속화

## 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript (strict) |
| 스타일 | Tailwind CSS v4 |
| UI | shadcn/ui · lucide-react |
| 날짜 입력 | shadcn `Calendar` + `Popover` |
| 부가 | next-themes · date-fns · sonner |
| 상태 | React 커스텀 훅 + localStorage |

## 시작하기

> 사전 요구: Node.js 20+ 와 npm (pnpm/yarn도 가능)

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

### 빌드 / 검사

```bash
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## 프로젝트 구조

```
app/          # App Router (layout, page, globals.css)
components/    # ui/(shadcn), todo-* 컴포넌트
hooks/         # use-todos.ts — CRUD + localStorage
lib/           # due.ts(기한 계산), utils.ts
types/         # todo.ts
docs/          # 설계 문서
legacy/        # 초기 바닐라 JS 버전(보존)
```

## 문서

- 📄 [개발 계획서](docs/todo-app-plan.md) — 아키텍처, 데이터 모델, 구현 단계
- 🤖 [CLAUDE.md](CLAUDE.md) — Claude Code/기여자용 작업 지침

## 배포

Next.js 앱이므로 [Vercel](https://vercel.com) 배포를 권장합니다. 전부 클라이언트 사이드 동작이라 정적 export도 가능합니다.

> 참고: `legacy/index.html`은 초기 바닐라 버전으로, 현재 GitHub Pages에 배포되어 있습니다.

## 라이선스

MIT
