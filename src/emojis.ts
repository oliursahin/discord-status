export interface Emoji {
  emoji: string;
  name: string;
  keywords: string[];
}

// Map emoji codes to actual emojis
export const discordEmojiCodeMap: { [key: string]: string } = {
  ":laptop:": "💻",
  ":dart:": "🎯",
  ":handshake:": "🤝",
  ":fork_and_knife:": "🍽️",
  ":coffee:": "☕️",
  ":walking:": "🚶",
  ":mobile_phone:": "📱",
  ":memo:": "📝",
  ":headphones:": "🎧",
  ":house:": "🏠",
  ":speech_balloon:": "💬",
  ":calendar:": "📅",
  ":airplane:": "✈️",
  ":car:": "🚗",
  ":beach:": "🏖️",
  ":sick:": "🤒",
  ":sleeping:": "😴",
  ":book:": "📚",
  ":gym:": "🏋️",
  ":phone:": "📞",
  ":video_camera:": "📹",
  ":microphone:": "🎤",
  ":clock:": "⏰",
  ":mail:": "📧"
};

export const emojis = [
  {
    emoji: "💻",
    name: "Laptop",
    keywords: ["computer", "work", "tech"]
  },
  {
    emoji: "🎯",
    name: "Focus",
    keywords: ["target", "focusing", "concentration"]
  },
  {
    emoji: "🤝",
    name: "Meeting",
    keywords: ["handshake", "collaboration", "meeting"]
  },
  {
    emoji: "🍽️",
    name: "Lunch",
    keywords: ["food", "eating", "meal", "dining"]
  },
  {
    emoji: "☕️",
    name: "Coffee",
    keywords: ["coffee", "drink", "caffeine"]
  },
  {
    emoji: "🚶",
    name: "Walking",
    keywords: ["walking", "exercise", "move", "stroll"]
  },
  {
    emoji: "📱",
    name: "Mobile Phone",
    keywords: ["phone", "mobile", "smartphone"]
  },
  {
    emoji: "📝",
    name: "Memo",
    keywords: ["note", "memo", "writing"]
  },
  {
    emoji: "🎧",
    name: "Headphones",
    keywords: ["earphones", "music", "audio"]
  },
  {
    emoji: "🏠",
    name: "House",
    keywords: ["home", "building", "house"]
  },
  {
    emoji: "📅",
    name: "Calendar",
    keywords: ["schedule", "date", "planning"]
  },
  {
    emoji: "✈️",
    name: "Airplane",
    keywords: ["travel", "flight", "vacation", "trip"]
  },
  {
    emoji: "🚗",
    name: "Car",
    keywords: ["driving", "commute", "travel"]
  },
  {
    emoji: "🏖️",
    name: "Beach",
    keywords: ["vacation", "holiday", "relaxing"]
  },
  {
    emoji: "🤒",
    name: "Sick",
    keywords: ["ill", "unwell", "fever"]
  },
  {
    emoji: "😴",
    name: "Sleeping",
    keywords: ["sleep", "rest", "nap"]
  },
  {
    emoji: "📚",
    name: "Books",
    keywords: ["reading", "study", "learning"]
  },
  {
    emoji: "🏋️",
    name: "Gym",
    keywords: ["workout", "exercise", "fitness"]
  },
  {
    emoji: "📞",
    name: "Phone",
    keywords: ["call", "telephone", "contact"]
  },
  {
    emoji: "📹",
    name: "Video",
    keywords: ["recording", "camera", "filming"]
  },
  {
    emoji: "🎤",
    name: "Microphone",
    keywords: ["speaking", "presentation", "singing"]
  },
  {
    emoji: "⏰",
    name: "Alarm",
    keywords: ["time", "clock", "schedule"]
  },
  {
    emoji: "📧",
    name: "Email",
    keywords: ["mail", "message", "communication"]
  },
  {
    emoji: "💬",
    name: "Speech Balloon",
    keywords: ["speech", "balloon", "chat", "message"]
  }
] as const;

export function getEmoji(query: string): Emoji[] {
  const lowercaseQuery = query.toLowerCase();
  return emojis.filter((emoji) => {
    return (
      emoji.name.toLowerCase().includes(lowercaseQuery) ||
      emoji.keywords.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery))
    );
  });
}

export function getEmojiForCode(code: string, options?: { fallbackEmoji: string }) {
  return discordEmojiCodeMap[code] ?? options?.fallbackEmoji ?? "💬";
}

export function getCodeForEmoji(emoji: string, options?: { fallbackCode: string }) {
  return (
    Object.entries(discordEmojiCodeMap).find(([, value]) => value === emoji)?.[0] ??
    options?.fallbackCode ??
    ":speech_balloon:"
  );
} 