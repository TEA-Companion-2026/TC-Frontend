import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSend = () => {
        if (!email) {
            Alert.alert("Erro", "Digite seu email");
            return;
        }

        Alert.alert("Sucesso", "Link de recuperação enviado!");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#59B7ED" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Alterar Senha</Text>
            </View>

            {/* CONTENT */}
            <View style={styles.container}>
                <Text style={styles.label}>Nova Senha</Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="*************"
                        placeholderTextColor="#B7D5E8"
                        secureTextEntry
                    />
                    <Ionicons name="eye-off-outline" size={22} color="#8C99A5" />
                </View>

                <Text style={styles.label}>Confirmar Senha</Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="*************"
                        placeholderTextColor="#B7D5E8"
                        secureTextEntry
                    />
                    <Ionicons name="eye-off-outline" size={22} color="#8C99A5" />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSend}>
                    <Text style={styles.buttonText}>Criar Nova Senha</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#59B7ED",
    },
    header: {
        height: 110,
        backgroundColor: "#59B7ED",
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
    label: {
        fontSize: 16,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5FB",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        padding: 12,
    },
    button: {
        backgroundColor: "#59B7ED",
        padding: 15,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});