import { useState } from "react";
import { Button } from "@/components/ui/button";
import SingleGame from "./modes/SingleGame";
import DuoGame from "./modes/DuoGame";
import QuartetGame from "./modes/QuartetGame";
import SextupleGame from "./modes/SextupleGame";

type GameModeType = "single" | "duo" | "quartet" | "sextuple";

export default function GameMode() {
  const [mode, setMode] = useState<GameModeType>("single");
  const [showMenu, setShowMenu] = useState(false);

  const modes = [
    { id: "single", label: "Termo", icon: "🎮" },
    { id: "duo", label: "Dueto", icon: "👥" },
    { id: "quartet", label: "Quarteto", icon: "👫" },
    { id: "sextuple", label: "Sexotupleto", icon: "👨‍👩‍👧‍👦" },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hamburger Menu */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Menu Dropdown */}
        {showMenu && (
          <div className="absolute top-12 left-0 bg-gray-800 rounded-lg shadow-lg py-2 min-w-48">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id as GameModeType);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 transition-colors ${
                  mode === m.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="mr-2">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Game Content */}
      <div className="pt-4">
        {mode === "single" && <SingleGame />}
        {mode === "duo" && <DuoGame />}
        {mode === "quartet" && <QuartetGame />}
        {mode === "sextuple" && <SextupleGame />}
      </div>
    </div>
  );
}

