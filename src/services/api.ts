import { ApiResponse } from "../types";

export const fetchQuizData = async (): Promise<ApiResponse> => {
  try {
    let url = "/data/quiz-data.json"; // Use static file in production

    // Check if we're in development mode
    if (process.env.NODE_ENV === "development") {
      url = "http://localhost:3001/quiz";
    }

    // Fetch the quiz data
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch quiz data");
    }

    const data = await response.json();

    // Add a default timeLimit if needed
    if (data && !data.activity) {
      data.activity = {
        id: "default",
        userId: "default",
        type: "SENTENCE_CONSTRUCTION_TEST",
        coinType: "FREE",
        coins: 0,
        description: "Sentence Construction Test",
        createdAt: new Date().toISOString(),
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    throw error;
  }
};
