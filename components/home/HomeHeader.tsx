import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HomeHeaderProps {
	onLogout: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onLogout }) => {
	return (
		<>
			<View style={styles.topBarFake} />
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Image
						source={require("../../assets/images/logotipo-icon.png")}
						style={styles.logoHeader}
						resizeMode="contain"
					/>
				</View>

				<View style={styles.headerRight}>
					<TouchableOpacity style={styles.avatar} onPress={onLogout}>
						<Ionicons name="person" size={15} color="#7A7A7A" />
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.divider} />
		</>
	);
};

const styles = StyleSheet.create({
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
	headerLeft: {},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 9,
	},
	logoHeader: {
		width: 80,
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
});
