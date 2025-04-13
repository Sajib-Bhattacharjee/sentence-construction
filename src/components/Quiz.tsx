import React, { useEffect, useState } from "react";
import { useQuiz } from "../context/QuizContext";
import QuestionDisplay from "./QuestionDisplay";
import Timer from "./Timer";
import ProgressBar from "./ProgressBar";
import FeedbackScreen from "./FeedbackScreen";
import LoadingSpinner from "./LoadingSpinner";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { playSound, unlockAudio } from "../services/soundEffects";
import { useTheme } from "../App";
import SettingsPanel from "./SettingsPanel";
import { initAudioContext } from "../services/audioContext";

const Quiz: React.FC = () => {
  const {
    state,
    timeLimit,
    currentQuestion,
    handleAnswerSelection,
    handleNextQuestion,
    handleResetQuiz,
  } = useQuiz();

  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<Record<string, boolean>>({});
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Find the user's answer for the current question
  const currentUserAnswer = currentQuestion
    ? state.userAnswers.find(
        (answer) => answer.questionId === currentQuestion.questionId
      )
    : undefined;

  // Count the number of blanks that have been filled
  const filledBlankCount = currentUserAnswer
    ? currentUserAnswer.selectedAnswers.filter(
        (answer) => answer !== null && answer !== ""
      ).length
    : 0;

  // Count the total number of blanks in the current question
  const totalBlankCount = currentQuestion
    ? currentQuestion.correctAnswer.length
    : 0;

  // Determine if the Next button should be enabled - all blanks must be filled
  const isNextButtonEnabled = filledBlankCount === totalBlankCount;

  // Determine if this question already used a hint
  const isHintUsed = currentQuestion
    ? hintsUsed[currentQuestion.questionId] || false
    : false;

  // Update window size on resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Try to unlock audio on component mount
  useEffect(() => {
    // Attempt to initialize audio
    initAudioContext();
    unlockAudio();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 1-4 for selecting options
      if (e.key >= "1" && e.key <= "4" && currentQuestion) {
        const optionIndex = parseInt(e.key) - 1;
        if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
          const emptyIndex =
            currentUserAnswer?.selectedAnswers.findIndex(
              (answer) => answer === null || answer === ""
            ) ?? 0;

          if (emptyIndex !== -1) {
            handleAnswerSelection(
              currentQuestion.options[optionIndex],
              emptyIndex
            );
            playSound("buttonClick");
          }
        }
      }
      // Enter key for Next button
      else if (e.key === "Enter" && isNextButtonEnabled) {
        handleNextQuestion();
        playSound("buttonClick");
      }
      // Escape key to exit quiz
      else if (e.key === "Escape") {
        navigate("/");
        playSound("buttonClick");
      }
      // H key for hint
      else if (e.key === "h" && currentQuestion && !isHintUsed) {
        toggleHint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentQuestion,
    handleAnswerSelection,
    handleNextQuestion,
    isNextButtonEnabled,
    navigate,
    currentUserAnswer,
    isHintUsed,
  ]);

  // Play sounds for correct/incorrect answers
  useEffect(() => {
    if (!currentUserAnswer) return;

    // Only play sound when all blanks are filled and we've determined correctness
    if (filledBlankCount === totalBlankCount) {
      if (currentUserAnswer.isCorrect) {
        playSound("correct");
      } else {
        playSound("incorrect");
      }
    }
  }, [currentUserAnswer?.isCorrect, filledBlankCount, totalBlankCount]);

  // Show confetti effect when all blanks are filled correctly
  useEffect(() => {
    if (currentUserAnswer?.isCorrect) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentUserAnswer?.isCorrect]);

  // Show timer warning when time is running low
  useEffect(() => {
    if (state.timeRemaining === 10) {
      playSound("timerWarning");
    }
  }, [state.timeRemaining]);

  // Handle the completion of the quiz
  useEffect(() => {
    if (state.isQuizComplete) {
      playSound("complete");
    }
  }, [state.isQuizComplete]);

  // Show loading spinner when data is being fetched
  if (state.loading) {
    return <LoadingSpinner />;
  }

  // Show error message if there was an error
  if (state.error) {
    return (
      <div
        className={`text-center p-6 ${
          darkMode ? "text-red-400" : "text-red-600"
        }`}
      >
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{state.error}</p>
        <button
          onClick={handleResetQuiz}
          className={`mt-4 ${
            darkMode
              ? "bg-indigo-700 hover:bg-indigo-800"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 px-4 rounded-md transition-colors`}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show feedback screen when quiz is complete
  if (state.isQuizComplete) {
    return (
      <FeedbackScreen
        userAnswers={state.userAnswers}
        questions={state.questions}
        onReset={handleResetQuiz}
      />
    );
  }

  const toggleHint = () => {
    // Allow toggling even if hint is used - this enables hiding the hint
    setShowHint(!showHint);

    // Only mark hint as used if it's the first time showing it
    if (!showHint && !isHintUsed && currentQuestion) {
      setHintsUsed((prev) => ({
        ...prev,
        [currentQuestion.questionId]: true,
      }));
    }

    playSound("buttonClick");
  };

  // Generate a hint for the current question
  const getHint = () => {
    if (!currentQuestion) return "";

    // Get the first blank's correct answer if it's not filled yet
    if (filledBlankCount === 0) {
      return `First word should be "${currentQuestion.correctAnswer[0]}"`;
    }

    // Get a hint for the next unfilled blank
    const nextEmptyIndex = currentUserAnswer?.selectedAnswers.findIndex(
      (answer) => answer === null || answer === ""
    );

    if (nextEmptyIndex !== undefined && nextEmptyIndex !== -1) {
      return `Next blank should be "${currentQuestion.correctAnswer[nextEmptyIndex]}"`;
    }

    return "Try a different arrangement of words";
  };

  return (
    <div
      className={`max-w-4xl mx-auto p-4 relative ${
        darkMode ? "text-gray-200" : ""
      }`}
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            navigate("/");
            playSound("buttonClick");
          }}
          className={`flex items-center gap-2 ${
            darkMode
              ? "text-gray-300 hover:text-gray-100"
              : "text-gray-600 hover:text-gray-900"
          } transition-colors`}
          aria-label="Back to home"
        >
          <svg
            className="w-5 h-5"
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
          <span>Home</span>
        </button>
        <h1
          className={`text-2xl font-bold text-center ${
            darkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300"
              : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
          }`}
        >
          Sentence Construction
        </h1>
        <SettingsPanel />
      </div>

      {currentQuestion && (
        <>
          <div
            className={`${
              darkMode
                ? "bg-gray-900/70 shadow-lg shadow-indigo-900/30"
                : "bg-white"
            } rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300`}
          >
            <ProgressBar
              currentQuestionIndex={state.currentQuestionIndex}
              totalQuestions={state.questions.length}
            />

            <Timer timeRemaining={state.timeRemaining} timeLimit={timeLimit} />

            <QuestionDisplay
              question={currentQuestion}
              userAnswer={currentUserAnswer}
              onAnswerSelect={(answer, index) => {
                handleAnswerSelection(answer, index);
                if (answer) playSound("buttonClick");
              }}
            />

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-4">
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {filledBlankCount} of {totalBlankCount} blanks filled
                </div>

                <button
                  onClick={toggleHint}
                  className={`px-3 py-1 rounded-md ${
                    showHint
                      ? `${
                          darkMode
                            ? "bg-amber-800 hover:bg-amber-700"
                            : "bg-amber-600 hover:bg-amber-500"
                        } text-white`
                      : isHintUsed
                      ? `${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                            : "bg-gray-300 hover:bg-gray-200 text-gray-700"
                        }`
                      : `${
                          darkMode
                            ? "bg-amber-700 hover:bg-amber-600"
                            : "bg-amber-500 hover:bg-amber-600"
                        } text-white`
                  } text-sm transition-colors`}
                >
                  {isHintUsed && !showHint
                    ? "Show Used Hint"
                    : showHint
                    ? "Hide Hint"
                    : "Show Hint"}
                </button>
              </div>

              <button
                onClick={() => {
                  handleNextQuestion();
                  playSound("buttonClick");
                }}
                disabled={!isNextButtonEnabled}
                className={`py-2 px-6 rounded-md transition-colors ${
                  isNextButtonEnabled
                    ? darkMode
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
                    : `${
                        darkMode
                          ? "bg-gray-800 text-gray-600"
                          : "bg-gray-300 text-gray-500"
                      } cursor-not-allowed`
                }`}
              >
                {state.currentQuestionIndex === state.questions.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>

            {showHint && (
              <div
                className={`mt-4 p-3 rounded-md ${
                  darkMode
                    ? "bg-amber-900/30 text-amber-300 border border-amber-800"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                } text-sm`}
              >
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Hint:</p>
                    <p>{getHint()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`${
              darkMode
                ? "bg-gray-900/70 shadow-lg shadow-indigo-900/30 border border-gray-800"
                : "bg-white"
            } rounded-lg shadow-lg p-4 text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } transition-colors duration-300`}
          >
            <h3 className="font-medium mb-2">Keyboard Shortcuts:</h3>
            <ul className="grid grid-cols-2 gap-2">
              <li>
                <kbd
                  className={`px-2 py-0.5 ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  } rounded`}
                >
                  1-4
                </kbd>{" "}
                Select answers
              </li>
              <li>
                <kbd
                  className={`px-2 py-0.5 ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  } rounded`}
                >
                  Enter
                </kbd>{" "}
                Next question
              </li>
              <li>
                <kbd
                  className={`px-2 py-0.5 ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  } rounded`}
                >
                  H
                </kbd>{" "}
                Show/hide hint
              </li>
              <li>
                <kbd
                  className={`px-2 py-0.5 ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  } rounded`}
                >
                  Esc
                </kbd>{" "}
                Exit quiz
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
