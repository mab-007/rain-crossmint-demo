import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Linking,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";

type Transaction = {
    id: string;
    status: string;
    createdAt?: string;
    hash?: string;
    explorerLink?: string;
    [key: string]: any;
};

const STATUS_COLORS: Record<string, string> = {
    success: "#15803d",
    confirmed: "#15803d",
    pending: "#d97706",
    failed: "#dc2626",
};

const STATUS_ICONS: Record<string, string> = {
    success: "✅",
    confirmed: "✅",
    pending: "⏳",
    failed: "❌",
};

export default function TransactionsScreen() {
    const { wallet } = useWallet();
    const { theme, colors } = useTheme();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTransactions = useCallback(async () => {
        if (!wallet) return;
        try {
            const result = await (wallet as any).experimental_transactions?.();
            setTransactions(Array.isArray(result) ? result : result?.transactions ?? []);
        } catch (err) {
            Alert.alert("Error", "Failed to fetch transactions.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [wallet]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTransactions();
    };

    const formatDate = (iso?: string) => {
        if (!iso) return "Unknown date";
        return new Date(iso).toLocaleString();
    };

    const truncateHash = (hash?: string) => {
        if (!hash) return "N/A";
        return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.subtext }]}>Loading transactions...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id ?? Math.random().toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={[styles.emptyText, { color: colors.text }]}>No transactions yet</Text>
                        <Text style={[styles.emptySubText, { color: colors.subtext }]}>
                            Transfer tokens or send a transaction to get started
                        </Text>
                    </View>
                }
                ListHeaderComponent={
                    <Text style={[styles.headerText, { color: colors.subtext }]}>
                        {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} found
                        · Pull to refresh
                    </Text>
                }
                renderItem={({ item }) => {
                    const statusKey = item.status?.toLowerCase() ?? "pending";
                    const statusColor = STATUS_COLORS[statusKey] ?? "#666";
                    const statusIcon = STATUS_ICONS[statusKey] ?? "●";

                    return (
                        <TouchableOpacity
                            style={[styles.txCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
                            onPress={() => {
                                if (item.explorerLink) Linking.openURL(item.explorerLink);
                            }}
                            disabled={!item.explorerLink}
                        >
                            <View style={styles.txRow}>
                                <Text style={styles.txIcon}>{statusIcon}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.txId, { color: colors.text }]} numberOfLines={1}>
                                        ID: {item.id}
                                    </Text>
                                    <Text style={[styles.txDate, { color: colors.subtext }]}>{formatDate(item.createdAt)}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                                    <Text style={[styles.txStatus, { color: statusColor }]}>
                                        {item.status ?? "unknown"}
                                    </Text>
                                </View>
                            </View>

                            {item.hash && (
                                <View style={styles.txHashRow}>
                                    <Text style={[styles.txHashLabel, { color: colors.subtext }]}>Hash: </Text>
                                    <Text style={[styles.txHash, { color: colors.text }]}>{truncateHash(item.hash)}</Text>
                                    {item.explorerLink && (
                                        <Text style={[styles.txLink, { color: colors.primary }]}> → View</Text>
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: { padding: 20, paddingBottom: 40 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 12, color: "#666" },

    headerText: {
        fontSize: 12,
        color: "#888",
        marginBottom: 12,
        textAlign: "center",
    },

    txCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    txRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
    },
    txIcon: { fontSize: 20 },
    txId: { fontSize: 13, color: "#1a1a1a", fontWeight: "600" },
    txDate: { fontSize: 11, color: "#999", marginTop: 2 },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    txStatus: { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
    txHashRow: { flexDirection: "row", alignItems: "center" },
    txHashLabel: { fontSize: 11, color: "#888" },
    txHash: { fontSize: 11, color: "#444", fontFamily: "monospace" },
    txLink: { fontSize: 11, color: "#05b959", fontWeight: "600" },

    emptyContainer: {
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyIcon: { fontSize: 56, marginBottom: 12 },
    emptyText: { fontSize: 18, fontWeight: "600", color: "#333" },
    emptySubText: {
        fontSize: 13,
        color: "#888",
        marginTop: 6,
        textAlign: "center",
        paddingHorizontal: 32,
    },
});
