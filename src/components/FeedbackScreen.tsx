import React, { useRef } from "react";
import { Question, UserAnswer } from "../types";
import { useTheme } from "../App";
import { playSound } from "../services/soundEffects";
import html2canvas from "html2canvas";

interface FeedbackScreenProps {
  userAnswers: UserAnswer[];
  questions: Question[];
  onReset: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  userAnswers,
  questions,
  onReset,
}) => {
  const { darkMode } = useTheme();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate the score
  const correctAnswers = userAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  const totalQuestions = questions.length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;

  // Get result message based on score
  let resultMessage = "";
  if (scorePercentage >= 90) {
    resultMessage =
      "Excellent! You have a great command of sentence construction!";
  } else if (scorePercentage >= 70) {
    resultMessage =
      "Good job! You have a solid understanding of sentence construction.";
  } else if (scorePercentage >= 50) {
    resultMessage =
      "Not bad. Keep practicing to improve your sentence construction skills.";
  } else {
    resultMessage =
      "You need more practice with sentence construction. Keep trying!";
  }

  const handleShareResults = () => {
    playSound("buttonClick");

    if (navigator.share) {
      navigator
        .share({
          title: "My Sentence Construction Quiz Results",
          text: `I scored ${correctAnswers} out of ${totalQuestions} (${Math.round(
            scorePercentage
          )}%) on the Sentence Construction Quiz!`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback - copy to clipboard
      const textToCopy = `I scored ${correctAnswers} out of ${totalQuestions} (${Math.round(
        scorePercentage
      )}%) on the Sentence Construction Quiz!`;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert("Results copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleDownloadImage = async () => {
    playSound("buttonClick");

    if (!resultsRef.current) return;

    try {
      const canvas = await html2canvas(resultsRef.current);
      const image = canvas.toDataURL("image/png", 1.0);

      // Create a temporary link element
      const downloadLink = document.createElement("a");
      downloadLink.href = image;
      downloadLink.download = "quiz-results.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white"
      } rounded-lg shadow-lg p-6 max-w-4xl mx-auto transition-colors duration-300`}
      ref={resultsRef}
    >
      <h1
        className={`text-2xl font-bold text-center mb-6 ${
          darkMode
            ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
            : "text-gray-800"
        }`}
      >
        Quiz Results
      </h1>

      <div
        className={`${
          darkMode ? "bg-indigo-900/30" : "bg-blue-50"
        } rounded-lg p-4 mb-6 text-center`}
      >
        <h2 className="text-xl font-semibold mb-2">
          Your Score: {correctAnswers} out of {totalQuestions}
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
          <div
            className={`h-4 rounded-full ${
              scorePercentage >= 70
                ? "bg-green-500"
                : scorePercentage >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${scorePercentage}%` }}
          />
        </div>
        <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
          {resultMessage}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={handleShareResults}
          className={`px-4 py-2 ${
            darkMode
              ? "bg-indigo-700 hover:bg-indigo-800"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white rounded-md flex items-center gap-2 transition-colors`}
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share Results
        </button>

        <button
          onClick={handleDownloadImage}
          className={`px-4 py-2 ${
            darkMode
              ? "bg-purple-700 hover:bg-purple-800"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white rounded-md flex items-center gap-2 transition-colors`}
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Results
        </button>
      </div>

      <div
        className={`divide-y ${
          darkMode ? "divide-gray-700" : "divide-gray-200"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Question Review</h3>

        {questions.map((question, index) => {
          const userAnswer = userAnswers.find(
            (answer) => answer.questionId === question.questionId
          );
          const isCorrect = userAnswer?.isCorrect || false;
          const questionParts = question.question.split("_____________");

          return (
            <div key={question.questionId} className="py-4">
              <div className="flex items-start">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
                    isCorrect
                      ? `${
                          darkMode
                            ? "bg-green-900/30 text-green-400"
                            : "bg-green-100 text-green-600"
                        }`
                      : `${
                          darkMode
                            ? "bg-red-900/30 text-red-400"
                            : "bg-red-100 text-red-600"
                        }`
                  }`}
                >
                  {isCorrect ? "✓" : "✗"}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    } mb-2`}
                  >
                    Question {index + 1}
                  </h4>
                  <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {/* Render the sentence with multiple blanks */}
                    {questionParts.map((part, idx) => (
                      <React.Fragment key={idx}>
                        {part}
                        {idx < questionParts.length - 1 && (
                          <span
                            className={`mx-1 px-2 py-0.5 rounded inline-block font-medium ${
                              isCorrect ||
                              userAnswer?.selectedAnswers[idx] ===
                                question.correctAnswer[idx]
                                ? `${
                                    darkMode
                                      ? "bg-green-900/30 text-green-400"
                                      : "bg-green-100 text-green-600"
                                  }`
                                : `${
                                    darkMode
                                      ? "bg-red-900/30 text-red-400"
                                      : "bg-red-100 text-red-600"
                                  }`
                            }`}
                          >
                            {userAnswer?.selectedAnswers[idx] || "(no answer)"}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {!isCorrect && (
                    <div
                      className={`mt-3 p-3 rounded-md ${
                        darkMode ? "bg-gray-700/50" : "bg-gray-50"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Correct Answer:
                      </p>
                      <div
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {questionParts.map((part, idx) => (
                          <React.Fragment key={`correct-${idx}`}>
                            {part}
                            {idx < questionParts.length - 1 && (
                              <span
                                className={`mx-1 px-2 py-0.5 rounded inline-block font-medium ${
                                  darkMode
                                    ? "bg-green-900/30 text-green-400"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {question.correctAnswer[idx]}
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            onReset();
            playSound("buttonClick");
          }}
          className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium shadow-md hover:shadow-lg`}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default FeedbackScreen;
