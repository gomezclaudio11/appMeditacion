import { createAudioPlayer } from "expo-audio";

/**
 * Reproduce el sonido de un cuenco tibetano (campana de inicio/fin de sesión).
 */
export const playTibetanBowl = async () => {
  try {
    const player = createAudioPlayer({
      uri: "https://actions.google.com/sounds/v1/ambiences/tibetan_singing_bowl.ogg",
    });
    player.play();
  } catch (error) {
    console.error("Error al reproducir el cuenco tibetano:", error);
  }
};
