import MainCard from "@/components/MainCard";
import React, { useState, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  ImageBackground,
} from "react-native";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { monitorPresence } from "@/services/presence";

import { router } from "expo-router";

import MiniCard from "@/components/MiniCard";

const tags = [
  {
    name: "Rock",
    image: require("@/assets/images/nin.jpg"),
  },
  {
    name: "Hip-hop",
    image: require("@/assets/images/Kanye_West.jpg"),
  },
  {
    name: "Jazz",
    image: require("@/assets/images/jazz.jpg"),
  },
  {
    name: "Indie",
    image: require("@/assets/images/joji.jpg"),
  },
  {
    name: "Ragge",
    image: require("@/assets/images/bob-marley.jpg"),
  },
  {
    name: "Punk",
    image: require("@/assets/images/Dead_Kennedys_1983_press_photo.jpg"),
  },
  {
    name: "80s",
    image: require("@/assets/images/Dead_Kennedys_1983_press_photo.jpg"),
  },
  {
    name: "British",
    image: require("@/assets/images/Gorillaz-960x689.jpeg"),
  },
  {
    name: "Dance",
    image: require("@/assets/images/Daft_Punk_in_2013.jpg"),
  },
];

const navLinks = ["Music", "Events", "Charts", "Perfil"];
const tabs = ["Overview", "New Releases"];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("Overview");

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    let stopPresence: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      stopPresence?.();
      stopPresence = undefined;

      if (user) {
        stopPresence = monitorPresence(user.uid, setIsOnline);
      } else {
        setIsOnline(false);
      }
    });

    return () => {
      unsubscribeAuth();
      stopPresence?.();
    };
  }, []);

  const isWide = width >= 768;
  const pageWidth = Math.min(width - 32, 1000);
  const gap = 8;

  // No celular, os cards menores ficam em 3 colunas.
  // Em telas maiores, ficam em 3 colunas ao lado do MainCard.
  const gridWidth = isWide ? (pageWidth - gap) / 2 : pageWidth;

  const miniCardSize = (gridWidth - gap * 2) / 3;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.logo}>last.fm</Text>

          <View style={styles.navigation}>
            {navLinks.map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  if (item === "Perfil") {
                    router.push("/profileScreen");
                  } else {
                    console.log(item);
                  }
                }}
                hitSlop={8}
              >
                <Text style={styles.navText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        

        {/* Título e abas */}
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Music</Text>

          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                hitSlop={8}
              >
                <Text
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Gêneros musicais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags to explore</Text>
          <View style={styles.underline} />
        </View>

        <View
          style={[
            styles.genreContainer,
            { width: pageWidth },
            isWide && styles.genreContainerWide,
          ]}
        >
          {/* Card principal */}
          <View style={[styles.mainCardContainer, { width: gridWidth }]}>
            <MainCard />
          </View>

          {/* Cards menores */}
          <View style={[styles.miniCardsContainer, { width: gridWidth }]}>
            {tags.slice(0, 9).map((tag) => (
              <MiniCard
                key={tag.name}
                name={tag.name}
                image={tag.image}
                onPress={() => console.log("Gênero:", tag.name)}
                style={{
                  width: miniCardSize,
                  height: miniCardSize,
                }}
              />
            ))}
          </View>
        </View>
        <View style={styles.presenceContainer}>
          <View
            style={[
              styles.presenceDot,
              {
                backgroundColor: isOnline ? "#2eaa54" : "#999",
              },
            ]}
          />

          <Text style={styles.presenceText}>
            {isOnline ? "Você está online" : "Conectando..."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 32,
  },

  header: {
    minHeight: 56,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    color: "#d92323",
    fontSize: 22,
    fontWeight: "bold",
  },

  navigation: {
    flexDirection: "row",
    gap: 12,
  },

  navText: {
    color: "#fff",
    fontSize: 12,
  },

  titleContainer: {
    alignItems: "center",
    marginTop: 32,
  },

  pageTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#222",
  },

  tabs: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },

  tab: {
    fontSize: 12,
    color: "#222",
  },

  activeTab: {
    color: "#d92323",
    fontWeight: "bold",
  },

  section: {
    alignItems: "center",
    marginVertical: 32,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },

  underline: {
    width: 40,
    height: 1,
    backgroundColor: "#222",
    marginTop: 8,
  },

  genreContainer: {
    alignSelf: "center",
    gap: 16,
    paddingBottom: 16,
  },

  genreContainerWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  mainCardContainer: {
    alignSelf: "center",
  },

  miniCardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignSelf: "center",
  },

  miniCard: {
    borderRadius: 6,
    padding: 4,
  },

  miniCardImage: {
    flex: 1,
  },

  miniCardImageBorder: {
    borderRadius: 6,
  },

  miniCardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },

  miniCardText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },

  presenceContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginTop: 12,
},

presenceDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
},

presenceText: {
  color: "#555",
  fontSize: 12,
},
});
