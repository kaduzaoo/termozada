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
  const getKeyColor = (letter: string, boardIndex: number) => {
    const status = letterStatuses[letter] || "empty";
    
    // Dividir letras entre telas
    const lettersPerBoard = 26 / numBoards;
    const letterIndex = letter.charCodeAt(0) - 65; // A=0, Z=25
    const assignedBoard = Math.floor(letterIndex / lettersPerBoard);
    
    // Se a letra não foi testada nesta tela, mostrar cinza claro (não testado)
    if (assignedBoard !== boardIndex && status === "empty") {
      return "bg-gray-600 text-gray-400 opacity-50";
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

  const renderKeyboard = (boardIndex: number = 0) => {
    return (
      <div className="flex flex-col gap-2">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((letter) => (
              <button
                key={letter}
                onClick={() => onKeyPress(letter)}
                className={`px-3 py-2 rounded font-bold text-sm transition-all ${getKeyColor(letter, boardIndex)}`}
              >
                {letter}
              </button>
            ))}
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
    return renderKeyboard(0);
  }

  // Para múltiplas telas, mostrar teclados divididos
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: numBoards }).map((_, index) => (
        <div key={index} className="border-t border-gray-700 pt-4">
          <h3 className="text-xs text-gray-400 mb-2 text-center">Tela {index + 1}</h3>
          {renderKeyboard(index)}
        </div>
      ))}
    </div>
  );
}

