import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes } from "@/design/styles";

type Theme = "light" | "dark" | "system";
type ColorScheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  palette: typeof themes.light;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@app_theme_preference";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [systemColorScheme, setSystemColorScheme] = useState<ColorScheme>(
    (Appearance.getColorScheme() as ColorScheme) || "light"
  );

  // Determine the active color scheme
  const colorScheme: ColorScheme =
    theme === "system" ? systemColorScheme : (theme as ColorScheme);
  const palette = colorScheme === "dark" ? themes.dark : themes.light;
  const isDark = colorScheme === "dark";

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadTheme();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme((colorScheme as ColorScheme) || "light");
    });

    return () => subscription?.remove();
  }, []);

  // Save theme preference
  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
      setThemeState(newTheme); // Still update state even if storage fails
    }
  };

  const value: ThemeContextType = {
    theme,
    colorScheme,
    palette,
    setTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
