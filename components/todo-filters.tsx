"use client";

import { Button } from "@/components/ui/button";
import type { TodoFilter } from "@/types/todo";

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

interface TodoFiltersProps {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
  remaining: number;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export function TodoFilters({
  filter,
  onChange,
  remaining,
  hasCompleted,
  onClearCompleted,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex gap-1">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onChange(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{remaining}개 남음</span>
        {hasCompleted && (
          <Button variant="ghost" size="sm" onClick={onClearCompleted}>
            완료 삭제
          </Button>
        )}
      </div>
    </div>
  );
}
