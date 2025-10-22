interface SmartKeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: Record<string, "correct" | "present" | "absent" | "empty">;
  numBoards?: number;
}

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function SmartKeyboard({
  onKeyPress,
  letterStatuses,
  numBoards = 1,
}: SmartKeyboardProps) {
  // Dividir as letras do alfabeto entre as telas
  const getLettersForBoard = (boardIndex: number): Set<string> => {
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const lettersPerBoard = Math.ceil(26 / numBoards);
    const startIndex = boardIndex * lettersPerBoard;
    const endIndex = startIndex + lettersPerBoard;
    return new Set(allLetters.slice(startIndex, endIndex));
  };

  const getKeyColor = (letter: string, boardIndex: number) => {
    const status = letterStatuses[letter] || "empty";
    const boardLetters = getLettersForBoard(boardIndex);
    
    // Se a letra não pertence a esta tela, mostrar cinza apagado
    if (!boardLetters.has(letter)) {
      return "bg-gray-600 text-gray-400 opacity-40 cursor-not-allowed";
    }

    switch (status) {
      case "correct":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "present":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "absent":
        return "bg-red-600 hover:bg-red-700 text-white";
      default:
        return "bg-gray-700 hover:bg-gray-600 text-white";
    }
  };

  const renderKeyboardForBoard = (boardIndex: number) => {
    const boardLetters = getLettersForBoard(boardIndex);

    return (
      <div className="flex flex-col gap-2">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((letter) => {
              const isInThisBoard = boardLetters.has(letter);
              return (
                <button
                  key={letter}
                  onClick={() => isInThisBoard && onKeyPress(letter)}
                  disabled={!isInThisBoard}
                  className={`px-3 py-2 rounded font-bold text-sm transition-all ${getKeyColor(letter, boardIndex)}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
        <div className="flex gap-1 justify-center mt-2">
          <button
            onClick={() => onKeyPress("BACKSPACE")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold text-sm transition-all"
          >
            ← Apagar
          </button>
          <button
            onClick={() => onKeyPress("ENTER")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-sm transition-all"
          >
            Enviar →
          </button>
        </div>
      </div>
    );
  };

  // Para modo single, retornar teclado normal
  if (numBoards === 1) {
    return renderKeyboardForBoard(0);
  }

  // Para múltiplas telas, mostrar teclados divididos e independentes
  return (
    <div className="flex flex-col gap-6 w-full">
      {Array.from({ length: numBoards }).map((_, index) => (
        <div key={index} className="border-t border-gray-700 pt-4">
          <h3 className="text-sm font-bold mb-3 text-center text-blue-400">
            Teclado da Palavra {index + 1}
          </h3>
          {renderKeyboardForBoard(index)}
        </div>
      ))}
    </div>
  );
}

