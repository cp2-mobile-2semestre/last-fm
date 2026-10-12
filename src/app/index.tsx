import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginScreen from "@/screens/LoginScreen";

export default function Index() {
  
  return (
    <SafeAreaView style={styles.container}>
      <LoginScreen/>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  form: {
    padding: 20,
  },
});
