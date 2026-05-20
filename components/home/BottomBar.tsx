import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Category {
	title: string;
	icon: React.ReactNode;
	route: string;
}

interface BottomBarProps {
	categories: Category[];
	onNavigate: (route: string) => void;
	onAddPress: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
	categories,
	onNavigate,
	onAddPress,
}) => {
	return (
		<View style={styles.bottomBar}>
			{categories.slice(0, 2).map((item, index) => (
				<TouchableOpacity
					key={index}
					style={styles.navItem}
					onPress={() => onNavigate(item.route)}>
					<View style={styles.navIcon}>{item.icon}</View>
					<Text style={styles.navText}>{item.title}</Text>
				</TouchableOpacity>
			))}

			<TouchableOpacity style={styles.plusButtonContainer} onPress={onAddPress}>
				<LinearGradient colors={["#2FAFE6", "#6BC5FF"]} style={styles.plusButton}>
					<Ionicons name="add" size={32} color="#FFFFFF" />
				</LinearGradient>
			</TouchableOpacity>

			{categories.slice(2, 4).map((item, index) => (
				<TouchableOpacity
					key={index + 2}
					style={styles.navItem}
					onPress={() => onNavigate(item.route)}>
					<View style={styles.navIcon}>{item.icon}</View>
					<Text style={styles.navText}>{item.title}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
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
