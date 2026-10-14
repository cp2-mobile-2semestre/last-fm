
import { useState } from "react";
import {View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tracks = [
    {
        title: "call to me.",
        artist: "Riders",
        time: "há 35 minutos",
    },
    {
        title: "call to me.",
        artist: "Riders",
        time: "há 41 minutos",
    },
    {
        title: "LETTER TO THE devil",
        artist: "Riders",
        time: "há 43 minutos",
    },
    {
        title: "HOW DO YOU WANNA SPEND IT? ❤️",
        artist: "Riders",
        time: "há 48 minutos",
    },
];

const artists = [
    { name: "Riders", plays: 36 },
    { name: "The Neighbourhood", plays: 38 },
    { name: "Michael Jackson", plays: 26 },
    { name: "DustBowlChampion", plays: 18 },
    { name: "Cassiane", plays: 12 },
    { name: "House of Harm", plays: 9 },
];

export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState("Visão geral");

    const tabs = [
        "Visão geral",
        "Relatórios",
        "Biblioteca",
        "Playlists",
        "Seguindo",
    ];

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
                    <Text style={styles.username}>sejaeterno</Text>
                    <Text style={styles.memberSince}>
                        ♫ Ouvindo e compartilhando música desde 21 Abr 2011
                    </Text>
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
                            style={[
                                styles.tab,
                                activeTab === tab && styles.activeTab,
                            ]}
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
                        {/* Estatísticas */}
                        <View style={styles.stats}>
                            <View>
                                <Text style={styles.statLabel}>SCROBBLES</Text>
                                <Text style={styles.statValue}>187.105</Text>
                            </View>

                            <View>
                                <Text style={styles.statLabel}>ARTISTAS</Text>
                                <Text style={styles.statValue}>2.682</Text>
                            </View>

                            <View>
                                <Text style={styles.statLabel}>FAIXAS PREFERIDAS</Text>
                                <Text style={styles.statValue}>147</Text>
                            </View>
                        </View>

                        {/* Faixa principal */}
                        <Text style={styles.sectionTitle}>FAIXA PRINCIPAL</Text>

                        <View style={styles.featuredTrack}>
                            <View style={styles.playButton}>
                                <Text style={styles.playIcon}>▶</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.trackTitle}>call to me.</Text>
                                <Text style={styles.artistName}>Riders</Text>
                            </View>
                        </View>

                        {/* Últimas faixas */}
                        <Text style={styles.heading}>Últimas faixas</Text>

                        {tracks.map((track, index) => (
                            <View key={index} style={styles.trackRow}>
                                <Image
                                    source={{
                                        uri: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=120",
                                    }}
                                    style={styles.trackImage}
                                />

                                <View style={styles.trackDetails}>
                                    <Text style={styles.trackTitle}>{track.title}</Text>
                                    <Text style={styles.artistName}>{track.artist}</Text>
                                    <Text style={styles.trackTime}>{track.time}</Text>
                                </View>

                                <TouchableOpacity style={styles.smallPlay}>
                                    <Text style={styles.smallPlayIcon}>▶</Text>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Text style={styles.moreIcon}>⋮</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* Artistas principais */}
                        <View style={styles.artistHeading}>
                            <Text style={styles.heading}>Artistas principais</Text>
                            <Text style={styles.period}>Últimos 7 dias⌄</Text>
                        </View>

                        <View style={styles.artistGrid}>
                            {artists.map((artist) => (
                                <TouchableOpacity
                                    key={artist.name}
                                    style={styles.artistCard}
                                >
                                    <Image
                                        source={{
                                            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                artist.name,
                                            )}& background=292929 & color=ffffff & size=300`,
                                        }}
                                        style={styles.artistImage}
                                    />

                                    <View style={styles.artistOverlay}>
                                        <Text style={styles.artistCardName}>
                                            {artist.name}
                                        </Text>
                                        <Text style={styles.artistPlays}>
                                            {artist.plays} reproduções
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
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
});

