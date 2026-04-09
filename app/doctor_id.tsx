import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

type Errors = {
    doctorId?: string;
    general?: string;
};

export default function DoctorIdScreen() {
    const [doctorId, setDoctorId] = useState("");
    const [errors, setErrors] = useState<Errors>({});

    const validDoctorId = "DOC123";

    function validateForm() {
        const newErrors: Errors = {};

        if (!doctorId.trim()) {
            newErrors.doctorId = "Informe o ID do doutor.";
        } else if (doctorId.trim().length < 4) {
            newErrors.doctorId = "O ID informado é inválido.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleContinue() {
        if (!validateForm()) return;

        if (doctorId.trim().toUpperCase() !== validDoctorId) {
            setErrors({
                general: "ID do doutor não encontrado.",
            });
            return;
        }

        setErrors({});
        router.replace("/home");
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
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Vincular Doutor</Text>
            </LinearGradient>

            <View style={styles.container}>
                <Text style={styles.title}>Informe o ID do Doutor</Text>
                <Text style={styles.subtitle}>
                    Antes de acessar o aplicativo, digite o ID fornecido pelo profissional
                    responsável para vincular o acompanhamento.
                </Text>

                <Text style={styles.label}>ID do Doutor</Text>
                <TextInput
                    style={[styles.input, errors.doctorId && styles.inputError]}
                    placeholder="Ex.: DOC123"
                    placeholderTextColor="#B7D5E8"
                    autoCapitalize="characters"
                    value={doctorId}
                    onChangeText={(value) => {
                        setDoctorId(value.toUpperCase());
                        setErrors((prev) => ({
                            ...prev,
                            doctorId: undefined,
                            general: undefined,
                        }));
                    }}
                />
                {errors.doctorId && <Text style={styles.errorText}>{errors.doctorId}</Text>}

                {errors.general && <Text style={styles.generalError}>{errors.general}</Text>}

                <TouchableOpacity style={styles.buttonWrapper} onPress={handleContinue}>
                    <LinearGradient
                        colors={["#2FAFE6", "#6BC5FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Continuar</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.testBox}>
                    <Text style={styles.testTitle}>ID de teste</Text>
                    <Text style={styles.testText}>DOC123</Text>
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
    backButton: {
        position: "absolute",
        left: 20,
        top: 50,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
    },
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: "#59B7ED",
        fontWeight: "700",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#4D4D4D",
        lineHeight: 20,
        marginBottom: 24,
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
    buttonWrapper: {
        borderRadius: 25,
        overflow: "hidden",
        marginTop: 8,
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
    testBox: {
        backgroundColor: "#EAF5FB",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D4EBF7",
    },
    testTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2F2F2F",
        marginBottom: 6,
    },
    testText: {
        fontSize: 13,
        color: "#4D4D4D",
    },
});