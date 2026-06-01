"use client";

import { useSyncExternalStore } from "react";
import type { Todo } from "@/types/todo";

const STORAGE_KEY = "claude-todos";

// localStorage를 외부 스토어로 구독한다(useSyncExternalStore).
// 이렇게 하면 SSR 하이드레이션이 안전하고, 탭 간 동기화도 자연스럽게 얻는다.
const EMPTY: Todo[] = [];
let snapshot: Todo[] = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();

function read(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): Todo[] {
  if (!initialized) {
    snapshot = read();
    initialized = true;
  }
  return snapshot;
}

function getServerSnapshot(): Todo[] {
  return EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      snapshot = read();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function update(updater: (prev: Todo[]) => Todo[]) {
  snapshot = updater(getSnapshot());
  initialized = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // 저장 실패(용량 초과 등)는 무시
  }
  listeners.forEach((l) => l());
}

export function useTodos() {
  const todos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function addTodo(title: string, dueDate: string | null) {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      done: false,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    update((prev) => [todo, ...prev]);
  }

  function toggleTodo(id: string) {
    update((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function removeTodo(id: string) {
    update((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    update((prev) => prev.filter((t) => !t.done));
  }

  return { todos, addTodo, toggleTodo, removeTodo, clearCompleted };
}
