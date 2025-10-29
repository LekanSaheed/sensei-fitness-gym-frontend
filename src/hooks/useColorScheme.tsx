import { useEffect, useState } from "react";

export function useColorScheme() {
  const [scheme, setScheme] = useState<"light" | "dark">(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("color-scheme");
      if (saved === "light" || saved === "dark") return saved;

      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return prefersDark ? "dark" : "light";
    }
    return "light"; // Default during SSR
  });

  // Update localStorage and optional side-effects
  useEffect(() => {
    document.documentElement.classList.toggle("dark", scheme === "dark");
    localStorage.setItem("color-scheme", scheme);
  }, [scheme]);

  // Toggle function
  const toggleScheme = () => {
    setScheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { scheme, toggleScheme };
}
