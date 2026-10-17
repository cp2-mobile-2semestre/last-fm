
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function sendTestNotification() {
  // No Android, cria o canal de notificações.
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Novidades musicais",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  // Verifica a permissão do usuário.
  const { status: currentStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = currentStatus;

  if (currentStatus !== "granted") {
    const permission = await Notifications.requestPermissionsAsync();
    finalStatus = permission.status;
  }

  if (finalStatus !== "granted") {
    throw new Error("Permissão para notificações não concedida.");
  }

  // Agenda uma notificação para daqui a 2 segundos.
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🎵 Novidade musical!",
      body: "Seu artista favorito lançou uma nova música. Confira agora!",
      sound: true,
      data: {
        type: "new_music_release",
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}
