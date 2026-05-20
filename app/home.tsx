import React, { useCallback, useMemo, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Image,
    Alert,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
    Ionicons,
    Feather,
    MaterialCommunityIcons,
    FontAwesome5,
    AntDesign,
} from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { comportamentoService, ComportamentoDTO } from "../services/comportamentoService";
import { tokenStorage } from "../services/tokenStorage";
import { authService } from "../services/authService";

// Helper to generate the current week days
function getWeekDays(baseDate: Date = new Date()) {
    const days = [];
    const current = new Date(baseDate);
    // Adjust to Monday
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    current.setDate(diff);

    const labels = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

    for (let i = 0; i < 7; i++) {
        days.push({
            day: current.getDate().toString(),
            label: labels[i],
            fullDate: new Date(current),
        });
        current.setDate(current.getDate() + 1);
    }
    return days;
}

const categories = [
    {
        title: "Cadastrar\nIndivíduo",
        icon: <Feather name="clipboard" size={18} color="#45B8F0" />,
        route: "/register_individual",
    },
    {
        title: "Doutor",
        icon: <FontAwesome5 name="stethoscope" size={17} color="#45B8F0" />,
        route: "/doctor",
    },
    {
        title: "Remédios",
        icon: <MaterialCommunityIcons name="pill" size={18} color="#45B8F0" />,
        route: "/medicine",
    },
    {
        title: "Registro\nde Rotina",
        icon: <Feather name="calendar" size={18} color="#45B8F0" />,
        route: "/routine_register",
    },
    {
        title: "Registro De\nComportamento",
        icon: <MaterialCommunityIcons name="medical-bag" size={18} color="#45B8F0" />,
        route: "/comportamento_registro",
    },
];

export default function HomeScreen() {
    const [records, setRecords] = useState<ComportamentoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    const weekDays = useMemo(() => getWeekDays(), []);

    useFocusEffect(
        useCallback(() => {
            loadRecords();
        }, [])
    );

    async function loadRecords() {
        try {
            const token = await tokenStorage.getToken();
            if (token) {
                const data = await comportamentoService.listarTodos(token);
                setRecords(data);
            }
        } catch (error) {
            console.error("Erro ao carregar registros:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            if (!record.data) return false;
            const recordDate = new Date(record.data);
            return (
                recordDate.getDate() === selectedDate.getDate() &&
                recordDate.getMonth() === selectedDate.getMonth() &&
                recordDate.getFullYear() === selectedDate.getFullYear()
            );
        });
    }, [records, selectedDate]);

    async function handleLogout() {
        const confirmLogout = () => {
            authService.logout();
            router.replace("/");
        };

        if (Platform.OS === 'web') {
            if (window.confirm("Deseja realmente sair?")) {
                confirmLogout();
            }
        } else {
            Alert.alert(
                "Sair",
                "Deseja realmente sair da sua conta?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Sair", style: "destructive", onPress: confirmLogout }
                ]
            );
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />

            <View style={styles.root}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.topBarFake} />

                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Image 
                                source={require("../assets/images/logotipo-base.png")} 
                                style={styles.logoHeader}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.avatar} onPress={handleLogout}>
                                <Ionicons name="person" size={15} color="#7A7A7A" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <LinearGradient
                        colors={["#2FAFE6", "#6BC5FF"]}
                        start={{ x: 0, y: 0.1 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.recordsContainer}
                    >
                        <View style={styles.recordsHeader}>
                            <Text style={styles.recordsTitle}>Registros Diários</Text>
                            <TouchableOpacity onPress={() => setSelectedDate(new Date())}>
                                <Text style={styles.recordsMore}>Hoje</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.daysRow}>
                            <TouchableOpacity style={styles.arrowBtn}>
                                <AntDesign name="left" size={13} color="#FFFFFF" />
                            </TouchableOpacity>

                            {weekDays.map((item, index) => {
                                const isActive = 
                                    item.fullDate.getDate() === selectedDate.getDate() &&
                                    item.fullDate.getMonth() === selectedDate.getMonth();
                                
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.dayCard,
                                            isActive && styles.dayCardActive,
                                        ]}
                                        onPress={() => setSelectedDate(item.fullDate)}
                                    >
                                        <Text style={[styles.dayNumber, isActive && styles.dayNumberActive]}>
                                            {item.day}
                                        </Text>
                                        <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}

                            <TouchableOpacity style={styles.arrowBtn}>
                                <AntDesign name="right" size={13} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.viewAllInside}
                            onPress={() => router.push("/comportamentos_lista")}
                        >
                            <Text style={styles.viewAllInsideText}>Ver Tudo</Text>
                        </TouchableOpacity>

                        <View style={styles.recordList}>
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : filteredRecords.length > 0 ? (
                                filteredRecords.map((item, index) => (
                                    <View key={index} style={styles.recordItem}>
                                        <View style={styles.recordBullet} />
                                        <View style={styles.recordTextBlock}>
                                            <Text style={styles.recordDate}>
                                                {item.data ? new Date(item.data).toLocaleDateString() : "Sem data"}
                                            </Text>

                                            <View style={styles.recordBottomRow}>
                                                <Text style={styles.recordTime}>
                                                    {item.data ? new Date(item.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                                </Text>
                                                <Text style={styles.recordTitleText}>{item.observacao || "Registro"}</Text>
                                                <Text style={styles.recordLevel}>{item.tipoComportamento ? item.tipoComportamento.split(":")[0].split("(")[0].trim() : "---"}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ color: '#EAF8FF', textAlign: 'center', fontSize: 12, marginTop: 10 }}>
                                    Nenhum registro para este dia.
                                </Text>
                            )}
                        </View>
                    </LinearGradient>

                    <View style={styles.bottomWhiteArea}>
                        <View style={styles.statsRow}>
                            <TouchableOpacity style={styles.statCard}>
                                <View style={styles.statTop}>
                                    <Feather name="calendar" size={18} color="#45B8F0" />
                                    <Text style={styles.statNumber}>11</Text>
                                </View>
                                <Text style={styles.statLabel}>ROTINAS</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.statCard}
                                onPress={() => router.push("/comportamentos_lista")}
                            >
                                <View style={styles.statTop}>
                                    <Ionicons name="warning-outline" size={18} color="#45B8F0" />
                                    <Text style={styles.statNumber}>{records.length}</Text>
                                </View>
                                <Text style={styles.statLabel}>COMPORTAMENTOS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.bottomBar}>
                    {categories.slice(0, 2).map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.navItem}
                            onPress={() => item.route && router.push(item.route as any)}
                        >
                            <View style={styles.navIcon}>{item.icon}</View>
                            <Text style={styles.navText}>{item.title.replace("\n", " ")}</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity 
                        style={styles.plusButtonContainer}
                        onPress={() => router.push("/comportamento_registro")}
                    >
                        <LinearGradient
                            colors={["#2FAFE6", "#6BC5FF"]}
                            style={styles.plusButton}
                        >
                            <Ionicons name="add" size={32} color="#FFFFFF" />
                        </LinearGradient>
                    </TouchableOpacity>

                    {categories.slice(2, 4).map((item, index) => (
                        <TouchableOpacity
                            key={index + 2}
                            style={styles.navItem}
                            onPress={() => item.route && router.push(item.route as any)}
                        >
                            <View style={styles.navIcon}>{item.icon}</View>
                            <Text style={styles.navText}>{item.title.replace("\n", " ")}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F6F6F6",
    },
    root: {
        flex: 1,
        backgroundColor: "#F6F6F6",
    },
    scrollContent: {
        paddingBottom: 120,
    },

    topBarFake: {
        height: 4,
        backgroundColor: "#2C8EF4",
        marginHorizontal: 6,
        marginTop: 2,
        borderRadius: 1,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 14,
    },
    headerLeft: {
        flexDirection: "row",
        gap: 8,
    },
    iconCircle: {
        width: 27,
        height: 27,
        borderRadius: 13.5,
        borderWidth: 1,
        borderColor: "#D9EAF4",
        backgroundColor: "#F8FCFE",
        justifyContent: "center",
        alignItems: "center",
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
    },
    logoHeader: {
        width: 140,
        height: 35,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#D8D8D8",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    divider: {
        height: 1,
        backgroundColor: "#E5EEF4",
        marginHorizontal: 16,
        marginBottom: 14,
    },

    sectionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 15,
        color: "#45B8F0",
        fontWeight: "700",
    },
    seeAll: {
        fontSize: 12,
        color: "#45B8F0",
        fontWeight: "500",
    },

    categoriesRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        marginBottom: 18,
    },
    categoryItem: {
        width: 48,
        alignItems: "center",
    },
    categoryIcon: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 8.5,
        lineHeight: 10,
        textAlign: "center",
        color: "#45B8F0",
        fontWeight: "500",
    },

    recordsContainer: {
        marginHorizontal: 0,
        borderRadius: 0,
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 18,
    },
    recordsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    recordsTitle: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },
    recordsMore: {
        color: "#EAF8FF",
        fontSize: 11,
        fontWeight: "500",
    },

    daysRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        marginBottom: 12,
    },
    arrowBtn: {
        width: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    dayCard: {
        width: 34,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#DDF3FF",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    dayCardActive: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFFFFF",
    },
    dayNumber: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    dayNumberActive: {
        color: "#45B8F0",
    },
    dayLabel: {
        color: "#FFFFFF",
        fontSize: 7.5,
        fontWeight: "700",
        marginTop: 2,
    },
    dayLabelActive: {
        color: "#45B8F0",
    },

    viewAllInside: {
        alignItems: "flex-end",
        marginBottom: 6,
        paddingRight: 6,
    },
    viewAllInsideText: {
        color: "#EAF8FF",
        fontSize: 10,
    },

    recordList: {
        gap: 8,
    },
    recordItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        borderWidth: 1,
        borderColor: "#D7F1FF",
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 9,
    },
    recordBullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#FFFFFF",
        marginTop: 6,
        marginRight: 8,
    },
    recordTextBlock: {
        flex: 1,
    },
    recordDate: {
        color: "#FFFFFF",
        fontSize: 10,
        marginBottom: 3,
    },
    recordBottomRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    recordTime: {
        color: "#FFFFFF",
        fontSize: 11,
        width: 62,
    },
    recordTitleText: {
        color: "#FFFFFF",
        fontSize: 11,
        flex: 1,
        textAlign: "center",
        fontWeight: "600",
    },
    recordLevel: {
        color: "#FFFFFF",
        fontSize: 11,
        width: 72,
        textAlign: "right",
        fontWeight: "600",
    },

    bottomWhiteArea: {
        backgroundColor: "#F7F7F7",
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 28,
        minHeight: 125,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    statCard: {
        flex: 1,
        height: 56,
        borderWidth: 1,
        borderColor: "#56BDEF",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        paddingHorizontal: 12,
    },
    statTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    statNumber: {
        color: "#45B8F0",
        fontSize: 18,
        fontWeight: "700",
    },
    statLabel: {
        color: "#45B8F0",
        fontSize: 8.5,
        fontWeight: "700",
        textAlign: "right",
        marginTop: 2,
    },

    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 70,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#E5EEF4",
        paddingBottom: 5,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    navIcon: {
        marginBottom: 2,
    },
    navText: {
        fontSize: 9,
        color: "#45B8F0",
        fontWeight: "600",
        textAlign: "center",
    },
    plusButtonContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -30,
        backgroundColor: "#FFFFFF",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    plusButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
});