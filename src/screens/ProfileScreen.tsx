import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  loadProfile,
  updateProfile,
  addFavoriteTrack,
  addFavoriteArtist,
  unfavoriteArtist,
} from "@/services/profileService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("Visão geral");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"bio" | "artist" | "track">("bio");

  const [bioText, setBioText] = useState("");
  const [artistName, setArtistName] = useState("");
  const [artistImage, setArtistImage] = useState("");

  const [trackTitle, setTrackTitle] = useState("");
  const [trackArtist, setTrackArtist] = useState("");
  const [trackCover, setTrackCover] = useState("");

  const tabs = [
    "Visão geral",
    "Relatórios",
    "Biblioteca",
    "Playlists",
    "Seguindo",
  ];

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile(null);
        setError("Faça login para visualizar seu perfil");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await loadProfile(user.uid);
        setProfile(data);
      } catch (err) {
        console.error("Error ao carregar perfil:", err);
        setError("Nao foi possivel carregar seu perfil");
      } finally {
        setLoading(false);
      }
    });

    return unsubcribe;
  }, []);

  function openModal(type: "bio" | "artist" | "track") {
    setModalType(type);

    if (type === "bio") {
      setBioText(profile?.user?.bio ?? "");
    }

    setModalVisible(true);
  }

  async function removeFavoriteArtist(artistId: string) {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Atenção", "Faça login novamente.");
      return;
    }

    Alert.alert(
      "Remover artista",
      "Deseja remover este artista dos seus favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await unfavoriteArtist(user.uid, artistId);

              const updatedProfile = await loadProfile(user.uid);
              setProfile(updatedProfile);

              Alert.alert("Sucesso", "Artista removido dos favoritos.");
            } catch (error) {
              console.error("Erro ao remover artista:", error);
              Alert.alert("Erro", "Não foi possível remover o artista.");
            }
          },
        },
      ],
    );
  }

  async function saveData() {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Atenção", "Faça login novamente.");
      return;
    }

    try {
      setSaving(true);

      if (modalType === "bio") {
        await updateProfile(user.uid, {
          displayName: profile?.user?.displayName ?? "",
          bio: bioText.trim(),
        });
      }

      if (modalType === "artist") {
        if (!artistName.trim()) {
          Alert.alert("Atenção", "Informe o nome do artista.");
          return;
        }

        await addFavoriteArtist(user.uid, {
          id: `manual-${Date.now()}`,
          name: artistName.trim(),
          imageUrl: artistImage.trim(),
        });
      }

      if (modalType === "track") {
        if (!trackTitle.trim() || !trackArtist.trim()) {
          Alert.alert("Atenção", "Informe o título e o artista da música.");
          return;
        }

        await addFavoriteTrack(user.uid, {
          id: `manual-${Date.now()}`,
          title: trackTitle.trim(),
          artistName: trackArtist.trim(),
          coverUrl: trackCover.trim(),
        });
      }

      const updatedProfile = await loadProfile(user.uid);
      setProfile(updatedProfile);

      setModalVisible(false);

      setArtistName("");
      setArtistImage("");
      setTrackTitle("");
      setTrackArtist("");
      setTrackCover("");

      Alert.alert("Sucesso", "Informações salvas!");
    } catch (error) {
      console.error("Erro ao salvar:", error);

      Alert.alert("Erro", "Não foi possível salvar as informações.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#D51007" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 20 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  const featuredTrack = profile?.favoriteTracks?.[0];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.topBar}>
          <TouchableOpacity>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>
            last<Text style={styles.logoRed}>.fm</Text>
          </Text>

          <View style={{ width: 25 }} />
        </View>

        {/* Banner do perfil */}
        <View style={styles.banner}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900",
            }}
            style={styles.bannerImage}
          />

          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
            }}
            style={styles.avatar}
          />
        </View>

        {/* Informações do usuário */}
        <View style={styles.profileInfo}>
          <Text style={styles.username}>
            {profile?.user?.displayName ?? "Usuário"}
          </Text>

          <TouchableOpacity onPress={() => openModal("bio")}>
            <Text style={styles.memberSince}>
              {profile?.user?.bio || "Adicione uma bio ao seu perfil"} ✎
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navegação do perfil */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {activeTab === "Visão geral" ? (
          <View style={styles.content}>
            <View style={styles.stats}>
              <View>
                <Text style={styles.statLabel}>SCROBBLES</Text>
                <Text style={styles.statValue}>—</Text>
              </View>

              <View>
                <Text style={styles.statLabel}>ARTISTAS FAVORITOS</Text>
                <Text style={styles.statValue}>
                  {profile?.favoriteArtists?.length ?? 0}
                </Text>
              </View>

              <View>
                <Text style={styles.statLabel}>FAIXAS FAVORITAS</Text>
                <Text style={styles.statValue}>
                  {profile?.favoriteTracks?.length ?? 0}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>FAIXA EM DESTAQUE</Text>

      

            {profile?.favoriteTracks?.length > 0 ? (
              profile.favoriteTracks.map((track: any) => (
                <View key={track.id} style={styles.trackRow}>
                  {track.coverUrl ? (
                    <Image
                      source={{ uri: track.coverUrl }}
                      style={styles.trackImage}
                    />
                  ) : (
                    <View style={styles.trackImage} />
                  )}

                  <View style={styles.trackDetails}>
                    <Text style={styles.trackTitle}>{track.title}</Text>
                    <Text style={styles.artistName}>{track.artistName}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                Você ainda não adicionou músicas favoritas.
              </Text>
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => openModal("track")}
            >
              <Text style={styles.addButtonText}>+ Adicionar música</Text>
            </TouchableOpacity>


            <Text style={styles.heading}>Últimas faixas</Text>

            {profile?.favoriteArtists?.length > 0 ? (
              <View style={styles.artistGrid}>
                {profile.favoriteArtists.map((artist: any) => (
                  <View key={artist.id} style={styles.artistCard}>
                    {!!artist.imageUrl && (
                      <Image
                        source={{ uri: artist.imageUrl }}
                        style={styles.artistImage}
                      />
                    )}

                    <View style={styles.artistOverlay}>
                      <Text style={styles.artistCardName}>{artist.name}</Text>

                      <TouchableOpacity
                        style={styles.removeArtistButton}
                        onPress={() => removeFavoriteArtist(artist.id)}
                      >
                        <Text style={styles.removeArtistText}>
                          Remover favorito
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>
                Você ainda não adicionou artistas favoritos.
              </Text>
            )}

            <View style={styles.artistHeading}>
              <Text style={styles.heading}>Artistas principais</Text>
              <Text style={styles.period}>Últimos 7 dias⌄</Text>
            </View>

            {profile?.favoriteArtists?.length > 0 ? (
              <View style={styles.artistGrid}>
                {profile.favoriteArtists.map((artist: any) => (
                  <View key={artist.id} style={styles.artistCard}>
                    {!!artist.imageUrl && (
                      <Image
                        source={{ uri: artist.imageUrl }}
                        style={styles.artistImage}
                      />
                    )}

                    <View style={styles.artistOverlay}>
                      <Text style={styles.artistCardName}>{artist.name}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>
                Você ainda não adicionou artistas favoritos.
              </Text>
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => openModal("artist")}
            >
              <Text style={styles.addButtonText}>+ Adicionar artista</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptySection}>
            <Text style={styles.heading}>{activeTab}</Text>
            <Text style={styles.emptyText}>
              Esta seção poderá ser implementada em breve.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "bio"
                ? "Editar bio"
                : modalType === "artist"
                  ? "Adicionar artista"
                  : "Adicionar música"}
            </Text>

            {modalType === "bio" && (
              <TextInput
                style={styles.formInput}
                placeholder="Escreva sua bio"
                value={bioText}
                onChangeText={setBioText}
                maxLength={200}
                multiline
              />
            )}

            {modalType === "artist" && (
              <>
                <TextInput
                  style={styles.formInput}
                  placeholder="Nome do artista"
                  value={artistName}
                  onChangeText={setArtistName}
                />

                <TextInput
                  style={styles.formInput}
                  placeholder="URL da imagem (opcional)"
                  value={artistImage}
                  onChangeText={setArtistImage}
                  autoCapitalize="none"
                />
              </>
            )}

            {modalType === "track" && (
              <>
                <TextInput
                  style={styles.formInput}
                  placeholder="Título da música"
                  value={trackTitle}
                  onChangeText={setTrackTitle}
                />

                <TextInput
                  style={styles.formInput}
                  placeholder="Nome do artista"
                  value={trackArtist}
                  onChangeText={setTrackArtist}
                />

                <TextInput
                  style={styles.formInput}
                  placeholder="URL da capa (opcional)"
                  value={trackCover}
                  onChangeText={setTrackCover}
                  autoCapitalize="none"
                />
              </>
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={saveData}
              disabled={saving}
            >
              <Text style={styles.addButtonText}>
                {saving ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              disabled={saving}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    height: 48,
    backgroundColor: "#171717",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  menuIcon: {
    color: "#FFFFFF",
    fontSize: 22,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "bold",
  },
  logoRed: {
    color: "#D51007",
  },
  banner: {
    height: 110,
    backgroundColor: "#3A1010",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.65,
  },
  avatar: {
    position: "absolute",
    bottom: -15,
    left: 14,
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#333333",
  },
  profileInfo: {
    paddingHorizontal: 14,
    paddingTop: 19,
    paddingBottom: 12,
  },
  username: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#222222",
  },
  memberSince: {
    fontSize: 10,
    color: "#888888",
    marginTop: 7,
  },
  tabs: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    maxHeight: 43,
  },
  tab: {
    paddingHorizontal: 11,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#D51007",
  },
  tabText: {
    fontSize: 11,
    color: "#555555",
  },
  activeTabText: {
    color: "#222222",
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 15,
    paddingBottom: 25,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 23,
  },
  statLabel: {
    fontSize: 9,
    color: "#888888",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    color: "#222222",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 9,
    color: "#888888",
    marginBottom: 7,
  },
  featuredTrack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F3F3F3",
    padding: 10,
    marginBottom: 23,
  },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: "#444444",
    fontSize: 19,
  },
  heading: {
    fontSize: 16,
    color: "#292929",
    fontWeight: "500",
    marginBottom: 12,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    gap: 9,
  },
  trackImage: {
    width: 36,
    height: 36,
    backgroundColor: "#E2E2E2",
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    color: "#292929",
    fontSize: 11,
    fontWeight: "bold",
  },
  artistName: {
    color: "#555555",
    fontSize: 11,
    marginTop: 3,
  },
  trackTime: {
    color: "#999999",
    fontSize: 9,
    marginTop: 4,
  },
  smallPlay: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  smallPlayIcon: {
    fontSize: 10,
    color: "#333333",
  },
  moreIcon: {
    color: "#999999",
    fontSize: 21,
    paddingLeft: 2,
  },
  artistHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  period: {
    color: "#888888",
    fontSize: 10,
    marginBottom: 12,
  },
  artistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  artistCard: {
    width: "49.5%",
    height: 500,
    aspectRatio: 1,
    backgroundColor: "#222222",
  },
  artistImage: {
    width: "100%",
    height: "100%",
  },
  artistOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  artistCardName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  artistPlays: {
    color: "#FFFFFF",
    fontSize: 10,
    marginTop: 3,
  },
  emptySection: {
    padding: 20,
  },
  emptyText: {
    color: "#777777",
    fontSize: 13,
  },
  addButton: {
    backgroundColor: "#D51007",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#222222",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 5,
    padding: 12,
    marginBottom: 12,
    color: "#222222",
    minHeight: 44,
  },
  cancelButton: {
    padding: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#555555",
    fontSize: 13,
  },
  removeArtistButton: {
    backgroundColor: "#D51007",
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  removeArtistText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
