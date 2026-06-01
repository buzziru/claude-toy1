export interface Todo {
  id: string;
  title: string;
  done: boolean;
  /** ISO yyyy-MM-dd, 기한 없으면 null */
  dueDate: string | null;
  createdAt: string;
}

export type TodoFilter = "all" | "active" | "completed";
