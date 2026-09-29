export interface YouTubeMeditation {
  id: string;
  title: string;
  description: string;
  videoId: string;
  thumbnailUrl: string;
  author: string;
  category: "beginner" | "sleep" | "focus" | "anxiety";
}

export const YOUTUBE_MEDITATIONS: YouTubeMeditation[] = [
  {
    id: "yt-1",
    title: "Meditación para calmar la mente y liberar estrés",
    description: "Una guía profunda para relajar el sistema nervioso y encontrar paz interior con Iván Donalson.",
    videoId: "86YLhUGdSWg",
    thumbnailUrl: "https://img.youtube.com/vi/86YLhUGdSWg/hqdefault.jpg",
    author: "Iván Donalson",
    category: "beginner",
  },
  {
    id: "yt-2",
    title: "Conecta con tu Paz Interior y Respiración",
    description: "Ejercicio de respiración consciente para centrarte en el momento presente.",
    videoId: "inpok4MKVLM",
    thumbnailUrl: "https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg",
    author: "Iván Donalson",
    category: "focus",
  },
  {
    id: "yt-3",
    title: "Meditación guiada para dormir profundamente",
    description: "Relajación corporal completa para soltar tensiones antes de descansar.",
    videoId: "ZToicYcHIOU",
    thumbnailUrl: "https://img.youtube.com/vi/ZToicYcHIOU/hqdefault.jpg",
    author: "Iván Donalson",
    category: "sleep",
  },
  {
    id: "yt-4",
    title: "Soltar el control y la ansiedad",
    description: "Práctica guiada para aprender a fluir y soltar la necesidad de controlarlo todo.",
    videoId: "5qap5aO4i9A",
    thumbnailUrl: "https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg",
    author: "Iván Donalson",
    category: "anxiety",
  },
];
