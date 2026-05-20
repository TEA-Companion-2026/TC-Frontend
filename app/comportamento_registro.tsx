import React, { useCallback, useEffect, useMemo, useState } from "react";
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
    ActivityIndicator,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { comportamentoService } from "../services/comportamentoService";
import { tokenStorage } from "../services/tokenStorage";

export default function ComportamentoRegistroScreen() {
    const [tipo, setTipo] = useState<string | null>(null);
    const [tiposDisponiveis, setTiposDisponiveis] = useState<string[]>([]);
    const [observacao, setObservacao] = useState("");
    const [data, setData] = useState(new Date().toLocaleDateString('pt-BR'));
    const [hora, setHora] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    const [loading, setLoading] = useState(false);
    const [loadingTypes, setLoadingTypes] = useState(true);

    useEffect(() => {
        loadBehaviorTypes();
    }, []);

    async function loadBehaviorTypes() {
        try {
            const token = await tokenStorage.getToken();
            if (token) {
                const types = await comportamentoService.listarTipos(token);
                // A API retorna um array de objetos com chaves dinâmicas ou strings
                // Baseado no api-docs: "items":{"type":"object","additionalProperties":{"type":"string"}}
                // Mas o enum no DTO sugere strings fixas. Vamos tratar como array de strings se possível.
                // Se a API retornar objetos, extraímos os valores.
                const formattedTypes = Array.isArray(types) 
                    ? types.map(t => typeof t === 'string' ? t : Object.values(t)[0] as string)
                    : [];
                setTiposDisponiveis(formattedTypes);
            }
        } catch (error) {
            console.error("Erro ao carregar tipos:", error);
        } finally {
            setLoadingTypes(false);
        }
    }

    function onlyDigits(value: string) {
        return value.replace(/\D/g, "");
    }

    function formatDate(value: string) {
        const digits = onlyDigits(value).slice(0, 8);
        if (digits.length <= 2) return digits;
        if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }

    function formatTime(value: string) {
        const digits = onlyDigits(value).slice(0, 4);
        if (digits.length <= 2) return digits;
        return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    }

    const isFormValid = useMemo(() => {
        return tipo !== null && data.length === 10 && hora.length === 5;
    }, [tipo, data, hora]);

    async function handleSave() {
        if (!isFormValid) {
            Alert.alert("Aviso", "Preencha todos os campos obrigatórios (Tipo, Data e Hora).");
            return;
        }

        setLoading(true);
        try {
            const token = await tokenStorage.getToken();
            if (!token) {
                Alert.alert("Erro de Autenticação", "Sessão expirada. Por favor, faça login novamente.");
                router.replace("/");
                return;
            }

            const [day, month, year] = data.split("/");
            const [hours, minutes] = hora.split(":");
            const dateObj = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
            
            if (isNaN(dateObj.getTime())) {
                throw new Error("Data ou hora inválida.");
            }

            const isoDate = dateObj.toISOString();

            await comportamentoService.criar({
                data: isoDate,
                observacao: observacao.trim(),
                tipoComportamento: tipo!,
            }, token);

            if (Platform.OS === 'web') {
                window.alert("O comportamento foi registrado com sucesso!");
                router.replace("/home");
            } else {
                Alert.alert(
                    "Sucesso", 
                    "O comportamento foi registrado com sucesso!",
                    [{ text: "OK", onPress: () => router.replace("/home") }]
                );
            }
        } catch (error: any) {
            console.error("Erro ao salvar:", error);
            Alert.alert(
                "Falha no Registro", 
                error.message || "Ocorreu um erro ao tentar salvar."
            );
        } finally {
            setLoading(false);
        }
    }

    // Função para simplificar o nome do tipo para o botão (ex: pega apenas o termo antes do ":")
    function getShortLabel(fullLabel: string) {
        return fullLabel.split(":")[0].split("(")[0].trim();
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

                <Text style={styles.headerTitle}>Novo Comportamento</Text>
            </LinearGradient>

            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.formArea}>
                        
                        <Text style={styles.label}>Tipo de Comportamento</Text>
                        {loadingTypes ? (
                            <ActivityIndicator color="#2FAFE6" style={{ marginBottom: 20 }} />
                        ) : (
                            <View style={styles.typesGrid}>
                                {tiposDisponiveis.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.typeButton,
                                            tipo === item && styles.typeButtonActive
                                        ]}
                                        onPress={() => setTipo(item)}
                                    >
                                        <Text style={[
                                            styles.typeButtonText,
                                            tipo === item && styles.typeButtonTextActive
                                        ]}>
                                            {getShortLabel(item)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {tipo && (
                            <View style={styles.descriptionBox}>
                                <Text style={styles.descriptionText}>{tipo}</Text>
                            </View>
                        )}

                        <View style={styles.row}>
                            <View style={[styles.fieldBlock, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Data</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="DD/MM/AAAA"
                                    placeholderTextColor="#B7D5E8"
                                    keyboardType="number-pad"
                                    value={data}
                                    onChangeText={(val) => setData(formatDate(val))}
                                    maxLength={10}
                                />
                            </View>

                            <View style={[styles.fieldBlock, { flex: 1 }]}>
                                <Text style={styles.label}>Hora</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="HH:MM"
                                    placeholderTextColor="#B7D5E8"
                                    keyboardType="number-pad"
                                    value={hora}
                                    onChangeText={(val) => setHora(formatTime(val))}
                                    maxLength={5}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>Observações (Opcional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Descreva o que aconteceu..."
                                placeholderTextColor="#B7D5E8"
                                multiline
                                numberOfLines={4}
                                value={observacao}
                                onChangeText={setObservacao}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButtonWrapper, (!isFormValid || loading) && styles.buttonDisabled]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={["#2FAFE6", "#6BC5FF"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveButton}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Salvar Registro</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

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
        fontSize: 20,
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
    label: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C8EF4",
        marginBottom: 10,
    },
    typesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 14,
    },
    typeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#B7D5E8",
        backgroundColor: "#FFFFFF",
    },
    typeButtonActive: {
        backgroundColor: "#2FAFE6",
        borderColor: "#2FAFE6",
    },
    typeButtonText: {
        fontSize: 13,
        color: "#2FAFE6",
        fontWeight: "600",
    },
    typeButtonTextActive: {
        color: "#FFFFFF",
    },
    descriptionBox: {
        backgroundColor: "#F0F8FF",
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#2FAFE6",
        marginBottom: 20,
    },
    descriptionText: {
        fontSize: 13,
        color: "#4D4D4D",
        lineHeight: 18,
    },
    row: {
        flexDirection: "row",
        marginBottom: 14,
    },
    fieldBlock: {
        marginBottom: 14,
    },
    input: {
        width: "100%",
        height: 46,
        backgroundColor: "#EAF5FB",
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 16,
        color: "#2F2F2F",
        borderWidth: 1,
        borderColor: "#D9EAF4",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
        paddingTop: 12,
    },
    saveButtonWrapper: {
        marginTop: 20,
        alignSelf: "center",
        width: "100%",
        borderRadius: 24,
        overflow: "hidden",
    },
    saveButton: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
});
