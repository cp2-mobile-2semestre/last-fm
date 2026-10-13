import { Text, StyleSheet, View, ImageBackground } from "react-native";

export default function MainCard() {
  return (
    <View style={styles.mainCard}>
      <ImageBackground
        style={styles.mainCardImage}
        source={require("@/assets/images/Daft_Punk_in_2013.jpg")}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Daft Punk</Text>
          <Text style={styles.description}>
            Explore músicas e álbuns
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainCard: {
    width: "100%",
    height: 500,
    borderRadius: 16,
    overflow: "hidden",
  },

  mainCardImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
    padding: 24,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },

  description: {
    color: "#eee",
    fontSize: 14,
    marginTop: 8,
  },
});