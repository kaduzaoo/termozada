import { useEffect, useState, useCallback } from "react";
import GameBoard from "@/components/GameBoard";
import SmartKeyboard from "@/components/SmartKeyboard";
import GameOverModal from "@/components/GameOverModal";

const MAX_ATTEMPTS = 7;
const WORD_LENGTH = 5;
const NUM_BOARDS = 2;

type LetterStatus = "correct" | "present" | "absent" | "empty";

interface GuessedWord {
  word: string;
  statuses: LetterStatus[];
}

interface BoardState {
  word: string;
  guesses: GuessedWord[];
  won: boolean;
}

export default function DuoGame() {
  const [words, setWords] = useState<string[]>([]);
  const [boards, setBoards] = useState<BoardState[]>(
    Array(NUM_BOARDS).fill(null).map(() => ({
      word: "",
      guesses: [],
      won: false,
    }))
  );
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>[]>([
    {},
    {},
  ]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch("/verbos.txt");
        const text = await response.text();
        const wordList = text
          .split("\n")
          .map((word) => word.trim().toUpperCase())
          .filter((word) => word.length === WORD_LENGTH && word.length > 0);
        setWords(wordList);
        
        if (wordList.length > 0) {
          const newBoards = Array(NUM_BOARDS).fill(null).map(() => {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            return {
              word: wordList[randomIndex],
              guesses: [],
              won: false,
            };
          });
          setBoards(newBoards);
        }
      } catch (error) {
        console.error("Error loading words:", error);
      }
    };

    loadWords();
  }, []);

  const getLetterStatus = (letter: string, position: number, word: string): LetterStatus => {
    if (word[position] === letter) {
      return "correct";
    }
    if (word.includes(letter)) {
      return "present";
    }
    return "absent";
  };

  const handleGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) return;
    if (gameOver) return;

    const guess = currentGuess.toUpperCase();

    if (!words.includes(guess)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    let allWon = true;
    const newBoards = boards.map((board, boardIndex) => {
      if (board.guesses.length >= MAX_ATTEMPTS || board.won) {
        return board;
      }

      const statuses: LetterStatus[] = [];
      for (let i = 0; i < WORD_LENGTH; i++) {
        const status = getLetterStatus(guess[i], i, board.word);
        statuses.push(status);

        setLetterStatuses((prev) => {
          const newStatuses = [...prev];
          const boardStatuses = { ...newStatuses[boardIndex] };
          const current = boardStatuses[guess[i]] || "empty";
          if (status === "correct") {
            boardStatuses[guess[i]] = "correct";
          } else if (status === "present" && current !== "correct") {
            boardStatuses[guess[i]] = "present";
          } else if (current === "empty") {
            boardStatuses[guess[i]] = status;
          }
          newStatuses[boardIndex] = boardStatuses;
          return newStatuses;
        });
      }

      const newGuesses = [...board.guesses, { word: guess, statuses }];
      const won = guess === board.word;

      if (!won && newGuesses.length < MAX_ATTEMPTS) {
        allWon = false;
      }

      return {
        ...board,
        guesses: newGuesses,
        won,
      };
    });

    setBoards(newBoards);

    if (allWon || newBoards.some((b) => b.guesses.length >= MAX_ATTEMPTS && !b.won)) {
      setGameOver(true);
    }

    setCurrentGuess("");
    setCurrentPosition(0);
  }, [currentGuess, gameOver, boards, words]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver) return;

      if (key === "BACKSPACE") {
        if (currentPosition > 0) {
          const newGuess = currentGuess.slice(0, currentPosition - 1);
          setCurrentGuess(newGuess);
          setCurrentPosition(currentPosition - 1);
        }
      } else if (key === "ENTER") {
        handleGuess();
      } else if (key === "ARROWLEFT") {
        if (currentPosition > 0) {
          setCurrentPosition(currentPosition - 1);
        }
      } else if (key === "ARROWRIGHT") {
        if (currentPosition < WORD_LENGTH - 1) {
          setCurrentPosition(currentPosition + 1);
        }
      } else if (key.length === 1 && currentPosition < WORD_LENGTH) {
        const newGuess = currentGuess.slice(0, currentPosition) + key.toUpperCase() + currentGuess.slice(currentPosition + 1);
        setCurrentGuess(newGuess);
        if (currentPosition < WORD_LENGTH - 1) {
          setCurrentPosition(currentPosition + 1);
        }
      }
    },
    [gameOver, currentGuess, currentPosition, handleGuess]
  );

  const handleRestart = useCallback(() => {
    if (words.length > 0) {
      const newBoards = Array(NUM_BOARDS).fill(null).map(() => {
        const randomIndex = Math.floor(Math.random() * words.length);
        return {
          word: words[randomIndex],
          guesses: [],
          won: false,
        };
      });
      setBoards(newBoards);
      setCurrentGuess("");
      setCurrentPosition(0);
      setGameOver(false);
      setLetterStatuses([{}, {}]);
    }
  }, [words]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();

      if (key === "ENTER") {
        e.preventDefault();
        handleKeyPress("ENTER");
      } else if (key === "BACKSPACE") {
        e.preventDefault();
        handleKeyPress("BACKSPACE");
      } else if (key === "ARROWLEFT") {
        e.preventDefault();
        handleKeyPress("ARROWLEFT");
      } else if (key === "ARROWRIGHT") {
        e.preventDefault();
        handleKeyPress("ARROWRIGHT");
      } else if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-800 text-white transition-all duration-100 ${shake ? 'animate-shake' : ''}`}>
      <header className="border-b border-slate-700 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center">DUETO</h1>
          <p className="text-center text-gray-400 text-sm mt-2">
            Resolva 2 palavras simultaneamente em {MAX_ATTEMPTS} tentativas
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {boards.map((board, index) => (
              <div key={index} className="flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4">Palavra {index + 1}</h2>
                <GameBoard
                  guesses={board.guesses}
                  currentGuess={currentGuess}
                  currentPosition={currentPosition}
                  maxAttempts={MAX_ATTEMPTS}
                  wordLength={WORD_LENGTH}
                  onPositionClick={(pos) => setCurrentPosition(pos)}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <SmartKeyboard onKeyPress={handleKeyPress} letterStatuses={letterStatuses} numBoards={NUM_BOARDS} />
          </div>
        </div>
      </main>

      <GameOverModal
        isOpen={gameOver}
        won={boards.every((b) => b.won)}
        word={boards.map((b) => b.word).join(" / ")}
        attempts={boards[0].guesses.length}
        maxAttempts={MAX_ATTEMPTS}
        onRestart={handleRestart}
      />
    </div>
  );
}

