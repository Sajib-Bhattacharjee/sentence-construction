import React, { createContext, useContext, useEffect, useReducer } from "react";
import { Question, QuizState, ApiResponse } from "../types";
import { fetchQuizData } from "../services/api";

// Define action types
type ActionType =
  | { type: "FETCH_QUIZ_START" }
  | { type: "FETCH_QUIZ_SUCCESS"; payload: ApiResponse }
  | { type: "FETCH_QUIZ_ERROR"; payload: string }
  | {
      type: "SET_ANSWER";
      payload: { questionId: string; answer: string; blankIndex: number };
    }
  | { type: "NEXT_QUESTION" }
  | { type: "UPDATE_TIMER"; payload: number }
  | { type: "COMPLETE_QUIZ" }
  | { type: "RESET_QUIZ" };

// Context type
interface QuizContextType {
  state: QuizState;
  questions: Question[];
  dispatch: React.Dispatch<ActionType>;
  timeLimit: number;
  currentQuestion: Question | undefined;
  handleAnswerSelection: (selectedAnswer: string, blankIndex: number) => void;
  handleNextQuestion: () => void;
  handleResetQuiz: () => void;
}

// Initial state
const initialState: QuizState = {
  currentQuestionIndex: 0,
  userAnswers: [],
  timeRemaining: 60,
  isQuizComplete: false,
  loading: false,
  error: null,
  questions: [],
};

// Create context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Helper function to check if all blanks are filled
const areAllBlanksFilled = (selectedAnswers: (string | null)[]): boolean => {
  return selectedAnswers.every((answer) => answer !== null && answer !== "");
};

// Helper function to check if the answers are correct
const areAnswersCorrect = (
  selectedAnswers: (string | null)[],
  correctAnswers: string[]
): boolean => {
  if (selectedAnswers.length !== correctAnswers.length) return false;

  return selectedAnswers.every(
    (answer, index) => answer === correctAnswers[index]
  );
};

// Reducer function
const quizReducer = (state: QuizState, action: ActionType): QuizState => {
  switch (action.type) {
    case "FETCH_QUIZ_START":
      return { ...state, loading: true, error: null };
    case "FETCH_QUIZ_SUCCESS":
      return {
        ...state,
        loading: false,
        timeRemaining: 60,
        questions: action.payload.data.questions,
      };
    case "FETCH_QUIZ_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_ANSWER": {
      const { questionId, answer, blankIndex } = action.payload;

      // Find existing user answer or create a new one
      const existingAnswerIndex = state.userAnswers.findIndex(
        (a) => a.questionId === questionId
      );

      // Find the current question for reference
      const currentQuestion = state.questions?.find(
        (q) => q.questionId === questionId
      );
      const blankCount = currentQuestion?.correctAnswer.length || 0;

      if (existingAnswerIndex === -1) {
        // Create a new answer with the appropriate number of blanks
        const newSelectedAnswers = Array(blankCount).fill(null);
        if (blankIndex >= 0 && blankIndex < blankCount) {
          newSelectedAnswers[blankIndex] = answer;
        }

        return {
          ...state,
          userAnswers: [
            ...state.userAnswers,
            {
              questionId,
              selectedAnswers: newSelectedAnswers,
              isCorrect: false, // Will be calculated when all blanks are filled
            },
          ],
        };
      } else {
        // Update existing answer
        const updatedUserAnswers = [...state.userAnswers];
        const updatedAnswer = { ...updatedUserAnswers[existingAnswerIndex] };

        // Update the selected answer at the specified blank index
        const newSelectedAnswers = [...updatedAnswer.selectedAnswers];

        // Ensure the array has the correct size
        while (newSelectedAnswers.length < blankCount) {
          newSelectedAnswers.push(null);
        }

        if (blankIndex >= 0 && blankIndex < blankCount) {
          newSelectedAnswers[blankIndex] = answer;
        }
        updatedAnswer.selectedAnswers = newSelectedAnswers;

        // Check correctness if all blanks are filled
        if (areAllBlanksFilled(newSelectedAnswers) && currentQuestion) {
          updatedAnswer.isCorrect = areAnswersCorrect(
            newSelectedAnswers,
            currentQuestion.correctAnswer
          );
        }

        updatedUserAnswers[existingAnswerIndex] = updatedAnswer;

        return {
          ...state,
          userAnswers: updatedUserAnswers,
        };
      }
    }
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        timeRemaining: 60,
      };
    case "UPDATE_TIMER":
      return { ...state, timeRemaining: action.payload };
    case "COMPLETE_QUIZ":
      return { ...state, isQuizComplete: true };
    case "RESET_QUIZ":
      return { ...initialState };
    default:
      return state;
  }
};

// Provider component
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const timeLimit = 60;

  useEffect(() => {
    const loadQuizData = async () => {
      dispatch({ type: "FETCH_QUIZ_START" });
      try {
        const response = await fetchQuizData();
        dispatch({ type: "FETCH_QUIZ_SUCCESS", payload: response });
      } catch (error) {
        dispatch({
          type: "FETCH_QUIZ_ERROR",
          payload: "Failed to load quiz data",
        });
      }
    };

    loadQuizData();
  }, []);

  // Timer effect
  useEffect(() => {
    if (state.loading || state.isQuizComplete) return;

    const timer = setInterval(() => {
      if (state.timeRemaining > 0) {
        dispatch({ type: "UPDATE_TIMER", payload: state.timeRemaining - 1 });
      } else {
        // Time's up for current question
        const currentQuestion = state.questions[state.currentQuestionIndex];
        if (currentQuestion) {
          // If no answer was selected, mark it as incorrect
          const existingAnswer = state.userAnswers.find(
            (a) => a.questionId === currentQuestion.questionId
          );

          if (!existingAnswer) {
            // Create an empty answer with all blanks set to null
            const blankCount = currentQuestion.correctAnswer.length;
            for (let i = 0; i < blankCount; i++) {
              dispatch({
                type: "SET_ANSWER",
                payload: {
                  questionId: currentQuestion.questionId,
                  answer: "",
                  blankIndex: i,
                },
              });
            }
          }

          // Move to next question or complete quiz
          if (state.currentQuestionIndex < state.questions.length - 1) {
            dispatch({ type: "NEXT_QUESTION" });
          } else {
            dispatch({ type: "COMPLETE_QUIZ" });
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    state.timeRemaining,
    state.currentQuestionIndex,
    state.loading,
    state.isQuizComplete,
    state.questions,
  ]);

  const currentQuestion = state.questions[state.currentQuestionIndex];

  // Helper functions
  const handleAnswerSelection = (
    selectedAnswer: string,
    blankIndex: number
  ) => {
    if (!currentQuestion) return;

    dispatch({
      type: "SET_ANSWER",
      payload: {
        questionId: currentQuestion.questionId,
        answer: selectedAnswer,
        blankIndex,
      },
    });
  };

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      dispatch({ type: "NEXT_QUESTION" });
    } else {
      dispatch({ type: "COMPLETE_QUIZ" });
    }
  };

  const handleResetQuiz = () => {
    dispatch({ type: "RESET_QUIZ" });
  };

  const value = {
    state,
    questions: state.questions,
    dispatch,
    timeLimit,
    currentQuestion: state.questions[state.currentQuestionIndex],
    handleAnswerSelection,
    handleNextQuestion,
    handleResetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

// Hook for using the quiz context
export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
