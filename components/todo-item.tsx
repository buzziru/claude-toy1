"use client";

import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getDueInfo } from "@/lib/due";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  const due = getDueInfo(todo.dueDate);
  const overdue = due.status === "overdue" && !todo.done;

  return (
    <li className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <Checkbox
        checked={todo.done}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={todo.done ? "완료 취소" : "완료로 표시"}
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate",
            todo.done && "text-muted-foreground line-through"
          )}
        >
          {todo.title}
        </p>
        {due.label && (
          <Badge variant={overdue ? "destructive" : "secondary"} className="mt-1">
            기한 {todo.dueDate} · {due.label}
          </Badge>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        aria-label="삭제"
        onClick={() => onRemove(todo.id)}
      >
        <Trash2 />
      </Button>
    </li>
  );
}
