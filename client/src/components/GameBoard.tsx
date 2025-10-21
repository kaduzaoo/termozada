interface GameBoardProps {
  guesses: Array<{
    word: string;
    statuses: ("correct" | "present" | "absent" | "empty")[];
  }>;
  currentGuess: string;
  maxAttempts: number;
  wordLength: number;
}

export default function GameBoard({
  guesses,
  currentGuess,
  maxAttempts,
  wordLength,
}: GameBoardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-green-600";
      case "present":
        return "bg-yellow-500";
      case "absent":
        return "bg-gray-600";
      default:
        return "bg-gray-700";
    }
  };

  const renderRow = (word: string, statuses: string[], isCurrentGuess: boolean) => {
    return (
      <div key={`${word}-${isCurrentGuess}`} className="flex gap-2 justify-center mb-2">
        {Array.from({ length: wordLength }).map((_, index) => {
          const letter = word[index] || "";
          const status = statuses[index] || "empty";
          const bgColor = getStatusColor(status);

          return (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center rounded font-bold text-lg text-white border-2 border-gray-600 ${bgColor}`}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      {/* Render guessed words */}
      {guesses.map((guess, index) => renderRow(guess.word, guess.statuses, false))}

      {/* Render current guess */}
      {guesses.length < maxAttempts && renderRow(currentGuess, Array(wordLength).fill("empty"), true)}

      {/* Render empty rows */}
      {Array.from({ length: maxAttempts - guesses.length - (guesses.length < maxAttempts ? 1 : 0) }).map(
        (_, index) => (
          <div key={`empty-${index}`} className="flex gap-2 justify-center mb-2">
            {Array.from({ length: wordLength }).map((_, letterIndex) => (
              <div
                key={letterIndex}
                className="w-12 h-12 flex items-center justify-center rounded font-bold text-lg border-2 border-gray-600 bg-gray-700"
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

