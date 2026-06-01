export type DueStatus = "none" | "overdue" | "today" | "tomorrow" | "upcoming";

export interface DueInfo {
  status: DueStatus;
  label: string | null;
  diffDays: number | null;
}

/** yyyy-MM-dd 문자열을 로컬 자정 기준 Date로 파싱(타임존 영향 제거) */
function parseLocalDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** 기한과 오늘을 날짜 단위로 비교해 상태와 라벨(오늘/내일/N일 남음/N일 지남)을 계산 */
export function getDueInfo(dueDate: string | null, now: Date = new Date()): DueInfo {
  if (!dueDate) return { status: "none", label: null, diffDays: null };

  const today = startOfDay(now);
  const due = parseLocalDate(dueDate);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return { status: "overdue", label: `${-diffDays}일 지남`, diffDays };
  if (diffDays === 0) return { status: "today", label: "오늘", diffDays };
  if (diffDays === 1) return { status: "tomorrow", label: "내일", diffDays };
  return { status: "upcoming", label: `${diffDays}일 남음`, diffDays };
}
