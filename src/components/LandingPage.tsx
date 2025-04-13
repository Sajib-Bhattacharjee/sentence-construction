import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SettingsPanel from "./SettingsPanel";
import { useTheme } from "../App";
import { playSound, unlockAudio } from "../services/soundEffects";
import { initAudioContext } from "../services/audioContext";

interface LandingPageProps {
  handleStart?: () => void;
  handleBack?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  handleStart: propHandleStart,
  handleBack: propHandleBack,
}) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Initialize audio on component mount
  useEffect(() => {
    // Attempt to initialize audio
    initAudioContext();
    unlockAudio();
  }, []);

  const handleStart = () => {
    // Try to unlock audio first (will help with mobile browsers)
    unlockAudio();
    playSound("buttonClick");

    if (propHandleStart) {
      propHandleStart();
    } else {
      navigate("/quiz");
    }
  };

  const handleBack = () => {
    unlockAudio();
    playSound("buttonClick");

    if (propHandleBack) {
      propHandleBack();
    } else {
      // This would typically go back to a previous page or home
      console.log("Back button clicked");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "dark bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-900"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      } transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="flex justify-end mb-6">
          <SettingsPanel />
        </div>

        <div className="text-center mb-12">
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${
              darkMode
                ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300"
                : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
            } mb-6`}
          >
            Sentence Construction
          </h1>
          <p
            className={`text-lg sm:text-xl ${
              darkMode ? "text-gray-200" : "text-gray-600"
            } max-w-2xl mx-auto leading-relaxed`}
          >
            Complete the sentences by selecting the appropriate words and
            placing them in the correct order. Test your language skills and
            earn rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div
            className={`${
              darkMode
                ? "bg-gray-900/70 shadow-lg shadow-indigo-900/30"
                : "bg-white"
            } rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 ${
                  darkMode ? "bg-indigo-950 text-indigo-300" : "bg-indigo-100"
                } rounded-full flex items-center justify-center mb-4`}
              >
                <svg
                  className={`w-6 h-6 ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                } mb-2`}
              >
                Time Per Question
              </h2>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                1 minute
              </p>
            </div>
          </div>

          <div
            className={`${
              darkMode
                ? "bg-gray-900/70 shadow-lg shadow-indigo-900/30"
                : "bg-white"
            } rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 ${
                  darkMode ? "bg-purple-950 text-purple-300" : "bg-purple-100"
                } rounded-full flex items-center justify-center mb-4`}
              >
                <svg
                  className={`w-6 h-6 ${
                    darkMode ? "text-purple-300" : "text-purple-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                } mb-2`}
              >
                Total Questions
              </h2>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-purple-300" : "text-purple-600"
                }`}
              >
                10
              </p>
            </div>
          </div>

          <div
            className={`${
              darkMode
                ? "bg-gray-900/70 shadow-lg shadow-indigo-900/30"
                : "bg-white"
            } rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 ${
                  darkMode ? "bg-amber-950 text-amber-300" : "bg-yellow-100"
                } rounded-full flex items-center justify-center mb-4`}
              >
                <svg
                  className={`w-6 h-6 ${
                    darkMode ? "text-amber-300" : "text-yellow-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                } mb-2`}
              >
                Coins Required
              </h2>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-amber-300" : "text-yellow-600"
                }`}
              >
                <span>20</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
          <button
            onClick={handleBack}
            className={`px-8 py-3 border-2 ${
              darkMode
                ? "border-gray-800 text-gray-200 hover:bg-gray-800/60 hover:border-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            } rounded-full font-semibold transition-all duration-300 flex items-center justify-center group`}
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <button
            onClick={() => {
              // Initialize audio context and unlock audio playback
              initAudioContext();
              unlockAudio();
              handleStart();
            }}
            className={`px-8 py-3 ${
              darkMode
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            } 
              rounded-full text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group`}
          >
            Start Test
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
