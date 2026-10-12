import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";

export default function Header() {
  return(
    <View style={styles.header}>
        <Image 
            source={require('@/assets/images/last-fm-logo.png')}
            style={styles.logo}
        />
    </View>
  ) 
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 88,
    backgroundColor: "#111111",
    borderWidth: 1,
    paddingHorizontal: 15,
    justifyContent:"center",
    alignItems: "center"
  },
  logo:{
    width: 200,
    height: "100%"
  }
});
