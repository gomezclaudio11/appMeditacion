export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number; // en segundos
  audioUrl: string;
  imageUrl: string;
  category: 'sleep' | 'anxiety' | 'focus' | 'beginner';
  author: string;
}

export interface AmbientSound {
  id: string;
  title: string;
  audioUrl: string;
  icon: string;
}
