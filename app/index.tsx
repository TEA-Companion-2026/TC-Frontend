import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Alert,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
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

    const testUser = {
        email: "teste@teacompanion.com",
        password: "123456",
    };

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
            newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleLogin() {
        if (!validateForm()) return;

        try {
            const response = await authService.login({ email, password });
            console.log("Login realizado para:", response.email);
            
            await tokenStorage.saveToken(response.token);
            
            setErrors({});
            Alert.alert("Sucesso", "Login realizado com sucesso.");
            router.replace("/doctor_id");
        } catch (error: any) {
            setErrors({ general: error.message || "Erro ao realizar login." });
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#2FAFE6" />

            <LinearGradient
                colors={["#2FAFE6", "#6BC5FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Entrar</Text>
            </LinearGradient>

            <View style={styles.container}>
                <Text style={styles.welcome}>Bem Vindo!</Text>

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
                <View style={[styles.passwordWrapper, errors.password && styles.inputError]}>
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
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <TouchableOpacity onPress={() => router.push("/forgot_password")}>
                    <Text style={styles.forgot}>Esqueci a Senha</Text>
                </TouchableOpacity>

                {errors.general && <Text style={styles.generalError}>{errors.general}</Text>}

                <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
                    <LinearGradient
                        colors={["#2FAFE6", "#6BC5FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Entrar</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.socialText}>ou acesse com</Text>

                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton}>
                        <LinearGradient
                            colors={["#2FAFE6", "#6BC5FF"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.socialGradient}
                        >
                            <AntDesign name="google" size={24} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <LinearGradient
                            colors={["#2FAFE6", "#6BC5FF"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.socialGradient}
                        >
                            <FontAwesome name="facebook-square" size={24} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Não tem conta? </Text>
                    <TouchableOpacity onPress={() => router.push("/register")}>
                        <Text style={styles.link}>Inscreva-se</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.testUserBox}>
                    <Text style={styles.testUserTitle}>Usuário de teste</Text>
                    <Text style={styles.testUserText}>Email: teste@teacompanion.com</Text>
                    <Text style={styles.testUserText}>Senha: 123456</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#2FAFE6",
    },
    header: {
        height: 110,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
    },
    backButton: {
        position: "absolute",
        left: 20,
        top: 50,
    },
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        padding: 20,
    },
    welcome: {
        fontSize: 22,
        color: "#59B7ED",
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: "#2F2F2F",
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#EAF5FB",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "transparent",
        color: "#2F2F2F",
    },
    passwordWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5FB",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "transparent",
    },
    passwordInput: {
        flex: 1,
        padding: 12,
        color: "#2F2F2F",
    },
    inputError: {
        borderColor: "#E74C3C",
    },
    errorText: {
        color: "#E74C3C",
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 2,
    },
    generalError: {
        color: "#E74C3C",
        fontSize: 13,
        textAlign: "center",
        marginBottom: 14,
        fontWeight: "600",
    },
    forgot: {
        textAlign: "right",
        color: "#59B7ED",
        marginBottom: 20,
        fontWeight: "500",
    },
    buttonWrapper: {
        borderRadius: 25,
        overflow: "hidden",
        marginBottom: 20,
    },
    button: {
        padding: 15,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    socialText: {
        textAlign: "center",
        marginBottom: 10,
        color: "#4D4D4D",
    },
    socialButtons: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20,
    },
    socialButton: {
        borderRadius: 25,
        overflow: "hidden",
    },
    socialGradient: {
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 24,
    },
    footerText: {
        color: "#4D4D4D",
    },
    link: {
        color: "#59B7ED",
        fontWeight: "bold",
    },
    testUserBox: {
        backgroundColor: "#EAF5FB",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D4EBF7",
    },
    testUserTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2F2F2F",
        marginBottom: 6,
    },
    testUserText: {
        fontSize: 13,
        color: "#4D4D4D",
        marginBottom: 2,
    },
});