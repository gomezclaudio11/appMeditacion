// Interfaz para tipar el resultado devuelto por Jamendo
export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  duration: number; // Duración en segundos
  audio: string; // Enlace directo al archivo MP3
  image: string; // Carátula de la pista
}

// Leemos el Client ID desde el archivo .env a través del entorno de Expo
const CLIENT_ID = process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID;

/**
 * Consulta pistas de audio relajantes mediante la API de Jamendo.
 * @param tag Etiqueta de búsqueda (por defecto: 'meditation')
 * @param limit Cantidad de canciones a obtener (por defecto: 10)
 */
export const fetchMeditationMusic = async (
  tag: string = "meditation",
  limit: number = 10,
): Promise<JamendoTrack[]> => {
  // Validación defensiva por si la variable de entorno no está configurada
  if (!CLIENT_ID) {
    console.error(
      "Error: EXPO_PUBLIC_JAMENDO_CLIENT_ID no está definido en el archivo .env",
    );
    return [];
  }

  try {
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=jsonpretty&limit=${limit}&tags=${tag}&audioformat=mp32`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Mapeamos los datos de la API al formato limpio de nuestra interfaz
    const tracks: JamendoTrack[] = data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      artist_name: item.artist_name,
      duration: item.duration,
      audio: item.audio,
      image: item.image,
    }));

    return tracks;
  } catch (error) {
    console.error("Error al consultar la API de música:", error);
    return [];
  }
};
