import React, { useMemo, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
    ScrollView,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { userService } from "../services/userService";

type Errors = {
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
    birthDate?: string;
    cpf?: string;
    rg?: string;
    general?: string;
};

export default function RegisterScreen() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);

    function onlyDigits(value: string) {
        return value.replace(/\D/g, "");
    }

    function formatPhone(value: string) {
        const digits = onlyDigits(value).slice(0, 11);

        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    function formatDate(value: string) {
        const digits = onlyDigits(value).slice(0, 8);

        if (digits.length <= 2) return digits;
        if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }

    function formatCpf(value: string) {
        const digits = onlyDigits(value).slice(0, 11);

        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
        if (digits.length <= 9) {
            return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
        }
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }

    function formatRg(value: string) {
        const clean = value.replace(/[^0-9Xx]/g, "").slice(0, 9).toUpperCase();

        if (clean.length <= 2) return clean;
        if (clean.length <= 5) return `${clean.slice(0, 2)}.${clean.slice(2)}`;
        if (clean.length <= 8) return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5)}`;
        return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}-${clean.slice(8)}`;
    }

    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    function isValidDate(value: string) {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;

        const [dayStr, monthStr, yearStr] = value.split("/");
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);

        if (year < 1900 || year > new Date().getFullYear()) return false;
        if (month < 1 || month > 12) return false;

        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) return false;

        const birth = new Date(year, month - 1, day);
        const today = new Date();

        return birth <= today;
    }

    function isValidPhone(value: string) {
        const digits = onlyDigits(value);
        return digits.length === 10 || digits.length === 11;
    }

    function isValidRg(value: string) {
        const clean = value.replace(/[^0-9Xx]/g, "");
        return clean.length >= 7 && clean.length <= 9;
    }

    function isValidCpf(value: string) {
        const cpfDigits = onlyDigits(value);

        if (cpfDigits.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpfDigits)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += Number(cpfDigits[i]) * (10 - i);
        }

        let firstDigit = (sum * 10) % 11;
        if (firstDigit === 10) firstDigit = 0;
        if (firstDigit !== Number(cpfDigits[9])) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += Number(cpfDigits[i]) * (11 - i);
        }

        let secondDigit = (sum * 10) % 11;
        if (secondDigit === 10) secondDigit = 0;

        return secondDigit === Number(cpfDigits[10]);
    }

    function validateForm() {
        const newErrors: Errors = {};

        if (!fullName.trim()) newErrors.fullName = "Informe o nome completo.";
        if (!email.trim()) newErrors.email = "Informe o email.";
        else if (!isValidEmail(email)) newErrors.email = "Email inválido.";

        if (!password.trim()) newErrors.password = "Informe a senha.";
        else if (password.length < 6) newErrors.password = "A senha deve ter no mínimo 6 caracteres.";

        if (!phone.trim()) newErrors.phone = "Informe o telefone.";
        else if (!isValidPhone(phone)) newErrors.phone = "Telefone inválido.";

        if (!birthDate.trim()) newErrors.birthDate = "Informe a data de nascimento.";
        else if (!isValidDate(birthDate)) newErrors.birthDate = "Data de nascimento inválida.";

        if (!cpf.trim()) newErrors.cpf = "Informe o CPF.";
        else if (!isValidCpf(cpf)) newErrors.cpf = "CPF inválido.";

        if (!rg.trim()) newErrors.rg = "Informe o RG.";
        else if (!isValidRg(rg)) newErrors.rg = "RG inválido.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const isFormValid = useMemo(() => {
        return Boolean(
            fullName.trim() &&
            email.trim() &&
            password.trim() &&
            phone.trim() &&
            birthDate.trim() &&
            cpf.trim() &&
            rg.trim()
        );
    }, [fullName, email, password, phone, birthDate, cpf, rg]);

    async function handleRegister() {
        const formIsValid = validateForm();

        if (!formIsValid) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            await userService.create({
                nome: fullName.trim(),
                email: email.trim().toLowerCase(),
                username: email.trim().toLowerCase(), // Usando email como username
                password: password,
            });

            setLoading(false);
            Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/"),
                },
            ]);
        } catch (error: any) {
            setLoading(false);
            setErrors({ general: error.message || "Erro ao realizar cadastro." });
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
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Nova Conta</Text>
            </LinearGradient>

            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formArea}>
                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>Nome Completo</Text>
                            <TextInput
                                style={[styles.input, errors.fullName && styles.inputError]}
                                placeholder="nome"
                                placeholderTextColor="#B7D5E8"
                                value={fullName}
                                onChangeText={(value) => {
                                    setFullName(value);
                                    if (errors.fullName) {
                                        setErrors((prev) => ({ ...prev, fullName: undefined }));
                                    }
                                }}
                            />
                            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                placeholder="exemplo@exemplo.com"
                                placeholderTextColor="#B7D5E8"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={(value) => {
                                    setEmail(value);
                                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                                }}
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>Senha</Text>
                            <View style={[styles.passwordWrapper, errors.password && styles.inputError]}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="************"
                                    placeholderTextColor="#B7D5E8"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={(value) => {
                                        setPassword(value);
                                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={22}
                                        color="#8C99A5"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>Numero de Telefone</Text>
                            <TextInput
                                style={[styles.input, errors.phone && styles.inputError]}
                                placeholder="(11) 99999-9999"
                                placeholderTextColor="#B7D5E8"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={(value) => {
                                    setPhone(formatPhone(value));
                                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                                }}
                                maxLength={15}
                            />
                            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>Data de Nascimento</Text>
                            <TextInput
                                style={[styles.input, errors.birthDate && styles.inputError]}
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor="#B7D5E8"
                                keyboardType="number-pad"
                                value={birthDate}
                                onChangeText={(value) => {
                                    setBirthDate(formatDate(value));
                                    if (errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: undefined }));
                                }}
                                maxLength={10}
                            />
                            {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>CPF</Text>
                            <TextInput
                                style={[styles.input, errors.cpf && styles.inputError]}
                                placeholder="000.000.000-00"
                                placeholderTextColor="#B7D5E8"
                                keyboardType="number-pad"
                                value={cpf}
                                onChangeText={(value) => {
                                    setCpf(formatCpf(value));
                                    if (errors.cpf) setErrors((prev) => ({ ...prev, cpf: undefined }));
                                }}
                                maxLength={14}
                            />
                            {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>RG</Text>
                            <TextInput
                                style={[styles.input, errors.rg && styles.inputError]}
                                placeholder="00.000.000-0"
                                placeholderTextColor="#B7D5E8"
                                autoCapitalize="characters"
                                value={rg}
                                onChangeText={(value) => {
                                    setRg(formatRg(value));
                                    if (errors.rg) setErrors((prev) => ({ ...prev, rg: undefined }));
                                }}
                                maxLength={12}
                            />
                            {errors.rg && <Text style={styles.errorText}>{errors.rg}</Text>}
                        </View>

                        {errors.general && <Text style={styles.generalError}>{errors.general}</Text>}

                        <Text style={styles.termsText}>
                            Ao continuar, você concorda com os{" "}
                            <Text style={styles.linkHighlight}>Termos de Uso</Text> e{" "}
                            <Text style={styles.linkHighlight}>Política de Privacidade.</Text>
                        </Text>

                        <TouchableOpacity
                            style={[styles.registerButtonWrapper, (!isFormValid || loading) && styles.buttonDisabled]}
                            onPress={handleRegister}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={["#2FAFE6", "#6BC5FF"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.registerButton}
                            >
                                <Text style={styles.registerButtonText}>
                                    {loading ? "Cadastrando..." : "Cadastrar"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.socialText}>ou cadastre com</Text>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton}>
                                <LinearGradient
                                    colors={["#2FAFE6", "#6BC5FF"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.socialGradient}
                                >
                                    <AntDesign name="google" size={24} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton}>
                                <LinearGradient
                                    colors={["#2FAFE6", "#6BC5FF"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.socialGradient}
                                >
                                    <FontAwesome name="facebook-square" size={24} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerTextRow}>
                            <Text style={styles.footerText}>Já tem conta? </Text>
                            <TouchableOpacity onPress={() => router.replace("/")}>
                                <Text style={styles.footerLink}>Acesse</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#2FAFE6",
    },
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },
    header: {
        height: 108,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    backButton: {
        position: "absolute",
        left: 18,
        top: 50,
        zIndex: 10,
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        marginTop: 18,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    formArea: {
        paddingHorizontal: 24,
        paddingTop: 22,
    },
    fieldBlock: {
        marginBottom: 14,
    },
    label: {
        fontSize: 17,
        fontWeight: "700",
        color: "#2F2F2F",
        marginBottom: 8,
    },
    input: {
        width: "100%",
        height: 46,
        backgroundColor: "#EAF5FB",
        borderRadius: 6,
        paddingHorizontal: 14,
        fontSize: 16,
        color: "#2F2F2F",
        borderWidth: 1,
        borderColor: "transparent",
    },
    passwordWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5FB",
        borderRadius: 6,
        height: 46,
        paddingRight: 12,
        borderWidth: 1,
        borderColor: "transparent",
    },
    passwordInput: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 14,
        fontSize: 16,
        color: "#2F2F2F",
    },
    eyeButton: {
        paddingLeft: 8,
    },
    inputError: {
        borderColor: "#E74C3C",
    },
    errorText: {
        color: "#E74C3C",
        fontSize: 12,
        marginTop: 5,
        marginLeft: 2,
    },
    generalError: {
        color: "#E74C3C",
        fontSize: 13,
        textAlign: "center",
        marginBottom: 14,
        fontWeight: "600",
    },
    termsText: {
        textAlign: "center",
        fontSize: 13,
        color: "#4D4D4D",
        lineHeight: 18,
        marginTop: 4,
        marginBottom: 14,
        paddingHorizontal: 12,
    },
    linkHighlight: {
        color: "#53B6EC",
        fontWeight: "600",
    },
    registerButtonWrapper: {
        alignSelf: "center",
        width: 270,
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 22,
    },
    registerButton: {
        height: 43,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.9,
    },
    registerButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
    socialText: {
        textAlign: "center",
        fontSize: 16,
        color: "#4D4D4D",
        marginBottom: 14,
    },
    socialButtons: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 14,
        marginBottom: 22,
    },
    socialButton: {
        borderRadius: 23,
        overflow: "hidden",
    },
    socialGradient: {
        width: 46,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
    },
    footerTextRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    footerText: {
        fontSize: 16,
        color: "#4D4D4D",
    },
    footerLink: {
        fontSize: 16,
        color: "#59B7ED",
        fontWeight: "700",
    },
});