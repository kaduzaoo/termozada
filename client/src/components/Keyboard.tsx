interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: Record<string, "correct" | "present" | "absent" | "empty">;
}

export default function Keyboard({ onKeyPress, letterStatuses }: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const getKeyColor = (letter: string) => {
    const status = letterStatuses[letter];
    switch (status) {
      case "correct":
        return "bg-amber-600 text-white hover:bg-amber-700";
      case "present":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "absent":
        return "bg-slate-500 text-white hover:bg-slate-600 cursor-not-allowed";
      default:
        return "bg-slate-600 text-white hover:bg-slate-700";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((letter) => (
            <button
              key={letter}
              onClick={() => onKeyPress(letter)}
              className={`px-3 py-2 rounded font-semibold text-sm transition-colors ${getKeyColor(letter)}`}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}

      {/* Special keys row */}
      <div className="flex gap-1 justify-center mt-2">
        <button
          onClick={() => onKeyPress("BACKSPACE")}
          className="px-4 py-2 rounded font-semibold text-sm bg-slate-600 text-white hover:bg-slate-700 transition-colors"
        >
          ← Apagar
        </button>
        <button
          onClick={() => onKeyPress("ENTER")}
          className="px-4 py-2 rounded font-semibold text-sm bg-slate-700 text-white hover:bg-slate-800 transition-colors"
        >
          Enviar →
        </button>
      </div>
    </div>
  );
}

