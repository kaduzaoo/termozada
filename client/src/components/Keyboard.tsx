interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: Record<string, "correct" | "present" | "absent" | "empty">;
}

export default function Keyboard({ onKeyPress, letterStatuses }: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "BACKSPACE"],
    ["Z", "X", "C", "V", "B", "N", "M", "ENTER"],
  ];

  const getKeyColor = (letter: string) => {
    const status = letterStatuses[letter];
    switch (status) {
      case "correct":
        return "bg-emerald-600 text-white hover:bg-emerald-700";
      case "present":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "absent":
        return "bg-black text-white hover:bg-gray-800 cursor-not-allowed";
      default:
        return "bg-slate-600 text-white hover:bg-slate-700";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center flex-wrap">
          {row.map((letter) => {
            if (letter === "BACKSPACE") {
              return (
                <button
                  key={letter}
                  onClick={() => onKeyPress("BACKSPACE")}
                  // Usando 'flex-grow' para tentar simular o tamanho do ícone
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
                className={`px-3 py-2 rounded font-semibold text-sm transition-colors ${getKeyColor(letter)}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

