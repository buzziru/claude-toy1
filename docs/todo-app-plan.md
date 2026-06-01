# Todo 리스트 애플리케이션 개발 계획

> Next.js(App Router) · TypeScript · Tailwind CSS · shadcn/ui 기반 Todo 앱 구현 계획서
> 최종 업데이트: 2026-06-01

---

## 1. 개요

기존 단일 `index.html`(바닐라 JS) Todo 앱을 모던 프론트엔드 스택으로 재구성한다.
핵심 사용자 가치는 그대로 유지하고, 컴포넌트 구조·타입 안전성·디자인 시스템을 더한다.

### 핵심 기능 (기존 앱에서 계승)
- 할 일 추가 / 삭제
- 체크박스로 완료 토글 → **완료 시 텍스트에 취소선(line-through)**
- 할 일별 **기한(due date) 표시** 및 D-day 계산(오늘/내일/N일 남음/N일 지남)
- **마감 지난 항목 강조**(완료된 항목은 강조 해제)
- 새로고침 후에도 유지(localStorage 영속화)

### 이번 버전에서 추가하는 기능 (합리적 범위)
- 필터링: 전체 / 진행 중 / 완료
- 남은 개수 표시 + 완료 항목 일괄 삭제
- 빈 상태(Empty state) UI
- 토스트 알림(추가/삭제 피드백)
- 다크 모드 지원(`next-themes`)

> **범위 결정 근거:** 인증·DB·다중 사용자·서버 동기화는 이번 범위에서 제외한다.
> 단일 사용자 클라이언트 앱으로 충분하며, 불필요한 복잡도를 피한다(추후 확장 섹션 참고).

---

## 2. 기술 스택

| 영역 | 선택 | 비고 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | RSC 기본, `app/` 디렉터리 (구현 시점 최신) |
| 언어 | TypeScript (strict) | `strict: true` |
| 스타일 | Tailwind CSS v4 | shadcn/ui가 사용하는 토큰 기반 |
| UI 컴포넌트 | shadcn/ui | Radix 기반, 코드 복사형(의존성 X) |
| 아이콘 | lucide-react | shadcn/ui 기본 아이콘셋 |
| 테마 | next-themes | 다크 모드 토글 |
| 상태/영속화 | React state + 커스텀 훅(`useTodos`) + localStorage | 외부 상태 라이브러리 불필요 |
| 날짜 | date-fns | D-day 계산·포맷(경량) |
| 패키지 매니저 | pnpm (권장) | npm/yarn도 무방 |

> **상태 관리 결정 근거:** Todo 앱 규모에서는 Zustand/Redux가 과하다.
> `useReducer` 또는 단순 `useState`를 캡슐화한 커스텀 훅 + localStorage 동기화로 충분하다.
> 추후 규모가 커지면 Zustand로 승격하기 쉬운 구조로 둔다.

---

## 3. 데이터 모델

```ts
// types/todo.ts
export interface Todo {
  id: string;          // crypto.randomUUID()
  title: string;       // 할 일 내용
  done: boolean;       // 완료 여부
  dueDate: string | null; // ISO yyyy-MM-dd, 기한 없으면 null
  createdAt: string;   // ISO timestamp
}

export type TodoFilter = "all" | "active" | "completed";
```

### 기한 상태 파생 로직
```ts
// lib/due.ts
export type DueStatus = "none" | "overdue" | "today" | "tomorrow" | "upcoming";
// dueDate와 오늘 날짜를 비교해 상태 + 라벨(예: "3일 남음")을 반환
export function getDueInfo(dueDate: string | null): {
  status: DueStatus;
  label: string | null;
};
```

---

## 4. 프로젝트 구조

```
claude-todo/                 # Next.js 앱을 리포 루트에 구성
├─ app/
│  ├─ layout.tsx            # 루트 레이아웃 + ThemeProvider + Toaster
│  ├─ page.tsx              # 메인 페이지 (Todo 앱 셸)
│  └─ globals.css           # Tailwind + shadcn 토큰
├─ components/
│  ├─ ui/                   # shadcn/ui 생성 컴포넌트 (button, input, checkbox 등)
│  ├─ todo-app.tsx          # "use client" 최상위 컨테이너
│  ├─ todo-form.tsx         # 입력(제목 + 기한) + 추가
│  ├─ todo-list.tsx         # 목록 렌더 + 빈 상태
│  ├─ todo-item.tsx         # 단일 항목(체크박스·취소선·기한 배지·삭제)
│  ├─ todo-filters.tsx      # 전체/진행중/완료 필터 + 남은 개수
│  └─ theme-toggle.tsx      # 다크 모드 토글
├─ hooks/
│  └─ use-todos.ts          # CRUD + localStorage 동기화
├─ lib/
│  ├─ due.ts                # 기한 상태/라벨 계산
│  └─ utils.ts              # cn() 등 shadcn 유틸
├─ types/
│  └─ todo.ts
├─ docs/
│  └─ todo-app-plan.md      # (이 문서)
└─ legacy/
   └─ index.html            # 초기 바닐라 JS 버전(보존)
```

> **RSC vs Client 경계:** localStorage·이벤트 핸들러를 쓰는 인터랙티브 영역은
> `todo-app.tsx`부터 `"use client"`로 묶는다. `app/page.tsx`는 서버 컴포넌트로 두고
> 클라이언트 컨테이너만 마운트한다(하이드레이션 미스매치 방지를 위해 마운트 후 렌더).

---

## 5. 사용할 shadcn/ui 컴포넌트

| 컴포넌트 | 용도 |
|----------|------|
| `button` | 추가 / 삭제 / 필터 / 완료 일괄삭제 |
| `input` | 할 일 제목 입력 |
| `checkbox` | 완료 토글 |
| `card` | 앱 컨테이너 |
| `badge` | 기한 표시(상태별 색상) |
| `calendar` + `popover` | 기한 날짜 선택 (shadcn `Calendar`를 `Popover`로 띄움) |
| `tabs` 또는 `toggle-group` | 필터 UI |
| `sonner` | 토스트 알림 |
| `separator` | 구분선 |

설치 예:
```bash
pnpm dlx shadcn@latest add button input checkbox card badge popover calendar tabs sonner separator
```

---

## 6. 컴포넌트별 책임

- **`todo-app.tsx`** — `useTodos` 훅 보유, 필터 상태 관리, 하위에 props 전달. 클라이언트 마운트 후에만 목록 렌더(SSR 불일치 방지).
- **`todo-form.tsx`** — 제목 + 기한 입력, 빈 제목 제출 방지, 추가 후 입력 초기화 + 토스트.
- **`todo-filters.tsx`** — `all/active/completed` 전환, "N개 남음" 표시, 완료 항목 일괄 삭제 버튼.
- **`todo-list.tsx`** — 필터링된 배열 렌더, 항목 0개일 때 Empty state.
- **`todo-item.tsx`** — 체크박스(완료 시 `line-through text-muted-foreground`), 기한 `Badge`(overdue는 destructive 색), 삭제 버튼.

---

## 7. 핵심 구현 메모

### localStorage 동기화 훅
```ts
// hooks/use-todos.ts (요지)
const KEY = "claude-todos";
// 1) 초기값: 마운트 후 localStorage에서 로드 (SSR 안전)
// 2) todos 변경 시 useEffect로 저장
// 3) add/toggle/remove/clearCompleted 함수 제공
```

### 취소선(요구사항 1)
```tsx
<span className={cn("flex-1", todo.done && "line-through text-muted-foreground")}>
  {todo.title}
</span>
```

### 기한 표시(요구사항 2)
```tsx
{dueInfo.label && (
  <Badge variant={dueInfo.status === "overdue" && !todo.done ? "destructive" : "secondary"}>
    {dueInfo.label}
  </Badge>
)}
```

---

## 8. 구현 단계 (마일스톤)

각 단계 끝에 검증 기준을 둔다.

1. **프로젝트 부트스트랩**
   `create-next-app`(TS·Tailwind·App Router) → `shadcn init` → 컴포넌트 추가
   - ✅ 검증: `pnpm dev` 기동, 기본 페이지 렌더
2. **타입·유틸 작성** (`types/todo.ts`, `lib/due.ts`)
   - ✅ 검증: `getDueInfo`에 대한 단위 테스트(오늘/내일/지남 케이스)
3. **`useTodos` 훅 + localStorage**
   - ✅ 검증: 추가/토글/삭제 후 새로고침 시 유지
4. **UI 조립** (form → list → item → filters)
   - ✅ 검증: 체크 시 취소선, 기한 배지, overdue 강조 육안 확인
5. **테마·토스트·빈 상태 마감**
   - ✅ 검증: 다크 모드 전환, 추가/삭제 토스트, 0개 상태 표시
6. **품질 점검**
   - ✅ 검증: `pnpm build` 무에러, `pnpm lint`, 기본 접근성(라벨/포커스) 확인

---

## 9. 초기 셋업 명령

```bash
# 1) 앱 생성 (리포 루트에 생성 — 현재 디렉터리에 구성)
pnpm create next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*"

# 2) shadcn/ui 초기화
pnpm dlx shadcn@latest init

# 3) 필요한 컴포넌트 추가
pnpm dlx shadcn@latest add button input checkbox card badge popover calendar tabs sonner separator

# 4) 부가 패키지
pnpm add date-fns next-themes

# 5) 개발 서버
pnpm dev
```

> **배포:** 기존처럼 정적 GitHub Pages로는 한계가 있으므로(Next.js),
> Vercel 배포를 권장한다. 정적 export(`output: "export"`)로도 가능하나
> 이 앱은 전부 클라이언트 사이드라 `next export` 또는 Vercel 모두 적합.

---

## 10. 접근성 / UX 체크리스트
- 입력에 `label`/`aria-label` 연결, Enter로 추가
- 체크박스·삭제 버튼 키보드 포커스 및 포커스 링
- 기한 배지에 색상뿐 아니라 텍스트로도 상태 전달(색맹 대응)
- 모바일 반응형(작은 화면에서 폼 세로 정렬)

---

## 11. 추후 확장 (이번 범위 밖)
- 서버 영속화(DB) + 인증 → 기기 간 동기화
- 카테고리/태그, 우선순위, 정렬
- 드래그 앤 드롭 정렬
- 반복 일정·알림(Notification API)
- 검색
- 상태 관리를 Zustand로 승격

---

## 12. 결정 사항 요약 (가정)
- 단일 사용자, 클라이언트 전용, 영속화는 localStorage.
- 상태 라이브러리 미사용(커스텀 훅).
- 기한 입력은 shadcn `Calendar`를 `Popover`로 띄워 선택.
- 앱은 **리포지토리 루트**에 생성. 기존 바닐라 버전은 `legacy/index.html`로 이동·보존.

> 위 가정 중 변경이 필요하면(예: DB 도입, 멀티유저, 앱 위치) 알려주세요. 계획을 조정합니다.
