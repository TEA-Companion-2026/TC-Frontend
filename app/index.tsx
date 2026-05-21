import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
import { authService } from "../services/authService";
import { tokenStorage } from "../services/tokenStorage";

type LoginErrors = {
	email?: string;
	password?: string;
	general?: string;
};

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<LoginErrors>({});

	function isValidEmail(value: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
	}

	function validateForm() {
		const newErrors: LoginErrors = {};

		if (!email.trim()) {
			newErrors.email = "Informe o email.";
		} else if (!isValidEmail(email)) {
			newErrors.email = "Digite um email válido.";
		}

		if (!password.trim()) {
			newErrors.password = "Informe a senha.";
		} else if (password.length < 6) {
			newErrors.password = "Mínimo de 6 caracteres.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	async function handleLogin() {
		if (!validateForm()) return;

		try {
			const response = await authService.login({ email, password });
			await tokenStorage.saveToken(response.token);
			setErrors({});
			router.replace("/home");
		} catch (error: any) {
			setErrors({ general: error.message || "Erro ao realizar login." });
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
								style={styles.logoBaseLogin}
								resizeMode="contain"
							/>
							<Text style={styles.welcomeSubtitle}>
								Acompanhamento especializado para o autismo
							</Text>
						</View>

						<View style={styles.formContainer}>
							<Text style={styles.label}>Email</Text>
							<TextInput
								style={[styles.input, errors.email && styles.inputError]}
								placeholder="exemplo@exemplo.com"
								placeholderTextColor="#B7D5E8"
								value={email}
								onChangeText={(value) => {
									setEmail(value);
									setErrors((prev) => ({
										...prev,
										email: undefined,
										general: undefined,
									}));
								}}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
							{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

							<Text style={styles.label}>Senha</Text>
							<View
								style={[styles.passwordWrapper, errors.password && styles.inputError]}>
								<TextInput
									style={styles.passwordInput}
									placeholder="*************"
									placeholderTextColor="#B7D5E8"
									secureTextEntry={!showPassword}
									value={password}
									onChangeText={(value) => {
										setPassword(value);
										setErrors((prev) => ({
											...prev,
											password: undefined,
											general: undefined,
										}));
									}}
								/>
								<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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

							<TouchableOpacity onPress={() => router.push("/forgot_password")}>
								<Text style={styles.forgot}>Esqueci a Senha</Text>
							</TouchableOpacity>

							{errors.general && (
								<Text style={styles.generalError}>{errors.general}</Text>
							)}

							<TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
								<LinearGradient
									colors={["#2FAFE6", "#6BC5FF"]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									style={styles.button}>
									<Text style={styles.buttonText}>Entrar</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>

						<View style={styles.footerContainer}>
							<View style={styles.footer}>
								<Text style={styles.footerText}>Não tem conta? </Text>
								<TouchableOpacity onPress={() => router.push("/register")}>
									<Text style={styles.link}>Inscreva-se</Text>
								</TouchableOpacity>
							</View>
						</View>

						<View style={styles.testUserBox}>
							<Text style={styles.testUserTitle}>
								Usuários de teste (Senha: 123456)
							</Text>
							<Text style={styles.testUserText}>resp1@teste.com</Text>
							<Text style={styles.testUserText}>resp2@teste.com</Text>
							<Text style={styles.testUserText}>psi@teste.com</Text>
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
		backgroundColor: "#F8F8F8",
	},
	container: {
		flex: 1,
		paddingHorizontal: 32,
		paddingTop: 80,
		paddingBottom: 30,
		alignItems: "center",
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 50,
	},
	logoBaseLogin: {
		width: 240,
		height: 70,
		marginBottom: 10,
	},
	welcomeSubtitle: {
		fontSize: 14,
		color: "#8AA8B7",
		fontWeight: "600",
		textAlign: "center",
	},
	formContainer: {
		width: "100%",
	},
	label: {
		fontSize: 14,
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
		marginBottom: 6,
		borderWidth: 1.5,
		borderColor: "#EAF5FB",
		color: "#2F2F2F",
		fontSize: 16,
	},
	passwordWrapper: {
		width: "100%",
		height: 54,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
		paddingHorizontal: 18,
		marginBottom: 6,
		borderWidth: 1.5,
		borderColor: "#EAF5FB",
	},
	passwordInput: {
		flex: 1,
		height: "100%",
		color: "#2F2F2F",
		fontSize: 16,
	},
	inputError: {
		borderColor: "#FFBABA",
		backgroundColor: "#FFF5F5",
	},
	errorText: {
		color: "#E74C3C",
		fontSize: 12,
		marginBottom: 14,
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
	forgot: {
		alignSelf: "flex-end",
		color: "#59B7ED",
		marginBottom: 35,
		fontWeight: "800",
		fontSize: 14,
	},
	buttonWrapper: {
		width: "100%",
		borderRadius: 28,
		overflow: "hidden",
		elevation: 4,
		shadowColor: "#2FAFE6",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		marginBottom: 40,
	},
	button: {
		height: 58,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "900",
		fontSize: 18,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	footerContainer: {
		width: "100%",
		alignItems: "center",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 40,
	},
	footerText: {
		color: "#4D4D4D",
		fontSize: 15,
		fontWeight: "500",
	},
	link: {
		color: "#2C8EF4",
		fontWeight: "800",
		fontSize: 15,
	},
	testUserBox: {
		width: "100%",
		backgroundColor: "#FFFFFF",
		padding: 20,
		borderRadius: 20,
		borderWidth: 1.5,
		borderColor: "#EAF5FB",
		borderStyle: "dashed",
	},
	testUserTitle: {
		fontSize: 12,
		fontWeight: "800",
		color: "#A0BBC8",
		marginBottom: 10,
		textTransform: "uppercase",
		letterSpacing: 1.2,
	},
	testUserText: {
		fontSize: 14,
		color: "#4D4D4D",
		marginBottom: 4,
		fontWeight: "700",
	},
});
