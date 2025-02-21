import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { Audio } from "expo-av";

const colors = {
  POMO: "#F7DC6F",
  SHORT: "#A2D9CE",
  BREAK: "#D7BDE2",
};

type TimeMode = "POMO" | "SHORT" | "BREAK";

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const [currentTime, setCurrentTime] = useState<TimeMode>("POMO");
  const [time, setTime] = useState(60 * 25);
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    if (time === 0) {
      setIsActive(false);
      playEndSound();
      if (currentTime === "POMO") {
        setCurrentTime("SHORT");
        setTime(shortBreakTime);
      } else if (currentTime === "SHORT") {
        setCurrentTime("BREAK");
        setTime(longBreakTime);
      } else {
        setCurrentTime("POMO");
        setTime(pomoTime);
      }
    }
    return () => interval && clearInterval(interval);
  }, [isActive, time]);

  const handleStartStop = () => {
    playClickSound();
    setIsActive(!isActive);
  };

  async function playClickSound() {
    const { sound } = await Audio.Sound.createAsync(require("../../assets/music/click.mp3"));
    await sound.playAsync();
  }

  async function playEndSound() {
    const { sound } = await Audio.Sound.createAsync(require("../../assets/music/fin.mp3"));
    await sound.playAsync();
  }

  const handleModeChange = (mode: TimeMode) => {
    setCurrentTime(mode);
    setTime(mode === "POMO" ? pomoTime : mode === "SHORT" ? shortBreakTime : longBreakTime);
    setIsActive(false);
  };

  const handleTimeChange = (value: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setter(numericValue * 60);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[currentTime] }]}> 
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Germán Timer</Text>
        <View style={styles.modeButtons}>
          <TouchableOpacity style={[styles.modeButton, currentTime === "POMO" && styles.activeMode]} onPress={() => handleModeChange("POMO")}>
            <Text style={styles.modeButtonText}>Pomodoro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeButton, currentTime === "SHORT" && styles.activeMode]} onPress={() => handleModeChange("SHORT")}>
            <Text style={styles.modeButtonText}>Short Break</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeButton, currentTime === "BREAK" && styles.activeMode]} onPress={() => handleModeChange("BREAK")}>
            <Text style={styles.modeButtonText}>Long Break</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Work (min):</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              value={(pomoTime / 60).toString()} 
              onChangeText={(value) => handleTimeChange(value, setPomoTime)}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Short Break (min):</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              value={(shortBreakTime / 60).toString()} 
              onChangeText={(value) => handleTimeChange(value, setShortBreakTime)}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Long Break (min):</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              value={(longBreakTime / 60).toString()} 
              onChangeText={(value) => handleTimeChange(value, setLongBreakTime)}
            />
          </View>
        </View>

        <Text style={styles.timeDisplay}>{`${Math.floor(time / 60).toString().padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`}</Text>

        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={styles.buttonText}>{isActive ? "STOP" : "START"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  modeButton: {
    padding: 12,
    backgroundColor: "#ccc",
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeMode: {
    backgroundColor: "#333",
  },
  modeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  settingsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    width: 60,
    textAlign: "center",
    borderRadius: 5,
  },
  timeDisplay: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 20,
  },
  button: {
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
