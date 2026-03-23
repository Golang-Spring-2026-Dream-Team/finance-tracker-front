import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("theme") as Theme) || "light";
};

const applyTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
};

export const useTheme = create<ThemeState>((set) => {
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  return {
    theme: initialTheme,
    toggle: () =>
      set((state) => {
        const nextTheme = state.theme === "light" ? "dark" : "light";
        applyTheme(nextTheme);
        return { theme: nextTheme };
      }),
  };
});
