import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState, useEffect } from 'react';
import { BackHandler, Alert, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useAudio } from '@/contexts/AudioContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiImage } from 'moti';

export default function WrongDataScreen() {
  const router = useRouter();
  const { playSound, stopSound } = useAudio();

  const [canRegister, setCanRegister] = useState(false);

  useEffect(() => {
    // Evitar regresar si no se cumplen las condiciones
    const handleBackPress = () => {
      if (!canRegister) {
        Alert.alert("¡No puedes teletransportarte como un Abra!", "Debes responder al menos 5 preguntas correctamente antes de regersar");
        return true; // Evita que el usuario regrese
      }
      router.push('/login');
      return false; // Permite regresar si se cumple la condición
    };

    // Escuchar el evento de presionar el botón de regreso de hardware
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [canRegister, router]);

  // Estado para las respuestas y preguntas
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [questions, setQuestions] = useState<{ question: string; answer: string; options: string[] }[]>([]);

  const allQuestions = [
    // Preguntas fáciles
  { question: "¿Cuál es el primer Pokémon en la Pokédex?", answer: "Bulbasaur", options: ["Bulbasaur", "Charmander", "Squirtle"] },
  { question: "¿Qué tipo de Pokémon es Pikachu?", answer: "Eléctrico", options: ["Eléctrico", "Fuego", "Agua"] },
  { question: "¿Qué Pokémon es conocido como el ratón eléctrico?", answer: "Pikachu", options: ["Pikachu", "Raichu", "Jigglypuff"] },
  { question: "¿Quién es el líder de gimnasio de la ciudad de Ciudad Celeste?", answer: "Misty", options: ["Misty", "Brock", "Giovanni"] },
  { question: "¿En qué región se encuentra la Liga Pokémon de Kanto?", answer: "Kanto", options: ["Kanto", "Johto", "Hoenn"] },
  { question: "¿Qué Pokémon es conocido por ser el más rápido de todos?", answer: "Deoxys (forma velocidad)", options: ["Deoxys (Velocidad)", "Ninjask", "Electrode"] },
  { question: "¿Qué tipo de Pokémon es Charizard?", answer: "Fuego/Volador", options: ["Fuego/Volador", "Fuego/Dragón", "Fuego"] },
  { question: "¿Qué Pokémon evoluciona con una piedra agua?", answer: "Squirtle", options: ["Squirtle", "Eevee", "Poliwag"] },
  { question: "¿Cuál es la evolución final de Bulbasaur?", answer: "Venusaur", options: ["Venusaur", "Ivysaur", "Torterra"] },
  { question: "¿Cuál de los siguientes es un Pokémon legendario?", answer: "Articuno", options: ["Articuno", "Pidgeot", "Magikarp"] },

  // Preguntas difíciles
  { question: "¿En qué episodio se reveló por primera vez el Pokémon Mewtwo?", answer: "En la película 'Pokémon: La película' (1998)", options: ["Pokémon: La película", "Pokémon 2000", "Mewtwo Strikes Back"] },
  { question: "¿Cuál es el único Pokémon que tiene el tipo Fantasma y Acero?", answer: "Aegislash", options: ["Aegislash", "Mimikyu", "Rotom"] },
  { question: "¿Qué Pokémon tiene la habilidad 'Prankster'?", answer: "Sableye", options: ["Sableye", "Meowstic", "Whimsicott"] },
  { question: "¿Qué Pokémon se usa en el juego como referencia para crear el 'Pokémon 001' en las generaciones posteriores?", answer: "Bulbasaur", options: ["Bulbasaur", "Charmander", "Pikachu"] },
  { question: "¿Cómo se llama la habilidad que aumenta el daño de las habilidades de tipo agua de un Pokémon?", answer: "Lluvia", options: ["Lluvia", "Seco", "Intimidación"] },
  { question: "¿En qué región aparece el Pokémon legendario Groudon?", answer: "Hoenn", options: ["Hoenn", "Sinnoh", "Kalos"] },
  { question: "¿Cuál es el Pokémon que tiene la habilidad 'Immunidad'?", answer: "Zangoose", options: ["Zangoose", "Lunatone", "Swalot"] },
  { question: "¿Qué Pokémon puede aprender la habilidad 'Viento Solar'?", answer: "Cherrim", options: ["Cherrim", "Exeggutor", "Bellsprout"] },
  { question: "¿Quién es el creador del concepto del Pokémon en el universo de los videojuegos?", answer: "Satoshi Tajiri", options: ["Satoshi Tajiri", "Ken Sugimori", "Junichi Masuda"] },
  { question: "¿Cuál de estos Pokémon tiene el tipo más raro de todos (Hada)?", answer: "Mawile", options: ["Mawile", "Togekiss", "Sylveon"] },

  { question: "¿Qué Pokémon evoluciona de un fósil encontrado en la región de Kanto?", answer: "Kabuto", options: ["Kabuto", "Omanyte", "Aerodactyl"] },
  { question: "¿Qué Pokémon tiene la habilidad 'Levitate' que lo hace inmune a ataques de tipo Tierra?", answer: "Gengar", options: ["Gengar", "Flygon", "Latios"] },
  { question: "¿Cuál es la habilidad única del Pokémon Gardevoir?", answer: "Sincronía", options: ["Sincronía", "Telequinesis", "Magnet Pull"] },
  { question: "¿Qué Pokémon de la región de Unova puede evolucionar en dos direcciones diferentes, dependiendo de su género?", answer: "Combee", options: ["Combee", "Sewaddle", "Snorlax"] },
  { question: "¿Qué Pokémon es conocido como el 'Pokémon Trilogía'?", answer: "Burmy", options: ["Burmy", "Tropius", "Vullaby"] },
  { question: "¿Qué habilidad de Pokémon hace que un Pokémon aumente su defensa cuando es golpeado por un ataque físico?", answer: "Regeneración", options: ["Regeneración", "Contrarreacción", "Estabilidad"] },
  { question: "¿Qué Pokémon tiene la habilidad 'Cuerpo Llama'?", answer: "Slugma", options: ["Slugma", "Torkoal", "Magcargo"] },
  { question: "¿Qué Pokémon, cuando alcanza el nivel 100, tiene la habilidad más alta de todos?", answer: "Shuckle", options: ["Shuckle", "Mewtwo", "Rayquaza"] },
  { question: "¿En qué región apareció el Pokémon legendario Celebi?", answer: "Johto", options: ["Johto", "Hoenn", "Unova"] },
  { question: "¿Cuál es el nombre del entrenador que tiene un Charizard en la serie original de Pokémon?", answer: "Ash Ketchum", options: ["Ash Ketchum", "Gary Oak", "Blaine"] },

  { question: "¿Qué Pokémon pertenece a la familia de los caninos y tiene la habilidad 'Esfera Aura'?", answer: "Lucario", options: ["Lucario", "Entei", "Herdier"] },
  { question: "¿En qué generación apareció el tipo Hada?", answer: "Generación VI", options: ["Generación VI", "Generación V", "Generación IV"] },
  { question: "¿Cómo se llama la forma de Mega evolución de Beedrill?", answer: "Mega Beedrill", options: ["Mega Beedrill", "Beedrillite", "Beevolution"] },
  { question: "¿Qué Pokémon tiene la habilidad 'Manto Frío'?", answer: "Cryogonal", options: ["Cryogonal", "Glaceon", "Rotom (Frost)"] },
  { question: "¿Qué Pokémon de la región de Galar tiene el tipo Lucha y Fantasma?", answer: "Poltergeist", options: ["Poltergeist", "Mimikyu", "Spiritomb"] },
  { question: "¿Qué Pokémon es considerado el Pokémon guardián de la región de Alola?", answer: "Tapu Koko", options: ["Tapu Koko", "Solgaleo", "Lunala"] },
  { question: "¿Cuál es el nombre de la piedra evolutiva que se usa para evoluciones de Eevee a Sylveon?", answer: "Piedra Hada", options: ["Piedra Hada", "Piedra Solar", "Piedra Fuego"] },
  { question: "¿Qué Pokémon tiene la habilidad 'Despertar Nocturno'?", answer: "Umbreon", options: ["Umbreon", "Espeon", "Sylveon"] },
  { question: "¿Qué Pokéball se utiliza para capturar a Mewtwo en los videojuegos?", answer: "Master Ball", options: ["Master Ball", "Ultra Ball", "Poké Ball"] },
  { question: "¿Cuál es el nombre del entrenador rival principal en la región de Sinnoh?", answer: "Paul", options: ["Barry", "Paul", "Cynthia"] }
];

  // Función para seleccionar 5 preguntas aleatorias
  const generateRandomQuestions = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5); // Mezcla las preguntas
    return shuffled.slice(0, 8); // Devuelve las primeras 5
  };

  // Usamos useEffect para inicializar las preguntas solo una vez al montar el componente
  useEffect(() => {
    setQuestions(generateRandomQuestions());
  }, []);

  const handleAnswer = (userAnswer: string) => {
    if (answered) return;  // Evitar responder varias veces
    const correct = questions[currentQuestion]?.answer.toLowerCase() === userAnswer.toLowerCase();
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }
    setAnswered(true);

    // Si has respondido a 3 preguntas correctamente, se habilita la opción de registrarse
    if (correctAnswers + 1 >= 5) {
      setCanRegister(true); // Si responde 3 o más correctamente, permite intentar registrarse
    }

    // Si no es la última pregunta, avanzamos a la siguiente
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }, 1000);  // Retardo para pasar a la siguiente pregunta
    } else {
      // Si no ha respondido correctamente 3 veces, se muestran otras 5 preguntas aleatorias
      if (correctAnswers < 5) {
        setTimeout(() => {
          setQuestions(generateRandomQuestions());
          setCurrentQuestion(0);
          setAnswered(false);
          setCorrectAnswers(0);
        }, 1000);  // Retardo para cargar nuevas preguntas
      }
    }
  };

  // Función para mostrar el resultado
  const getResultMessage = () => {
    if (correctAnswers >= 5) {
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            ¡Has logrado atrapar 5 o más Pokémon correctamente! Ahora puedes intentar ingresar nuevamente a la liga.
          </Text>
          <TouchableOpacity
            style={styles.answerButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.answerButtonText}>¡Haz tu regreso triunfal!</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            No has completado la Pokédex. ¡El camino hacia la liga Pokémon no será fácil!
          </Text>
          <TouchableOpacity
            style={styles.answerButton}
            onPress={() => router.push('/wrong-data')}
          >
            <Text style={styles.answerButtonText}>¡A seguir luchando! Como Bulbasaur, siempre hay nuevas oportunidades para crecer</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      playSound(require('../assets/audio/incorrect password.mp3'), 0.3);
      return () => stopSound();
    }, [])
  );

  // Impedir el regreso hasta que se haya respondido correctamente a 3 preguntas
  const handleBackPress = () => {
    if (!canRegister) {
      Alert.alert("¡No puedes teletransportarte como un Abra!", "Debes responder al menos 5 preguntas correctamente antes de regersar");
    } else {
      router.push('/login');
    }
  };

  // Verificamos si ya tenemos las preguntas cargadas y si estamos en la última pregunta
  if (!questions || questions.length === 0) {
    return <Text>Cargando preguntas...</Text>;
  }

  return (
    <View style={styles.wrapper}>
    {/* Botón de flecha en la esquina superior izquierda */}
    <TouchableOpacity
      style={styles.backButton}
      onPress={handleBackPress}
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

      <Text style={styles.title}>¡Demuestra tu conocimiento Pokémon! ¿Eres real o solo un bot? ¡Demuestra que no eres un Magikarp!</Text>

      {currentQuestion < questions.length && !canRegister ? (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
          
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.answerButton}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.answerButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        getResultMessage()
      )}

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBackPress}
      >
        <MaterialIcons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

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
  questionContainer: {
    marginBottom: 20,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 15,
    color: '#2c3e50',
    fontFamily: 'PokemonSolid',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  answerButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  answerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 30,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 20,
    fontFamily: 'PokemonSolid',
  },
});
