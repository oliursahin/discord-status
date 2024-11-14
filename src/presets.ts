import { StatusPreset } from "./types";

export const DEFAULT_PRESETS: StatusPreset[] = [
  { emoji: "🎯", text: "Focusing", duration: 120 },
  { emoji: "🤝", text: "In a meeting", duration: 30 },
  { emoji: "🍽️", text: "Lunch break", duration: 60 },
  { emoji: "☕️", text: "Coffee break", duration: 15 },
  { emoji: "🚶", text: "AFK", duration: null },
];

export const COMMON_EMOJIS = [
  { emoji: "💻", title: "Laptop" },
  { emoji: "🎯", title: "Target" },
  { emoji: "🤝", title: "Handshake" },
  { emoji: "🍽️", title: "Dining" },
  { emoji: "☕️", title: "Coffee" },
]; 