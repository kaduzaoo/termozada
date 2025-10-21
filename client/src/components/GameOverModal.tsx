import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GameOverModalProps {
  isOpen: boolean;
  won: boolean;
  word: string;
  attempts: number;
  maxAttempts: number;
  onRestart: () => void;
}

export default function GameOverModal({
  isOpen,
  won,
  word,
  attempts,
  maxAttempts,
  onRestart,
}: GameOverModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 sm:p-8 max-w-sm mx-auto text-center border-2 border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-300">
        {won ? (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-green-500 mb-4">Parabéns!</h2>
            <p className="text-gray-300 mb-2 text-base sm:text-lg">
              Você descobriu a palavra em
            </p>
            <p className="text-3xl font-bold text-white mb-6">
              {attempts} {attempts === 1 ? "tentativa" : "tentativas"}
            </p>
            <p className="text-2xl font-bold text-green-400 mb-6">{word}</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">😢</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-red-500 mb-4">Game Over</h2>
            <p className="text-gray-300 mb-2 text-base sm:text-lg">A palavra era:</p>
            <p className="text-3xl font-bold text-white mb-6">{word}</p>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              Você usou todas as {maxAttempts} tentativas.
            </p>
          </>
        )}

        <Button
          onClick={onRestart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors text-base sm:text-lg"
        >
          Jogar Novamente
        </Button>
      </div>
    </div>
  );
}

