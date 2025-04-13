import React from "react";
import { Question, UserAnswer } from "../types";
import { useTheme } from "../App";

interface QuestionDisplayProps {
  question: Question;
  userAnswer: UserAnswer | undefined;
  onAnswerSelect: (answer: string, blankIndex: number) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  userAnswer,
  onAnswerSelect,
}) => {
  const { darkMode } = useTheme();

  // Split the question text by the blank placeholder
  const questionParts = question.question.split("_____________");

  // Initialize blank selections if they don't exist
  const selections =
    userAnswer?.selectedAnswers || Array(questionParts.length - 1).fill(null);

  // Track which options have been used
  const usedOptions = selections.filter(Boolean);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900/50" : "bg-white"
      } rounded-lg shadow-md p-6 mb-6 transition-colors duration-300`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        Sentence Construction
      </h2>
      <div className="mb-6 text-lg">
        {questionParts.map((part, index) => (
          <React.Fragment key={index}>
            <span className={darkMode ? "text-gray-200" : "text-gray-700"}>
              {part}
            </span>
            {index < questionParts.length - 1 && (
              <span
                className={`mx-2 px-4 py-1 rounded-md inline-block min-w-[120px] text-center ${
                  selections[index]
                    ? darkMode
                      ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700 cursor-pointer"
                      : "bg-blue-100 text-blue-800 cursor-pointer"
                    : darkMode
                    ? "bg-gray-800 border-2 border-dashed border-gray-700"
                    : "bg-gray-100 border-2 border-dashed border-gray-300"
                }`}
                onClick={() => {
                  if (selections[index]) {
                    onAnswerSelect("", index);
                  }
                }}
              >
                <span
                  className={
                    !selections[index] && darkMode ? "text-gray-500" : ""
                  }
                >
                  {selections[index] || "_____________"}
                </span>
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <p
        className={`text-sm ${
          darkMode ? "text-gray-400" : "text-gray-600"
        } mb-4`}
      >
        Choose words to fill all blanks. Click on a filled blank to remove the
        word.
      </p>

      <div className="flex flex-wrap gap-2">
        {question.options.map((option) => (
          <button
            key={option}
            className={`py-2 px-4 rounded-md transition-colors ${
              usedOptions.includes(option)
                ? darkMode
                  ? "bg-indigo-700 text-white"
                  : "bg-blue-600 text-white"
                : darkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => {
              // If option is already used, do nothing
              if (usedOptions.includes(option)) {
                return;
              }

              // Find the first empty blank index
              const emptyIndex = selections.findIndex(
                (answer) => answer === null || answer === ""
              );

              // If all blanks are filled, do nothing
              if (emptyIndex === -1) {
                return;
              }

              onAnswerSelect(option, emptyIndex);
            }}
            disabled={usedOptions.includes(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;
