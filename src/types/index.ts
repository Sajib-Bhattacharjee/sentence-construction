export interface Question {
  questionId: string;
  question: string;
  questionType: string;
  answerType: string;
  options: string[];
  correctAnswer: string[];
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  coinType: string;
  coins: number;
  description: string;
  createdAt: string;
}

export interface ApiResponse {
  status: string;
  data: {
    testId: string;
    questions: Question[];
  };
  message: string;
  activity: Activity;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswers: (string | null)[];
  isCorrect: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  timeRemaining: number;
  isQuizComplete: boolean;
  loading: boolean;
  error: string | null;
  questions: Question[];
}
