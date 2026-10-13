import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Title from "../components/Title";
import TextInput from "../components/Input";
import Button from "../components/Button";
import Header from "@/components/Header";
import { router } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "@/services/firebase"

export default function LoginScreen() {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const login = async() => {
    try{
      const credential = await signInWithEmailAndPassword(auth, email, password)  
      //criar hook para persistir o token 
      const token = credential.user.getIdToken();
      alert(`Usuario logado: ${email}`)
    }catch(error: any){
      alert('Usuario não encontrado.')
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Header/>
      <View style={styles.form}>
        <Title titleText="Crie sua conta"></Title>

        <Title titleText="Nome de usuario"></Title>
        <TextInput placeholder="Nome" value={username }onChangeText={(username) => setUsername(username)} />

        <Title titleText="Email"></Title>
        <TextInput placeholder="Email" value={email} onChangeText={(email) => setEmail(email)} />

        <Title titleText="Senha"></Title>
        <TextInput placeholder="Senha" value={password} secureTextEntry onChangeText={(password) => setPassword(password)}/>

        <Title titleText="Confirme a sua senha"></Title>

        <Button
          title="Criar conta"
          onPress={() => router.replace("/home" as any)}
        />
      </View>
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

{/* <Button
          title="Criar conta"
          onPress={()=> {login()}}
        /> */}