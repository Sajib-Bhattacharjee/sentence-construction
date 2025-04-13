import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import Quiz from "./components/Quiz";
import LandingPage from "./components/LandingPage";
import { initAudioContext } from "./services/audioContext";
import "./App.css";

// Create dark mode context
interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

const App: React.FC = () => {
  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Track if user has interacted with the page
  const userInteractedRef = useRef(false);

  // Update localStorage when dark mode changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Set up global event listeners to initialize audio context on first interaction
  useEffect(() => {
    const initAudioOnInteraction = () => {
      if (!userInteractedRef.current) {
        userInteractedRef.current = true;
        initAudioContext();
      }
    };

    // Add listeners to common user interaction events
    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, initAudioOnInteraction, { once: true });
    });

    // Clean up listeners
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, initAudioOnInteraction);
      });
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const themeContextValue = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <Router>
        <div
          className={`min-h-screen ${
            darkMode
              ? "dark bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-900"
              : "bg-gray-100"
          } transition-colors duration-300`}
          // Initialize audio on direct interaction with main container
          onClick={() => !userInteractedRef.current && initAudioContext()}
        >
          <div className="container mx-auto px-4">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/quiz"
                element={
                  <QuizProvider>
                    <Quiz />
                  </QuizProvider>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;
