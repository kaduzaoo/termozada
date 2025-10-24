interface SmartKeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: Record<string, "correct" | "present" | "absent" | "empty">[];
  numBoards?: number;
}

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "BACKSPACE"],
  ["Z", "X", "C", "V", "B", "N", "M", "ENTER"],
];

const getColorClass = (status: "correct" | "present" | "absent" | "empty") => {
  switch (status) {
    case "correct":
      return "bg-emerald-600";
    case "present":
      return "bg-yellow-500";
    case "absent":
      return "bg-slate-500";
    default:
      return "bg-slate-600";
  }
};

export default function SmartKeyboard({
  onKeyPress,
  letterStatuses,
  numBoards = 1,
}: SmartKeyboardProps) {
  const getStatusForBoard = (letter: string, boardIndex: number) => {
    return letterStatuses[boardIndex]?.[letter] || "empty";
  };

  const renderKey = (letter: string) => {
    if (numBoards === 1) {
      // Modo single - teclado normal
      const status = letterStatuses[0]?.[letter] || "empty";

      if (letter === "BACKSPACE") {
        return (
          <button
            key={letter}
            onClick={() => onKeyPress("BACKSPACE")}
            className="px-3 py-2 rounded font-semibold text-sm transition-colors bg-slate-600 text-white hover:bg-slate-700 flex-grow"
          >
            ←
          </button>
        );
      }
      if (letter === "ENTER") {
        return (
          <button
            key={letter}
            onClick={() => onKeyPress("ENTER")}
            className="px-4 py-2 rounded font-semibold text-sm transition-colors bg-teal-600 text-white hover:bg-teal-700 flex-grow"
          >
            ENVIAR
          </button>
        );
      }

      return (
        <button
          key={letter}
          onClick={() => onKeyPress(letter)}
          className={`px-3 py-2 rounded font-bold text-sm transition-all text-white hover:opacity-80 ${getColorClass(status)}`}
        >
          {letter}
        </button>
      );
    }

    // Modo múltiplo - dividir a letra em quadrantes
    const statuses = Array.from({ length: numBoards }).map((_, i) =>
      getStatusForBoard(letter, i)
    );

    // Determinar layout de grid baseado no número de telas
    let gridCols = 2;
    let gridRows = 1;
    if (numBoards === 4) {
      gridCols = 2;
      gridRows = 2;
    } else if (numBoards === 7) {
      gridCols = 3;
      gridRows = 3;
    }

    return (
      <div
        key={letter}
        className="relative w-10 h-10 rounded font-bold text-sm text-white cursor-pointer hover:opacity-80 transition-all border border-gray-600 overflow-hidden"
        onClick={() => onKeyPress(letter)}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        }}
      >
        {/* Dividir a letra em quadrantes por tela */}
        {statuses.map((status, index) => (
          <div
            key={index}
            className={`flex items-center justify-center ${getColorClass(status)} border border-gray-800`}
            title={`Tela ${index + 1}: ${status}`}
          />
        ))}

        {/* Mostrar a letra no centro com sombra */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white font-bold drop-shadow-lg text-base">{letter}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center flex-wrap">
          {row.map((letter) => renderKey(letter))}
        </div>
      ))}
    </div>
  );
}

