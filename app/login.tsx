import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Audio } from 'expo-av';
import { useAudio } from '@/contexts/AudioContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiImage } from 'moti';
import { api } from '@/services/api';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'El correo electrónico no es válido');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      const data = await api.login(email, password); // email es username
      const token = data.token;

      // Guardar el token en el almacenamiento seguro, si es necesario
      await SecureStore.setItemAsync('jwt', token); 

      // Redirigir a la vista de notas
      router.push('/notes');
    } catch (error: any) {
      Alert.alert('Error', 'Credenciales inválidas o problema de red');
      console.error(error.message);
    }
  };

  const handleSignupRedirect = () => {
    router.push('/signup');
  };

  const { playSound, stopSound } = useAudio();

  useFocusEffect(
    React.useCallback(() => {
      playSound(require('../assets/audio/login.mp3'), 0.2); // Reproducir el audio al obtener foco

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
        colors={['rgba(245, 220, 220, 0.95)', 'rgba(241, 15, 15, 0.9)']}
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

        <Text style={styles.title}>Acceder a la Pokédex</Text>

        {/* Pokébola en el medio */}
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

        {/* Cuadro de texto de correo */}
        <LinearGradient
          colors={['#e74c3c', '#c0392b']} // Rojo retro
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="ID de Entrenador"
            placeholderTextColor="#fff"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </LinearGradient>

        {/* Cuadro de texto de contraseña */}
        <LinearGradient
          colors={['#e74c3c', '#c0392b']} // Rojo retro
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Contraseña de la Pokébola"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </LinearGradient>

        {/* Botón de login */}
        <TouchableOpacity 
          style={styles.pokeButton} 
          onPress={handleLogin}
        >
          <LinearGradient
            colors={['#2980b9', '#3498db']} // Azul retro
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Acceder</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Botón de redirección a registro */}
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleSignupRedirect}
        >
          <Text style={styles.secondaryButtonText}>¿Nuevo en el Mundo Pokémon? Únete al Club de Entrenadores</Text>
        </TouchableOpacity>

        {/* Umbreon animado */}
        <MotiImage
          source={require('../assets/images/umbreon.png')}
          style={[styles.pokemon, { shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 20 }]}
          from={{
            opacity: 0,
            scale: 0.9,
            rotate: '-3deg',
            shadowOpacity: 0, // Sombra al principio no visible
          }}
          animate={{
            opacity: 1,
            scale: 1.05,
            rotate: '3deg',
            shadowOpacity: 50, // Sombra aparece con la animación
          }}
          transition={{
            type: 'timing',
            duration: 2000,
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
  pokemon: {
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 30,
  },
  pokeball: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#d35400',
    fontFamily: 'PokemonSolid',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 30, // Bordes más redondeados
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
    color: '#f1c40f', // Amarillo retro
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline', // Subrayado para el link
    textAlign: 'center',
  },
});
