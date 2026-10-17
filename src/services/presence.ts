
import {
  ref,
  onValue,
  onDisconnect,
  set,
  push,
  remove,
  serverTimestamp,
} from "firebase/database";

import { database } from "./firebase";

export function monitorPresence(
  uid: string,
  onStatusChange?: (online: boolean) => void
) {
  const connectedRef = ref(database, ".info/connected");
  const connectionsRef = ref(
    database,
    `status/${uid}/connections`
  );
  const lastOnlineRef = ref(
    database,
    `status/${uid}/lastOnline`
  );

  const unsubscribe = onValue(connectedRef, async (snapshot) => {
    if (snapshot.val() !== true) {
      onStatusChange?.(false);
      return;
    }

    try {
      const connectionRef = push(connectionsRef);

      // Primeiro registra o que acontecerá ao desconectar.
      await onDisconnect(connectionRef).remove();
      await onDisconnect(lastOnlineRef).set(serverTimestamp());

      // Depois registra esta conexão.
      await set(connectionRef, true);

      onStatusChange?.(true);
    } catch (error) {
      console.error("Erro ao registrar presença:", error);
    }
  });

  return unsubscribe;
}
