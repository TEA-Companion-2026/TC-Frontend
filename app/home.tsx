import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BottomBar } from "../components/home/BottomBar";
import { HomeHeader } from "../components/home/HomeHeader";
import { RecordItem } from "../components/home/RecordItem";
import { WeekDay, WeeklyCalendar } from "../components/home/WeeklyCalendar";
import { authService } from "../services/authService";
import {
    ComportamentoDTO,
    comportamentoService,
} from "../services/comportamentoService";
import { tokenStorage } from "../services/tokenStorage";

// Helper to generate the current week days
function getWeekDays(baseDate: Date = new Date()): WeekDay[] {
	const days: WeekDay[] = [];
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

const CATEGORIES = [
	{
		title: "Rotina",
		icon: <Feather name="calendar" size={18} color="#45B8F0" />,
		route: "/routine_register",
	},
	{
		title: "Comportamentos",
		icon: <Feather name="activity" size={18} color="#45B8F0" />,
		route: "/comportamentos_lista",
	},
	{
		title: "Doutor",
		icon: <FontAwesome5 name="stethoscope" size={17} color="#45B8F0" />,
		route: "/doctor_id",
	},
	{
		title: "Perfil",
		icon: <Feather name="user" size={18} color="#45B8F0" />,
		route: "/modal",
	},
];

export default function HomeScreen() {
	const [records, setRecords] = useState<ComportamentoDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const weekDays = useMemo(() => getWeekDays(), []);

	const loadRecords = useCallback(async () => {
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
	}, []);

	useFocusEffect(
		useCallback(() => {
			loadRecords();
		}, [loadRecords]),
	);

	const filteredRecords = useMemo(() => {
		return records.filter((record) => {
			if (!record.data) return false;
			const recordDate = new Date(record.data);
			return (
				recordDate.getDate() === selectedDate.getDate() &&
				recordDate.getMonth() === selectedDate.getMonth() &&
				recordDate.getFullYear() === selectedDate.getFullYear()
			);
		});
	}, [records, selectedDate]);

	const handleLogout = async () => {
		const confirmLogout = () => {
			authService.logout();
			router.replace("/");
		};

		if (Platform.OS === "web") {
			if (window.confirm("Deseja realmente sair?")) {
				confirmLogout();
			}
		} else {
			Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
				{ text: "Cancelar", style: "cancel" },
				{ text: "Sair", style: "destructive", onPress: confirmLogout },
			]);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />

			<View style={styles.root}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}>
					<HomeHeader onLogout={handleLogout} />

					<LinearGradient
						colors={["#2FAFE6", "#6BC5FF"]}
						start={{ x: 0, y: 0.1 }}
						end={{ x: 1, y: 1 }}
						style={styles.recordsContainer}>
						<WeeklyCalendar
							weekDays={weekDays}
							selectedDate={selectedDate}
							onSelectDate={setSelectedDate}
							onResetToday={() => setSelectedDate(new Date())}
						/>

						<TouchableOpacity
							style={styles.viewAllInside}
							onPress={() => router.push("/comportamentos_lista")}>
							<Text style={styles.viewAllInsideText}>Ver Tudo</Text>
						</TouchableOpacity>

						<View style={styles.recordList}>
							{loading ? (
								<ActivityIndicator color="#FFF" />
							) : filteredRecords.length > 0 ? (
								filteredRecords.map((item, index) => (
									<RecordItem key={index} item={item} />
								))
							) : (
								<Text style={styles.emptyText}>Nenhum registro para este dia.</Text>
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
								onPress={() => router.push("/comportamentos_lista")}>
								<View style={styles.statTop}>
									<Ionicons name="warning-outline" size={18} color="#45B8F0" />
									<Text style={styles.statNumber}>{records.length}</Text>
								</View>
								<Text style={styles.statLabel}>COMPORTAMENTOS</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>

				<BottomBar
					categories={CATEGORIES}
					onNavigate={(route) => router.push(route as any)}
					onAddPress={() => router.push("/comportamento_registro")}
				/>
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
	recordsContainer: {
		paddingHorizontal: 14,
		paddingTop: 14,
		paddingBottom: 18,
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
	emptyText: {
		color: "#EAF8FF",
		textAlign: "center",
		fontSize: 12,
		marginTop: 10,
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
});
