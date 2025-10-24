import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normaliza uma palavra, removendo acentos e convertendo Ç para C.
 * @param word A palavra a ser normalizada.
 * @returns A palavra normalizada em caixa alta.
 */
export function normalizeWord(word: string): string {
  if (!word) return "";
  return word
    .toUpperCase()
    .normalize("NFD") // Decompõe os caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
    .replace(/Ç/g, "C"); // Trata o Ç
}

