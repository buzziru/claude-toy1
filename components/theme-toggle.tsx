"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// 서버/하이드레이션 시 false, 클라이언트 마운트 후 true (setState-in-effect 없이)
const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="테마 전환"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* 마운트 전에는 아이콘 미표시로 하이드레이션 불일치 방지 */}
      {mounted && (isDark ? <Sun /> : <Moon />)}
    </Button>
  );
}
