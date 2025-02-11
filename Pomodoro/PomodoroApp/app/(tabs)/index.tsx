import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
// Importamos el módulo de Audio de Expo
import { Audio } from "expo-av";

const colors = { // Colores para cada modo
  POMO: "#F7DC6F",
  SHORT: "#A2D9CE",
  BREAK: "#D7BDE2",
};

// Componente principal 
export default function App() {
  const [isActive, setIsActive] = useState(false); // Estado para saber si el temporizador está activo
  const [currentTime, setCurrentTime] = useState<"POMO" | "SHORT" | "BREAK">("POMO"); // Estado para saber en qué modo estamos
  const [time, setTime] = useState(60 * 25); // Estado para el tiempo restante

  // Customizable time durations (in seconds)
  const [pomoTime, setPomoTime] = useState(25 * 60); // Duración del modo POMO
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60); // Duración del modo SHORT
  const [longBreakTime, setLongBreakTime] = useState(15 * 60); // Duración del modo BREAK

  // Efecto que se ejecuta cada vez que cambia el estado de isActive o time 
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null; // Variable para almacenar el intervalo de tiempo

    if (isActive) { // Si el temporizador está activo, restamos 1 al tiempo cada segundo 
      interval = setInterval(() => {
        setTime((prev) => Math.max(prev - 1, 0));
      }, 1000); // Cada 1000ms = 1s
    }

    if (time === 0) { // Si el tiempo llega a 0, cambiamos al siguiente modo
      setIsActive(false); // Pausamos el temporizador
      if (currentTime === "POMO") { // Si estamos en modo POMO, cambiamos a SHORT
        setCurrentTime("SHORT");
        setTime(shortBreakTime); // Establecemos el tiempo restante al tiempo del modo SHORT
      } else if (currentTime === "SHORT") { // Si estamos en modo SHORT, cambiamos a BREAK
        setCurrentTime("BREAK");
        setTime(longBreakTime);
      } else { // Si estamos en modo BREAK, cambiamos a POMO
        setCurrentTime("POMO");
        setTime(pomoTime);
      }
    }

    return () => { // Función que se ejecuta al desmontar el componente
      if (interval) clearInterval(interval); // Limpiamos el intervalo de tiempo
    };
  }, [isActive, time, currentTime]); // Dependencias del efecto 

  // Función que se ejecuta al pulsar el botón de START/STOP
  const handleStartStop = async () => {
    await playSound(); // Reproducimos un sonido al pulsar el botón
    setIsActive((prev) => !prev); // Cambiamos el estado de isActive
  };

  // Función para reproducir un son al pulsar el botón
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync( // Creamos un objeto de sonido
      require("../../assets/music/click.mp3") // Ruta del archivo de sonido
    );
    await sound.playAsync(); // Reproducimos el sonido
    await sound.unloadAsync(); // Descargamos el sonido
  }

  const handleModeChange = (mode: "POMO" | "SHORT" | "BREAK") => { // Función para cambiar de modo 
    setCurrentTime(mode); // Cambiamos el modo actual
    setTime( // Establecemos el tiempo restante según el modo
      mode === "POMO"
        ? pomoTime
        : mode === "SHORT"
          ? shortBreakTime
          : longBreakTime
    );

    setIsActive(false); // Pausamos el temporizador si cambia el modo
  };

  return ( // Renderizamos la interfaz
    <SafeAreaView style={[styles.container, { backgroundColor: colors[currentTime] }]}>
      <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: Platform.OS == "android" ? 30 : 0 }}>
        <Text style={styles.title}>Pomodoro Timer</Text>

        {/* Botones para cambiar de modo */}
        <View style={styles.modeButtons}>
          <TouchableOpacity
            style={[styles.modeButton, currentTime === "POMO" && styles.activeMode]}
            onPress={() => handleModeChange("POMO")}
          >
            <Text>Pomodoro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, currentTime === "SHORT" && styles.activeMode]}
            onPress={() => handleModeChange("SHORT")}
          >
            <Text>Short Break</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, currentTime === "BREAK" && styles.activeMode]}
            onPress={() => handleModeChange("BREAK")}
          >
            <Text>Long Break</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs para configurar tiempos */}
        <View style={styles.settingsContainer}>
          <View style={styles.inputRow}>
            <Text>Work (min):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={(pomoTime / 60).toString()}
              onChangeText={(value) => setPomoTime(Number(value) * 60)}
            />
          </View>

          <View style={styles.inputRow}>
            <Text>Short Break (min):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={(shortBreakTime / 60).toString()}
              onChangeText={(value) => setShortBreakTime(Number(value) * 60)}
            />
          </View>

          <View style={styles.inputRow}>
            <Text>Long Break (min):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={(longBreakTime / 60).toString()}
              onChangeText={(value) => setLongBreakTime(Number(value) * 60)}
            />
          </View>
        </View>

        <Text style={styles.timeDisplay}>{`${Math.floor(time / 60)
          .toString()
          .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`}</Text>

        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={{ color: "white", fontWeight: "bold" }}>{isActive ? "STOP" : "START"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  modeButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  activeMode: {
    backgroundColor: "#333",
  },
  settingsContainer: {
    marginVertical: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    width: 50,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
  },
  timeDisplay: {
    fontSize: 48,
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
});
