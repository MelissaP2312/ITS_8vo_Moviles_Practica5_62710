import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { useAudio } from '@/contexts/AudioContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiImage } from 'moti';
import { Audio } from 'expo-av';
import { api } from '@/services/api';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { playSound, stopSound } = useAudio();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await api.register(email, password);
      Alert.alert('¡Registro exitoso!', 'Ahora puedes iniciar sesión.');
      router.push('/');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo registrar');
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      playSound(require('../assets/audio/register.mp3'), 0.2); // Reproducir el audio al obtener foco

      return () => {
        stopSound(); // Detener el sonido al perder el foco
      };
    }, []) // Reproducir audio sin esperar que esté cargado
  );

  return (
    <View style={styles.wrapper}>
      {/* Botón de flecha en la esquina superior izquierda */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/')}
      >
        <MaterialIcons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <LinearGradient
        colors={['rgba(200, 240, 255, 0.95)', 'rgba(0, 160, 255, 0.9)']}
        style={styles.container}
      >
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

        <Text style={styles.title}>¡Únete a la Liga Pokémon!</Text>

        {/* Pokebola animada */}
        <MotiImage
          source={require('../assets/images/pokeball.png')}
          style={styles.pokeball}
          from={{ scale: 0.5 }}
          animate={{ scale: 1.2 }}
          transition={{
            type: 'timing',
            duration: 1000,
            loop: true,
            repeatReverse: true,
          }}
        />

        {/* Campo de correo */}
        <LinearGradient colors={['#3498db', '#2980b9']} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ID de entrenador"
            placeholderTextColor="#fff"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </LinearGradient>

        {/* Campo de contraseña */}
        <LinearGradient colors={['#3498db', '#2980b9']} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Código secreto"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </LinearGradient>

        {/* Botón de registro */}
        <TouchableOpacity style={styles.pokeButton} onPress={handleRegister}>
          <LinearGradient colors={['#e74c3c', '#c0392b']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>¡Unirme al equipo!</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Link a login */}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/')}>
          <Text style={styles.secondaryButtonText}>¿Ya tienes cuenta? Entra al PokéCentro</Text>
        </TouchableOpacity>

        {/* Abra animado */}
        <MotiImage
          source={require('../assets/images/abra.png')}
          style={styles.abra}
          from={{ translateY: 0, opacity: 0.7 }}
          animate={{
            translateY: -10,
            opacity: 1,
          }}
          transition={{
            type: 'timing',
            duration: 1500,
            loop: true,
            repeatReverse: true,
          }}
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  abra: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    width: 80,
    height: 80,
    opacity: 0.9,
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
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#0077b6',
    fontFamily: 'PokemonSolid',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 16,
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
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#f1c40f',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  pokeball: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
