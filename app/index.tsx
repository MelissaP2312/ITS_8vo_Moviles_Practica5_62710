import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MotiImage } from 'moti';
import { Audio } from 'expo-av';
import { useAudio } from '../contexts/AudioContext'; 

export default function IndexScreen() {
  const router = useRouter();
  const { playSound, stopSound } = useAudio();

  useFocusEffect(
    useCallback(() => {
      playSound(require('../assets/audio/index.mp3'), 0.3); // Reproducir el audio al obtener foco

      return () => {
        stopSound(); // Detener el sonido al perder el foco
      };
    }, []) // Reproducir audio sin esperar que esté cargado
  );


  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(245,245,220,0.95)', 'rgba(241,196,15,0.9)']}
        style={styles.container}
      >
        {/* Logo Pokémon */}
        <MotiImage
          source={require('../assets/images/Pokemon-Logo.png')}
          style={styles.logo}
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 2000,
            delay: 500,
          }}
        />

        {/* Pokébola animada */}
        <MotiImage
          source={require('../assets/images/pokeball.png')}
          style={styles.animatedPokeball}
          from={{ scale: 0.5 }}
          animate={{ scale: 1.2 }}
          transition={{
            type: 'timing',
            duration: 1000,
            loop: true,
            repeatReverse: true,
          }}
        />

        <Text style={styles.title}>Bienvenidos al Centro Pokémon</Text>

        {/* Contenedor de botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.pokeButton}
            onPress={() => router.push('./login')}
          >
            <LinearGradient
              colors={['#e74c3c', '#c0392b']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Ingresar a la PC de Bill</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pokeButton, styles.registerButton]}
            onPress={() => router.push('./signup')}
          >
            <LinearGradient
              colors={['#3498db', '#2980b9']}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText, styles.lightText]}>Unirse al Club de Entrenadores</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/images/charizard.png')}
          style={styles.pokemon}
          resizeMode="contain"
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 10,
  },
  animatedPokeball: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    color: '#d35400',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    fontFamily: 'PokemonSolid',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
    width: '90%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pokeButton: {
    width: '80%',
    height: 60,
    marginVertical: 15,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2c3e50',
  },
  registerButton: {
    borderColor: '#2980b9',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  lightText: {
    color: '#ecf0f1',
  },
  pokemon: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    width: 80,
    height: 80,
    opacity: 0.9,
  },
});
