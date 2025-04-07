import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import CreateNoteScreen from './create-note';
import ListNotesScreen from './notes';
import IndexScreen from '.';
import LoginScreen from './login';
import SignupScreen from './signup';
import WrongDataScreen from './wrong-data';
import { Stack } from 'expo-router';
import { AudioProvider } from '../contexts/AudioContext'; 

const App = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AudioProvider>
      <Stack>
        <Stack.Screen
          name='index'
          options={
            {
              headerShown: false,
            }
          }
        />
        <Stack.Screen
          name='login'
          options={
            {
              headerShown: false,
            }
          }
        />
        <Stack.Screen
          name='signup'
          options={
            {
              headerShown: false,
            }
          }
        />
        <Stack.Screen
          name='wrong-data'
          options={
            {
              headerShown: false,
            }
          }
        />
        <Stack.Screen
          name="notes"
          options={
            {
              headerShown: false,
            }
          }
        />
        <Stack.Screen
          name='create-note'
          options={
            {
              title: 'Crear nueva nota'
            }
          }
        />
      </Stack>
    </AudioProvider>    
  );
};
export default App;