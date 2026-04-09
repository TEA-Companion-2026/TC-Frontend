import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
    Ionicons,
    Feather,
    MaterialCommunityIcons,
    FontAwesome5,
    AntDesign,
} from "@expo/vector-icons";

const weekDays = [
    { day: "9", label: "SEG" },
    { day: "10", label: "TER" },
    { day: "11", label: "QUA", active: true },
    { day: "12", label: "QUI" },
    { day: "13", label: "SEX" },
    { day: "12", label: "SAB" },
];

const categories = [
    {
        title: "Cadastrar\nIndivíduo",
        icon: <Feather name="clipboard" size={18} color="#45B8F0" />,
    },
    {
        title: "Doutor",
        icon: <FontAwesome5 name="stethoscope" size={17} color="#45B8F0" />,
    },
    {
        title: "Remédios",
        icon: <MaterialCommunityIcons name="pill" size={18} color="#45B8F0" />,
    },
    {
        title: "Registro\nde Rotina",
        icon: <Feather name="calendar" size={18} color="#45B8F0" />,
    },
    {
        title: "Registro De\nComportamento",
        icon: <MaterialCommunityIcons name="medical-bag" size={18} color="#45B8F0" />,
    },
];

const records = [
    {
        date: "08 Abril - Quarta - Hoje",
        time: "10:00 am",
        title: "Birra",
        level: "Leve",
    },
    {
        date: "06 Abril - Segunda",
        time: "08:00 am",
        title: "Agressividade",
        level: "Moderada",
    },
];

export default function HomeScreen() {
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
                            <TouchableOpacity style={styles.iconCircle}>
                                <Ionicons name="notifications-outline" size={15} color="#8AA8B7" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.iconCircle}>
                                <Ionicons name="settings-outline" size={15} color="#8AA8B7" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.iconCircle}>
                                <Feather name="search" size={14} color="#8AA8B7" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.headerRight}>
                            <Text style={styles.greeting}>Olá, Gabriel Curto!</Text>

                            <View style={styles.avatar}>
                                <Ionicons name="person" size={15} color="#7A7A7A" />
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionTitle}>Categorias</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Ver Tudo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.categoriesRow}>
                        {categories.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.categoryItem}>
                                <View style={styles.categoryIcon}>{item.icon}</View>
                                <Text style={styles.categoryText}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    <LinearGradient
                        colors={["#2FAFE6", "#6BC5FF"]}
                        start={{ x: 0, y: 0.1 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.recordsContainer}
                    >
                        <View style={styles.recordsHeader}>
                            <Text style={styles.recordsTitle}>Últimos Registros</Text>
                            <TouchableOpacity>
                                <Text style={styles.recordsMore}>Mês</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.daysRow}>
                            <TouchableOpacity style={styles.arrowBtn}>
                                <AntDesign name="left" size={13} color="#FFFFFF" />
                            </TouchableOpacity>

                            {weekDays.map((item, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dayCard,
                                        item.active && styles.dayCardActive,
                                    ]}
                                >
                                    <Text style={[styles.dayNumber, item.active && styles.dayNumberActive]}>
                                        {item.day}
                                    </Text>
                                    <Text style={[styles.dayLabel, item.active && styles.dayLabelActive]}>
                                        {item.label}
                                    </Text>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.arrowBtn}>
                                <AntDesign name="right" size={13} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.viewAllInside}>
                            <Text style={styles.viewAllInsideText}>Ver Tudo</Text>
                        </TouchableOpacity>

                        <View style={styles.recordList}>
                            {records.map((item, index) => (
                                <View key={index} style={styles.recordItem}>
                                    <View style={styles.recordBullet} />
                                    <View style={styles.recordTextBlock}>
                                        <Text style={styles.recordDate}>{item.date}</Text>

                                        <View style={styles.recordBottomRow}>
                                            <Text style={styles.recordTime}>{item.time}</Text>
                                            <Text style={styles.recordTitleText}>{item.title}</Text>
                                            <Text style={styles.recordLevel}>{item.level}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
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

                            <TouchableOpacity style={styles.statCard}>
                                <View style={styles.statTop}>
                                    <Ionicons name="warning-outline" size={18} color="#45B8F0" />
                                    <Text style={styles.statNumber}>11</Text>
                                </View>
                                <Text style={styles.statLabel}>COMPORTAMENTOS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.floatingButton}>
                        <MaterialCommunityIcons name="puzzle-outline" size={34} color="#FFFFFF" />
                    </TouchableOpacity>
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
    greeting: {
        fontSize: 13,
        color: "#5BBCEB",
        fontWeight: "500",
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
        height: 56,
        backgroundColor: "#DDEBF5",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    floatingButton: {
        width: 62,
        height: 62,
        borderRadius: 31,
        marginTop: -26,
        backgroundColor: "#4DBCF3",
        borderWidth: 4,
        borderColor: "#DDEBF5",
        justifyContent: "center",
        alignItems: "center",
    },
});