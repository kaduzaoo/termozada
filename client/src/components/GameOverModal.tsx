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
      // Prevent scrolling when modal is open
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-sm mx-4 text-center">
        {won ? (
          <>
            <h2 className="text-3xl font-bold text-green-500 mb-4">Parabéns! 🎉</h2>
            <p className="text-gray-300 mb-6">
              Você descobriu a palavra em <span className="font-bold text-white">{attempts}</span> tentativa
              {attempts !== 1 ? "s" : ""}!
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over</h2>
            <p className="text-gray-300 mb-2">A palavra era:</p>
            <p className="text-2xl font-bold text-white mb-6">{word}</p>
            <p className="text-gray-400 mb-6">Você usou todas as {maxAttempts} tentativas.</p>
          </>
        )}

        <Button
          onClick={onRestart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Jogar Novamente
        </Button>
      </div>
    </div>
  );
}

