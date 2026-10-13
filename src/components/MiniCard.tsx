import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
  ViewStyle
} from "react-native";

type MiniCardProps = {
  name: string;
  image: ImageSourcePropType;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function MiniCard({
  name,
  image,
  onPress,
}: MiniCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <ImageBackground
        source={image}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{name}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 6,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  imageBorder: {
    borderRadius: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  title: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});