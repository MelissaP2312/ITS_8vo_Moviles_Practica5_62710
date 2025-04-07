import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import useNotes from '../hooks/useNotes';
import { Audio } from 'expo-av';

export default function WrongDataScreen() {
  const router = useRouter();
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
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

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color="#f39c12" />
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isLoading ? (
          <Text style={styles.loadingText}>Cargando notas...</Text>
        ) : notes.length === 0 ? (
          <Text style={styles.emptyText}>¡No hay notas creadas aún, Entrenador!</Text>
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
    fontFamily: 'PokemonSolid', // Si tienes una fuente Pokémon
  },
  statusContainer: {
    marginRight: 16,
  },
  completedText: {
    color: 'green',
  },
  pendingText: {
    color: 'orange',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    backgroundColor: '#fef9e4', // Fondo estilo "Pokébola" amarillo
    borderRadius: 15, // Bordes redondeados
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
    marginTop: 20,
    fontSize: 18,
    color: '#666',
    fontFamily: 'PokemonSolid',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#f39c12', // Color amarillo tipo Pikachu
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  loadingText: {
    fontSize: 18,
    color: '#f39c12',
    textAlign: 'center',
    fontFamily: 'PokemonSolid',
  },
});
