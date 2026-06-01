import { TodoApp } from "@/components/todo-app";

export default function Home() {
  return (
    <main className="flex min-h-screen items-start justify-center p-6 sm:p-10">
      <TodoApp />
    </main>
  );
}
