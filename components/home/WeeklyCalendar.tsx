import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export interface WeekDay {
	day: string;
	label: string;
	fullDate: Date;
}

interface WeeklyCalendarProps {
	weekDays: WeekDay[];
	selectedDate: Date;
	onSelectDate: (date: Date) => void;
	onResetToday: () => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
	weekDays,
	selectedDate,
	onSelectDate,
	onResetToday,
}) => {
	return (
		<>
			<View style={styles.recordsHeader}>
				<Text style={styles.recordsTitle}>Registros Diários</Text>
				<TouchableOpacity onPress={onResetToday}>
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
							style={[styles.dayCard, isActive && styles.dayCardActive]}
							onPress={() => onSelectDate(item.fullDate)}>
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
		</>
	);
};

const styles = StyleSheet.create({
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
});
