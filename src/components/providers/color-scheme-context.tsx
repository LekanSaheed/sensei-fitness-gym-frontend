"use client";
import { createContext, useContext, useEffect, useState } from "react";

type ColorScheme = "light" | "dark";

interface ColorSchemeContextType {
  scheme: ColorScheme;
  toggleScheme: () => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
  undefined
);

export const ColorSchemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("color-scheme");
      if (saved === "light" || saved === "dark") return saved;
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return prefersDark ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("color-scheme", scheme);
  }, [scheme]);

  const toggleScheme = () =>
    setScheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeContext.Provider value={{ scheme, toggleScheme }}>
      <div className={scheme === "dark" ? "dark" : ""}>{children}</div>
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => {
  const ctx = useContext(ColorSchemeContext);
  if (!ctx)
    throw new Error("useColorScheme must be used inside ColorSchemeProvider");
  return ctx;
};
