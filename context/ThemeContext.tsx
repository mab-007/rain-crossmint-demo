import React, { createContext, useState, useContext, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: typeof lightColors;
}

const lightColors = {
    background: "#ffffff",
    card: "#ffffff",
    text: "#000000",
    subtext: "#666666",
    primary: "#59d102",
    border: "#e8e8e8",
    iconBg: "#f0fdf4",
    danger: "#ff3b30",
};

const darkColors = {
    background: "#1a1a1a",
    card: "#2a2a2a",
    text: "#ffffff",
    subtext: "#999999",
    primary: "#d4ff00",
    border: "#3a3a3a",
    iconBg: "rgba(255,255,255,0.1)",
    danger: "#ff453a",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const colors = theme === "light" ? lightColors : darkColors;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
