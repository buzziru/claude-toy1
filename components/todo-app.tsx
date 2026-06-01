"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { TodoForm } from "@/components/todo-form";
import { TodoFilters } from "@/components/todo-filters";
import { TodoList } from "@/components/todo-list";
import { useTodos } from "@/hooks/use-todos";
import type { TodoFilter } from "@/types/todo";

export function TodoApp() {
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<TodoFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "completed") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  const remaining = todos.filter((t) => !t.done).length;
  const hasCompleted = todos.some((t) => t.done);

  function handleAdd(title: string, dueDate: string | null) {
    addTodo(title, dueDate);
    toast.success("할 일을 추가했습니다");
  }

  function handleRemove(id: string) {
    removeTodo(id);
    toast("할 일을 삭제했습니다");
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-xl">할 일 목록</CardTitle>
        <CardAction>
          <ThemeToggle />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <TodoForm onAdd={handleAdd} />
        <Separator />
        <TodoFilters
          filter={filter}
          onChange={setFilter}
          remaining={remaining}
          hasCompleted={hasCompleted}
          onClearCompleted={clearCompleted}
        />
        <TodoList todos={filtered} onToggle={toggleTodo} onRemove={handleRemove} />
      </CardContent>
    </Card>
  );
}
