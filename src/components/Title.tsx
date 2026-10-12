import { Text, StyleSheet } from "react-native";

type TitleProps = {
  titleText: string;
};

export default function Title({ titleText}: TitleProps) {
  return <Text style={styles.title}>{titleText}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});