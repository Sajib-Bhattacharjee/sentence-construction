import React from "react";

interface TimerProps {
  timeRemaining: number;
  timeLimit: number;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, timeLimit = 60 }) => {
  // Calculate progress percentage
  const progressPercentage = (timeRemaining / timeLimit) * 100;

  // Determine color based on time remaining
  let colorClass = "bg-green-500";
  if (timeRemaining < timeLimit * 0.3) {
    colorClass = "bg-red-500";
  } else if (timeRemaining < timeLimit * 0.6) {
    colorClass = "bg-yellow-500";
  }

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="w-full mt-4 mb-6">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span>Time Remaining</span>
        <span>{formatTime(timeRemaining)}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-linear`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
