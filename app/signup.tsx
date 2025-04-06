import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Audio } from 'expo-av';
import { useAudio } from '@/contexts/AudioContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiImage } from 'moti';
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

  React.useEffect(() => {
    playSound(require('../assets/audio/register.mp3'), 0.2);

    return () => stopSound();
  }, []);

  return (
    <View style={styles.wrapper}>
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

        <Text style={styles.title}>Crear Cuenta</Text>

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
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.secondaryButtonText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    color: '#0077b6',
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
    backgroundColor: '#0077b6',
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
    color: '#f1c40f',
    fontSize: 14,
    fontWeight: '500',
  },
});
