import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, IconButton, Text } from 'react-native-paper';
import useNotes from '../hooks/useNotes';
import { useAudio } from '@/contexts/AudioContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();
  const { playSound, stopSound } = useAudio();

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  useFocusEffect(
    React.useCallback(() => {
      playSound(require('../assets/audio/logged.mp3'), 0.2); // Reproducir el audio al obtener foco

      return () => {
        stopSound(); // Detener el sonido al perder el foco
      };
    }, []) // Reproducir audio sin esperar que esté cargado
  );

  const handleEditNote = (noteId: number) => {
    router.push(`/create-note?id=${noteId}`);
  };

  const handleDeleteNote = async (noteId: number) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la nota');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      // Borrar el token de AsyncStorage
      await AsyncStorage.removeItem('token');
      router.push('/login'); // Redirigir a la página de login
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color="#FFCB05" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente */}
      <LinearGradient 
        colors={['#2c3e50', '#1abc9c']}  // Usar gradiente verde y azul oscuro
        style={styles.gradientBackground}  // Asegúrate de que cubra toda la pantalla
      >
        <Text style={styles.pokedexTitle}>Tu Pokédex</Text>
        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={30} color="#fff" />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {isLoading ? (
            <Text style={styles.loadingText}>¡Un momento, Entrenador!</Text>
          ) : notes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                ¡Tu Pokédex está vacío!
              </Text>
              <Image
                source={require('../assets/images/abra.png')} // Asegúrate de tener esta imagen en tu proyecto
                style={styles.emptyImage}
                resizeMode="contain"
              />
            </View>
          ) : (
            notes.map(note => (
              <Card key={note.id} style={styles.card}>
                <Card.Title
                  title={note.titulo}
                  titleStyle={styles.cardTitle}
                />
                <Card.Content>
                  <Text 
                    numberOfLines={3} 
                    ellipsizeMode="tail"
                    style={styles.cardContent}
                  >
                    {note.descripcion.replace(/<[^>]*>/g, '').substring(0, 200)}
                  </Text>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <IconButton
                    icon="pencil"
                    size={24}
                    onPress={() => handleEditNote(note.id)}
                    style={styles.actionButton}
                  />
                  <IconButton
                    icon="delete"
                    size={24}
                    onPress={() => handleDeleteNote(note.id)}
                    style={styles.actionButton}
                  />
                </Card.Actions>
              </Card>
            ))
          )}
        </ScrollView>
      </LinearGradient>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/create-note')}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    fontFamily: 'PokemonSolid', // Fuente temática Pokémon
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFCB05', // Amarillo tipo Pikachu
    padding: 10,
    borderRadius: 50,
    elevation: 4,
    zIndex: 10,
  },
  container: {
    flex: 1,  
    backgroundColor: 'transparent',// Usar flex: 1 para asegurarse de que cubra toda la pantalla
  },
  gradientBackground: {
    flex: 1,  // Hacer que el gradiente ocupe toda la pantalla
    borderRadius: 0,  // Eliminar cualquier borde en el gradiente
    width: '100%', 
    height: '100%'
  },
  scrollContainer: {
    paddingBottom: 80,
    paddingTop: 20
  },
  card: {
    marginBottom: 16,
    marginHorizontal: 16,
    elevation: 3,
    backgroundColor: '#fff', // Fondo de las tarjetas, más limpio y resalta el contenido
    borderRadius: 15,
    borderColor: '#FFCB05', // Borde amarillo tipo Pikachu
    borderWidth: 3,
    padding: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    fontFamily: 'PokemonSolid', // Fuente temática Pokémon
  },
  cardContent: {
    color: '#555',
    marginTop: 8,
    fontFamily: 'PokemonSolid',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  actionButton: {
    margin: 0,
    backgroundColor: '#e74c3c',
    borderRadius: 50,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    marginHorizontal: 30, // Mismo margen que las tarjetas
    fontSize: 22, // Tamaño más grande
    color: '#FFCB05', // Amarillo Pokémon
    fontFamily: 'PokemonSolid',
    backgroundColor: 'rgba(44, 62, 80, 0.7)', // Fondo azul oscuro semitransparente
    padding: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFCB05', // Borde amarillo
    overflow: 'hidden',
    textShadowColor: '#2c3e50', // Sombra azul oscuro
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  marginTop: {
    marginTop: 60, // Ajusta el espacio según lo que necesites
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FFCB05', // Color amarillo tipo Pikachu
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFCB05', // Amarillo tipo Pikachu
    textAlign: 'center',
    fontFamily: 'PokemonSolid',
  },
  pokedexTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFCB05', // Color de texto similar a Pikachu
    marginLeft: 20,
    marginTop: 20,
    fontFamily: 'PokemonSolid', // Fuente temática Pokémon
    alignSelf: 'flex-start',  // Asegurarse de que el título ocupe todo el ancho
    paddingVertical: 10, // Añadir algo de espacio vertical para que no se pegue al borde
  },
});
