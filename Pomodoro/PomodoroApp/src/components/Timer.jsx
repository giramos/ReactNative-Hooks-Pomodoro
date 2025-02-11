import { View, Text } from "react-native";

// funcion que recibe el tiempo y lo formatea en minutos y segundos 
export default function Timer({ time }) {
  const formattedTime = `${Math.floor(time / 60) // obtenemos los minutos 
      .toString()
      // nos aseguramos de que el tiempo siempre tenga dos dígitos 
    .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`; 
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formattedTime}</Text> 
    </View>
  );
}

// estilos del componente Timer
const styles = {
  container: {
    flex: 0.3,
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    padding: 15, 
    borderRadius: 15,
  },
  time: {
    textAlign: "center",
    fontSize: 80,
    fontWeight: "bold",
    color: "#333333",
  },
};