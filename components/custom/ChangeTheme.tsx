"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const ToggleTheme = ({ text = false }: { text: boolean }) => {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  // ✅ evita que el server renderice algo distinto al cliente
  if (!mounted) {
    return <Button variant="ghost" size="icon" aria-label="Toggle dark mode" className="bg-transparent" disabled />;
  }

  return (
    <div onClick={toggleTheme} aria-label="Toggle dark mode" className="flex flex-nowrap justify-center items-center m-0 p-0">
      <div className="mr-2 text-white">{isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</div>
      {text ? "Cambiar tema" : ""}
    </div>
  );
};

export default ToggleTheme;
