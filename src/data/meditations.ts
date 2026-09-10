import { Meditation, AmbientSound } from '../types/meditation';

export const MEDITATIONS: Meditation[] = [
  {
    id: '1',
    title: 'Calma Interior y Respiración',
    description: 'Una guía suave para conectar con tu respiración y soltar tensiones acumuladas en el día.',
    duration: 300, // 5 minutos
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    category: 'beginner',
    author: 'Lucía Méndez',
  },
  {
    id: '2',
    title: 'Sueño Profundo y Reparador',
    description: 'Relaja cada músculo de tu cuerpo para prepararte para una noche de descanso profundo.',
    duration: 600, // 10 minutos
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b1fc485?auto=format&fit=crop&w=800&q=80',
    category: 'sleep',
    author: 'Mateo Silva',
  },
  {
    id: '3',
    title: 'Enfoque y Claridad Mental',
    description: 'Elimina la neblina mental y encuentra claridad para tus tareas y proyectos del día.',
    duration: 420, // 7 minutos
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80',
    category: 'focus',
    author: 'Lucía Méndez',
  },
  {
    id: '4',
    title: 'Alivio Rápido de Ansiedad',
    description: 'Ejercicios de anclaje y respiración consciente para momentos de estrés elevado.',
    duration: 240, // 4 minutos
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    category: 'anxiety',
    author: 'Dr. Carlos Ruiz',
  },
];

export const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    id: 'rain',
    title: 'Lluvia Suave',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    icon: 'cloud-rain',
  },
  {
    id: 'forest',
    title: 'Bosque Sereno',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    icon: 'tree',
  },
  {
    id: 'waves',
    title: 'Olas del Mar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    icon: 'water',
  },
];
