import { TouchableOpacity, Text, StyleSheet } from "react-native";

type ButtonProps ={
    title: string,
    onPress: ()=> void;
};

export default function Button({title, onPress} : ButtonProps){
    return(
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#F71414",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonHover: {
    backgroundColor: "#FF5A5A",
  },


  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});