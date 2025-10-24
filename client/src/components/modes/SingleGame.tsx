import { useEffect, useState, useCallback } from "react";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import GameOverModal from "@/components/GameOverModal";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

type LetterStatus = "correct" | "present" | "absent" | "empty";

interface GuessedWord {
  word: string;
  statuses: LetterStatus[];
}

export default function SingleGame() {
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
        const basePath = import.meta.env.BASE_URL || '/';
        const response = await fetch(basePath + "verbos.txt");
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
    if (gameOver) return;

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
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
    }

    setCurrentGuess("");
    setCurrentPosition(0);
  }, [currentGuess, currentWord, gameOver, guesses, words]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver) return;

      if (key === "BACKSPACE") {
        let newGuess = currentGuess;
        let newPosition = currentPosition;
        
        if (currentGuess[currentPosition]) {
          // Se a posição atual tem uma letra, apaga e mantém a posição
          newGuess = currentGuess.slice(0, currentPosition) + currentGuess.slice(currentPosition + 1);
        } else if (currentPosition > 0) {
          // Se a posição está vazia, apaga a anterior e recua
          newGuess = currentGuess.slice(0, currentPosition - 1) + currentGuess.slice(currentPosition);
          newPosition = currentPosition - 1;
        }

        setCurrentGuess(newGuess);
        setCurrentPosition(newPosition);

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
      } else if (key.length === 1 && /^[A-Z]$/i.test(key)) {
        // Insere a letra na posição atual
        let newGuess = currentGuess.slice(0, currentPosition) + key.toUpperCase() + currentGuess.slice(currentPosition + 1);
        setCurrentGuess(newGuess);

        // Avança para a próxima posição vazia ou para a próxima posição se a palavra não estiver completa
        let nextPosition = currentPosition + 1;
        while (nextPosition < WORD_LENGTH && newGuess[nextPosition]) {
          nextPosition++;
        }

        if (nextPosition < WORD_LENGTH) {
          setCurrentPosition(nextPosition);
        } else if (currentPosition < WORD_LENGTH - 1) {
          setCurrentPosition(currentPosition + 1);
        }
      }
    },
    [gameOver, currentGuess, currentPosition, handleGuess]
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
      } else if (/^[A-Z]$/i.test(key)) {
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center">TERMO DA RAÇA</h1>
          <p className="text-center text-gray-400 text-sm mt-2">
            Descubra a palavra certa em {MAX_ATTEMPTS} tentativas
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess}
            currentPosition={currentPosition}
            maxAttempts={MAX_ATTEMPTS}
            wordLength={WORD_LENGTH}
            onPositionClick={setCurrentPosition}
          />

          <div className="mt-8">
            <Keyboard onKeyPress={handleKeyPress} letterStatuses={letterStatuses} />
          </div>

          {guesses.length === 0 && !gameOver && (
            <div className="mt-8 bg-slate-700 rounded-lg p-4 text-sm text-slate-300">
              <p className="mb-2">
                <span className="inline-block bg-emerald-600 text-white px-2 py-1 rounded mr-2">G</span>
                A letra está na posição correta
              </p>
              <p className="mb-2">
                <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded mr-2">O</span>
                A letra está na palavra mas em outra posição
              </p>
              <p>
                <span className="inline-block bg-slate-500 text-white px-2 py-1 rounded mr-2">X</span>
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
        maxAttempts={MAX_ATTEMPTS}
        onRestart={handleRestart}
      />
    </div>
  );
}

