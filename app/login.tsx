import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
  
      // Redirigir a la vista de notas (puedes poner el nombre correcto de la ruta)
      router.push('/notes');  // Asegúrate de que '/notes' sea la ruta correcta de tu aplicación
  
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
        
        <Text style={styles.title}>Iniciar Sesión</Text>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleSignupRedirect}
          >
            <Text style={styles.secondaryButtonText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </ScrollView>

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
    marginBottom: 30,
  },
  pokeball: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 20,
    left: 20,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
});
