interface GameBoardProps {
  guesses: Array<{
    word: string;
    statuses: ("correct" | "present" | "absent" | "empty")[];
  }>;
  currentGuess: string;
  currentPosition: number;
  maxAttempts: number;
  wordLength: number;
  onPositionClick: (position: number) => void;
}

export default function GameBoard({
  guesses,
  currentGuess,
  currentPosition,
  maxAttempts,
  wordLength,
  onPositionClick,
}: GameBoardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-emerald-600 border-emerald-500";
      case "present":
        return "bg-yellow-500 border-yellow-400";
      case "absent":
        return "bg-slate-500 border-slate-400";
      default:
        return "bg-slate-600 border-slate-500";
    }
  };

  const renderRow = (word: string, statuses: string[], rowIndex: number, isCurrentGuess: boolean) => {
    return (
      <div key={`row-${rowIndex}`} className="flex gap-2 justify-center mb-2">
        {Array.from({ length: wordLength }).map((_, index) => {
          const letter = word[index] || "";
          const status = statuses[index] || "empty";
          const bgColor = getStatusColor(status);
          const isActive = isCurrentGuess && index === currentPosition;

          return (
            <div
              key={index}
              onClick={() => isCurrentGuess && onPositionClick(index)}
              className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded font-bold text-lg sm:text-xl text-white border-2 transition-all duration-300 cursor-pointer ${bgColor} ${
                isActive ? "ring-2 ring-blue-400" : ""
              }`}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Render guessed words */}
      {guesses.map((guess, index) => renderRow(guess.word, guess.statuses, index, false))}

      {/* Render current guess */}
      {guesses.length < maxAttempts && renderRow(currentGuess, Array(wordLength).fill("empty"), guesses.length, true)}

      {/* Render empty rows */}
      {Array.from({ length: maxAttempts - guesses.length - (guesses.length < maxAttempts ? 1 : 0) }).map(
        (_, index) => (
          <div key={`empty-${index}`} className="flex gap-2 justify-center mb-2">
            {Array.from({ length: wordLength }).map((_, letterIndex) => (
              <div
                key={letterIndex}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded font-bold text-lg border-2 border-slate-500 bg-slate-600"
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

