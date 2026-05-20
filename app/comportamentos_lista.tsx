import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    StatusBar,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { comportamentoService, ComportamentoDTO } from "../services/comportamentoService";
import { tokenStorage } from "../services/tokenStorage";

export default function ComportamentoListaScreen() {
    const [records, setRecords] = useState<ComportamentoDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadRecords();
        }, [])
    );

    async function loadRecords() {
        setLoading(true);
        try {
            const token = await tokenStorage.getToken();
            if (token) {
                const data = await comportamentoService.listarTodos(token);
                const sortedData = data.sort((a: any, b: any) => 
                    new Date(b.data).getTime() - new Date(a.data).getTime()
                );
                setRecords(sortedData);
            } else {
                router.replace("/");
            }
        } catch (error) {
            console.error("Erro ao carregar registros:", error);
            Alert.alert("Erro", "Não foi possível carregar os comportamentos.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        Alert.alert(
            "Excluir Registro",
            "Tem certeza que deseja remover este comportamento?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await tokenStorage.getToken();
                            if (token) {
                                await comportamentoService.deletar(id, token);
                                loadRecords();
                            }
                        } catch (error) {
                            Alert.alert("Erro", "Falha ao excluir o registro.");
                        }
                    }
                }
            ]
        );
    }

    // Função para pegar apenas o nome principal do tipo (antes do ":")
    function getShortLabel(fullLabel: string) {
        if (!fullLabel) return "Registro";
        return fullLabel.split(":")[0].split("(")[0].trim();
    }

    const renderItem = ({ item }: { item: ComportamentoDTO }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>
                        {getShortLabel(item.tipoComportamento || "")}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => item.idComportamento && handleDelete(item.idComportamento as number)}>
                    <Feather name="trash-2" size={18} color="#E74C3C" />
                </TouchableOpacity>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={14} color="#8AA8B7" />
                    <Text style={styles.infoText}>
                        {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : "Sem data"}
                    </Text>
                    <Ionicons name="time-outline" size={14} color="#8AA8B7" style={{ marginLeft: 10 }} />
                    <Text style={styles.infoText}>
                        {item.data ? new Date(item.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                    </Text>
                </View>

                {item.observacao ? (
                    <Text style={styles.observationText} numberOfLines={3}>
                        {item.observacao}
                    </Text>
                ) : (
                    <Text style={[styles.observationText, { fontStyle: 'italic', color: '#B7D5E8' }]}>
                        Nenhuma observação registrada.
                    </Text>
                )}
            </View>
        </View>
    );

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

                <Text style={styles.headerTitle}>Lista de Comportamentos</Text>
                
                <TouchableOpacity style={styles.addButton} onPress={() => router.push("/comportamento_registro")}>
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </LinearGradient>

            <View style={styles.container}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#2FAFE6" />
                    </View>
                ) : records.length === 0 ? (
                    <View style={styles.center}>
                        <MaterialCommunityIcons name="clipboard-text-outline" size={64} color="#D9EAF4" />
                        <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
                        <TouchableOpacity 
                            style={styles.emptyButton}
                            onPress={() => router.push("/comportamento_registro")}
                        >
                            <Text style={styles.emptyButtonText}>Registrar Primeiro</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={records}
                        keyExtractor={(item) => item.idComportamento?.toString() || Math.random().toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingTop: 30,
    },
    backButton: {
        width: 40,
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        flex: 1,
        textAlign: "center",
    },
    addButton: {
        width: 40,
        alignItems: "flex-end",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    listContent: {
        padding: 18,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#E5EEF4",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    typeBadge: {
        backgroundColor: "#EAF5FB",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#2FAFE6",
    },
    typeText: {
        color: "#2FAFE6",
        fontSize: 12,
        fontWeight: "700",
    },
    cardBody: {
        gap: 8,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoText: {
        fontSize: 13,
        color: "#8AA8B7",
        marginLeft: 4,
        fontWeight: "500",
    },
    observationText: {
        fontSize: 14,
        color: "#4D4D4D",
        lineHeight: 20,
        marginTop: 4,
    },
    emptyText: {
        color: "#8AA8B7",
        fontSize: 16,
        marginTop: 16,
        textAlign: "center",
    },
    emptyButton: {
        marginTop: 24,
        backgroundColor: "#2FAFE6",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    emptyButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },
});
