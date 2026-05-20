import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { userService } from "../services/userService";

type Errors = {
	fullName?: string;
	username?: string;
	email?: string;
	password?: string;
	general?: string;
};

export default function RegisterScreen() {
	const [fullName, setFullName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Errors>({});
	const [loading, setLoading] = useState(false);

	function isValidEmail(value: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
	}

	function validateForm() {
		const newErrors: Errors = {};

		if (!fullName.trim()) newErrors.fullName = "Informe seu nome completo.";

		if (!username.trim()) newErrors.username = "Informe um nome de usuário.";
		else if (username.length < 3) newErrors.username = "Mínimo de 3 caracteres.";

		if (!email.trim()) newErrors.email = "Informe seu email.";
		else if (!isValidEmail(email)) newErrors.email = "Email inválido.";

		if (!password.trim()) newErrors.password = "Informe uma senha.";
		else if (password.length < 6) newErrors.password = "Mínimo de 6 caracteres.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	const isFormValid = useMemo(() => {
		return Boolean(
			fullName.trim() && username.trim() && email.trim() && password.trim(),
		);
	}, [fullName, username, email, password]);

	async function handleRegister() {
		if (!validateForm()) return;

		setLoading(true);
		setErrors({});

		try {
			await userService.create({
				nome: fullName.trim(),
				username: username.trim().toLowerCase(),
				email: email.trim().toLowerCase(),
				password: password,
			});

			setLoading(false);
			Alert.alert("Sucesso", "Sua conta foi criada com sucesso!", [
				{ text: "OK", onPress: () => router.replace("/") },
			]);
		} catch (error: any) {
			setLoading(false);
			setErrors({ general: error.message || "Erro ao realizar cadastro." });
		}
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}>
					<View style={styles.container}>
						<View style={styles.logoContainer}>
							<Image
								source={require("../assets/images/logotipo-base-nobg.png")}
								style={styles.logoBase}
								resizeMode="contain"
							/>
							<Text style={styles.title}>Crie sua conta</Text>
							<Text style={styles.subtitle}>
								Comece sua jornada de acompanhamento especializado
							</Text>
						</View>

						<View style={styles.formArea}>
							<View style={styles.fieldBlock}>
								<Text style={styles.label}>Nome Completo</Text>
								<TextInput
									style={[styles.input, errors.fullName && styles.inputError]}
									placeholder="Como quer ser chamado?"
									placeholderTextColor="#B7D5E8"
									value={fullName}
									onChangeText={(value) => {
										setFullName(value);
										if (errors.fullName)
											setErrors((prev) => ({ ...prev, fullName: undefined }));
									}}
								/>
								{errors.fullName && (
									<Text style={styles.errorText}>{errors.fullName}</Text>
								)}
							</View>

							<View style={styles.fieldBlock}>
								<Text style={styles.label}>Nome de Usuário</Text>
								<TextInput
									style={[styles.input, errors.username && styles.inputError]}
									placeholder="Ex: joaosilva"
									placeholderTextColor="#B7D5E8"
									autoCapitalize="none"
									value={username}
									onChangeText={(value) => {
										setUsername(value);
										if (errors.username)
											setErrors((prev) => ({ ...prev, username: undefined }));
									}}
								/>
								{errors.username && (
									<Text style={styles.errorText}>{errors.username}</Text>
								)}
							</View>

							<View style={styles.fieldBlock}>
								<Text style={styles.label}>E-mail</Text>
								<TextInput
									style={[styles.input, errors.email && styles.inputError]}
									placeholder="exemplo@email.com"
									placeholderTextColor="#B7D5E8"
									keyboardType="email-address"
									autoCapitalize="none"
									value={email}
									onChangeText={(value) => {
										setEmail(value);
										if (errors.email)
											setErrors((prev) => ({ ...prev, email: undefined }));
									}}
								/>
								{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
							</View>

							<View style={styles.fieldBlock}>
								<Text style={styles.label}>Senha</Text>
								<View
									style={[styles.passwordWrapper, errors.password && styles.inputError]}>
									<TextInput
										style={styles.passwordInput}
										placeholder="No mínimo 6 caracteres"
										placeholderTextColor="#B7D5E8"
										secureTextEntry={!showPassword}
										value={password}
										onChangeText={(value) => {
											setPassword(value);
											if (errors.password)
												setErrors((prev) => ({ ...prev, password: undefined }));
										}}
									/>
									<TouchableOpacity
										onPress={() => setShowPassword(!showPassword)}
										style={styles.eyeButton}>
										<Ionicons
											name={showPassword ? "eye-outline" : "eye-off-outline"}
											size={22}
											color="#8C99A5"
										/>
									</TouchableOpacity>
								</View>
								{errors.password && (
									<Text style={styles.errorText}>{errors.password}</Text>
								)}
							</View>

							{errors.general && (
								<Text style={styles.generalError}>{errors.general}</Text>
							)}

							<Text style={styles.termsText}>
								Ao cadastrar-se, você aceita nossos{" "}
								<Text style={styles.linkHighlight}>Termos de Uso</Text> e{" "}
								<Text style={styles.linkHighlight}>Privacidade.</Text>
							</Text>

							<TouchableOpacity
								style={[
									styles.registerButtonWrapper,
									(!isFormValid || loading) && styles.buttonDisabled,
								]}
								onPress={handleRegister}
								disabled={loading}>
								<LinearGradient
									colors={["#2FAFE6", "#6BC5FF"]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									style={styles.registerButton}>
									<Text style={styles.registerButtonText}>
										{loading ? "Processando..." : "Finalizar Cadastro"}
									</Text>
								</LinearGradient>
							</TouchableOpacity>

							<View style={styles.footerRow}>
								<Text style={styles.footerText}>Já possui uma conta? </Text>
								<TouchableOpacity onPress={() => router.replace("/")}>
									<Text style={styles.footerLink}>Acesse aqui</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#F8F8F8",
	},
	scrollContent: {
		flexGrow: 1,
	},
	container: {
		flex: 1,
		paddingHorizontal: 32,
		paddingTop: 60,
		paddingBottom: 40,
		alignItems: "center",
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 40,
	},
	logoBase: {
		width: 360,
		height: 100,
		marginBottom: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: "800",
		color: "#2C8EF4",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 14,
		color: "#8AA8B7",
		textAlign: "center",
		fontWeight: "500",
		paddingHorizontal: 20,
	},
	formArea: {
		width: "100%",
	},
	fieldBlock: {
		marginBottom: 16,
	},
	label: {
		fontSize: 13,
		marginBottom: 8,
		color: "#2C8EF4",
		fontWeight: "800",
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginLeft: 4,
	},
	input: {
		width: "100%",
		height: 54,
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 18,
		borderRadius: 14,
		borderWidth: 1.5,
		borderColor: "#EAF5FB",
		color: "#2F2F2F",
		fontSize: 16,
	},
	passwordWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
		borderWidth: 1.5,
		borderColor: "#EAF5FB",
		height: 54,
		paddingRight: 12,
	},
	passwordInput: {
		flex: 1,
		height: "100%",
		paddingHorizontal: 18,
		fontSize: 16,
		color: "#2F2F2F",
	},
	eyeButton: {
		paddingLeft: 8,
	},
	inputError: {
		borderColor: "#FFBABA",
		backgroundColor: "#FFF5F5",
	},
	errorText: {
		color: "#E74C3C",
		fontSize: 12,
		marginTop: 6,
		marginLeft: 8,
		fontWeight: "600",
	},
	generalError: {
		color: "#E74C3C",
		fontSize: 13,
		textAlign: "center",
		marginBottom: 16,
		fontWeight: "700",
	},
	termsText: {
		textAlign: "center",
		fontSize: 13,
		color: "#A0BBC8",
		lineHeight: 18,
		marginVertical: 20,
		paddingHorizontal: 10,
	},
	linkHighlight: {
		color: "#53B6EC",
		fontWeight: "700",
	},
	registerButtonWrapper: {
		width: "100%",
		borderRadius: 28,
		overflow: "hidden",
		elevation: 4,
		shadowColor: "#2FAFE6",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		marginBottom: 30,
	},
	registerButton: {
		height: 58,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	registerButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "900",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	footerRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	footerText: {
		fontSize: 15,
		color: "#4D4D4D",
		fontWeight: "500",
	},
	footerLink: {
		fontSize: 15,
		color: "#2C8EF4",
		fontWeight: "800",
	},
});
