import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext<any>(null);

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }: any) => {
  const [sound, setSound] = useState<any>(null);

  const playSound = async (audioFile: any, volume: number = 1) => {
    // Detener cualquier sonido que esté sonando antes de reproducir uno nuevo
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(audioFile, { volume });
      setSound(newSound);
      await newSound.playAsync(); // Reproducir el sonido inmediatamente
    } catch (error) {
      console.error("Error al cargar el sonido: ", error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  };

  useEffect(() => {
    return () => {
      // Detener cualquier sonido cuando el componente principal se desmonte
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <AudioContext.Provider value={{ playSound, stopSound }}>
      {children}
    </AudioContext.Provider>
  );
};
