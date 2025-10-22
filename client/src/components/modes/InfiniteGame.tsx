import { useEffect, useState, useCallback } from "react";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import GameOverModal from "@/components/GameOverModal";

const WORD_LENGTH = 5;

type LetterStatus = "correct" | "present" | "absent" | "empty";

interface GuessedWord {
  word: string;
  statuses: LetterStatus[];
}

export default function InfiniteGame() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [guesses, setGuesses] = useState<GuessedWord[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>({});
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
          const randomIndex = Math.floor(Math.random() * wordList.length);
          setCurrentWord(wordList[randomIndex]);
        }
      } catch (error) {
        console.error("Error loading words:", error);
      }
    };

    loadWords();
  }, []);

  const selectNewWord = useCallback((wordList: string[]) => {
    if (wordList.length > 0) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      setCurrentWord(wordList[randomIndex]);
    }
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

    const guess = currentGuess.toUpperCase();

    if (!words.includes(guess)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const statuses: LetterStatus[] = [];

    for (let i = 0; i < WORD_LENGTH; i++) {
      const status = getLetterStatus(guess[i], i, currentWord);
      statuses.push(status);

      setLetterStatuses((prev) => {
        const current = prev[guess[i]] || "empty";
        if (status === "correct") {
          return { ...prev, [guess[i]]: "correct" };
        } else if (status === "present" && current !== "correct") {
          return { ...prev, [guess[i]]: "present" };
        } else if (current === "empty") {
          return { ...prev, [guess[i]]: status };
        }
        return prev;
      });
    }

    const newGuesses = [...guesses, { word: guess, statuses }];
    setGuesses(newGuesses);

    if (guess === currentWord) {
      setWon(true);
      setGameOver(true);
    }

    setCurrentGuess("");
    setCurrentPosition(0);
  }, [currentGuess, currentWord, guesses, words]);

  const handleKeyPress = useCallback(
    (key: string) => {
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
    [currentGuess, currentPosition, handleGuess]
  );

  const handleRestart = useCallback(() => {
    selectNewWord(words);
    setCurrentGuess("");
    setCurrentPosition(0);
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setLetterStatuses({});
  }, [words, selectNewWord]);

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
    <div className={`min-h-screen flex flex-col bg-gray-900 text-white transition-all duration-100 ${shake ? 'animate-shake' : ''}`}>
      <header className="border-b border-gray-700 py-4 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center">INFINITO</h1>
          <p className="text-center text-gray-400 text-sm mt-2">
            Jogue sem limites de tentativas
          </p>
          <p className="text-center text-gray-500 text-xs mt-1">
            Palavras acertadas: {guesses.filter((g) => g.word === currentWord).length}
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-2xl">
          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess}
            currentPosition={currentPosition}
            maxAttempts={Math.max(guesses.length + 2, 6)}
            wordLength={WORD_LENGTH}
            onPositionClick={setCurrentPosition}
          />

          <div className="mt-8">
            <Keyboard onKeyPress={handleKeyPress} letterStatuses={letterStatuses} />
          </div>

          {guesses.length === 0 && !gameOver && (
            <div className="mt-8 bg-gray-800 rounded-lg p-4 text-sm text-gray-300">
              <p className="mb-2">
                <span className="inline-block bg-green-600 text-white px-2 py-1 rounded mr-2">G</span>
                A letra está na posição correta
              </p>
              <p className="mb-2">
                <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded mr-2">O</span>
                A letra está na palavra mas em outra posição
              </p>
              <p>
                <span className="inline-block bg-red-600 text-white px-2 py-1 rounded mr-2">X</span>
                A letra não está na palavra
              </p>
            </div>
          )}
        </div>
      </main>

      <GameOverModal
        isOpen={gameOver}
        won={won}
        word={currentWord}
        attempts={guesses.length}
        maxAttempts={guesses.length}
        onRestart={handleRestart}
      />
    </div>
  );
}

