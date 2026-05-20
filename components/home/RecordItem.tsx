import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ComportamentoDTO } from "../../services/comportamentoService";

interface RecordItemProps {
	item: ComportamentoDTO;
}

export const RecordItem: React.FC<RecordItemProps> = ({ item }) => {
	const date = item.data ? new Date(item.data) : null;

	return (
		<View style={styles.recordItem}>
			<View style={styles.recordBullet} />
			<View style={styles.recordTextBlock}>
				<Text style={styles.recordDate}>
					{date ? date.toLocaleDateString() : "Sem data"}
				</Text>

				<View style={styles.recordBottomRow}>
					<Text style={styles.recordTime}>
						{date
							? date.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})
							: "--:--"}
					</Text>
					<Text style={styles.recordTitleText}>
						{item.observacao || "Registro"}
					</Text>
					<Text style={styles.recordLevel}>
						{item.tipoComportamento
							? item.tipoComportamento.split(":")[0].split("(")[0].trim()
							: "---"}
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
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
});
