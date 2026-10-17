import { firestore } from "@/services/firebase";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

//Buscando perfil e favoritos

export async function loadProfile(userId: string) {
  const userRef = doc(firestore, "users", userId);

  const [userSnap, trackSnap, artistSnap] = await Promise.all([
    getDoc(userRef),
    getDocs(collection(userRef, "favoriteTracks")),
    getDocs(collection(userRef, "favoriteArtists")),
  ]);

  return {
    user: userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null,

    favoriteTracks: trackSnap.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })),

    favoriteArtists: artistSnap.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })),
  };
}

export async function updateProfile(
  userId: string,
  data: {
    displayName: string;
    bio: string;
  },
) {
  return setDoc(doc(firestore, "users", userId), data, { merge: true });
}

export async function addFavoriteTrack(
  userId: string,
  track: {
    id: string;
    artistName: string;
    coverUrl: string;
    title: string;
  },
) {
  return setDoc(doc(firestore, "users", userId, "favoriteTracks", track.id), {
    title: track.title,
    artistName: track.artistName,
    coverUrl: track.coverUrl,
  });
}

export async function unfavoriteTrack(userId: string, trackId: string) {
  return deleteDoc(doc(firestore, "users", userId, "favoriteTracks", trackId));
}

export async function addFavoriteArtist(
  userId: string,
  artist: {
    id: string;
    name: string;
    imageUrl: string;
  },
) {
  return setDoc(
    doc(firestore, "users", userId, "favoriteArtists", artist.id),
    {
      name: artist.name,
      imageUrl: artist.imageUrl,
    },
  );
}


export async function unfavoriteArtist(
  userId: string,
  artistId: string
) {
  const artistRef = doc(
    firestore,
    "users",
    userId,
    "favoriteArtists",
    artistId
  );

  const artistSnap = await getDoc(artistRef);

  if (!artistSnap.exists()) {
    throw new Error(
      `Artista não encontrado no Firestore. ID: ${artistId}`
    );
  }

  await deleteDoc(artistRef);

  const deletedSnap = await getDoc(artistRef);

  if (deletedSnap.exists()) {
    throw new Error("O documento continua existindo após a exclusão.");
  }
}

