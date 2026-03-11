import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from "react-native";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";

type TokenBalance = {
    amount: string;
    symbol: string;
    contractAddress?: string;
    decimals?: number;
};

type Balances = {
    nativeToken: TokenBalance;
    usdc?: TokenBalance;
    tokens?: TokenBalance[];
};

export default function BalancesScreen() {
    const { wallet } = useWallet();
    const [balances, setBalances] = useState<Balances | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBalances = useCallback(async () => {
        if (!wallet) return;
        try {
            const result = await wallet.balances(["usdc", "usdxm"]);
            setBalances(result as Balances);
        } catch (err) {
            Alert.alert("Error", "Failed to fetch balances. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [wallet]);

    useEffect(() => {
        fetchBalances();
    }, [fetchBalances]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchBalances();
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#05b959" />
                <Text style={styles.loadingText}>Loading balances...</Text>
            </View>
        );
    }

    const allTokens = [
        balances?.nativeToken && { ...balances.nativeToken, label: "Native Token (ETH)" },
        balances?.usdc && { ...balances.usdc, label: "USD Coin (USDC)" },
        ...(balances?.tokens?.map((t) => ({ ...t, label: t.symbol })) ?? []),
    ].filter(Boolean) as (TokenBalance & { label: string })[];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#05b959"
                    />
                }
            >
                <Text style={styles.intro}>
                    Pull to refresh · Chain: Base Sepolia
                </Text>

                <View style={styles.accountCard}>
                    <Text style={styles.accountLabel}>Account Details</Text>
                    <View style={styles.accountRow}>
                        <Text style={styles.accountInfo}>Account ••5430</Text>
                        <Text style={styles.accountInfo}>Routing ••329</Text>
                    </View>
                </View>

                {allTokens.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>💸</Text>
                        <Text style={styles.emptyText}>No balances found</Text>
                        <Text style={styles.emptySubText}>
                            Fund your wallet to get started
                        </Text>
                    </View>
                ) : (
                    allTokens.map((token, idx) => (
                        <View key={idx} style={styles.tokenCard}>
                            <View style={styles.tokenIconCircle}>
                                <Text style={styles.tokenIcon}>
                                    {token.symbol?.includes("ETH")
                                        ? "Ξ"
                                        : token.symbol?.includes("USD")
                                            ? "$"
                                            : "●"}
                                </Text>
                            </View>
                            <View style={styles.tokenInfo}>
                                <Text style={styles.tokenLabel}>{token.label}</Text>
                                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                            </View>
                            <View style={styles.tokenAmountCont}>
                                <Text style={styles.tokenAmount}>{token.amount ?? "0"}</Text>
                            </View>
                        </View>
                    ))
                )}

                <TouchableOpacity style={styles.refreshBtn} onPress={fetchBalances}>
                    <Text style={styles.refreshBtnText}>🔄 Refresh</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f0fdf4" },
    scroll: { padding: 20, paddingBottom: 40 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 12, color: "#666" },

    intro: { fontSize: 12, color: "#888", marginBottom: 16, textAlign: "center" },

    accountCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    accountLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#999",
        textTransform: "uppercase",
        marginBottom: 8,
    },
    accountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    accountInfo: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
    },

    tokenCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    tokenIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#e8faf1",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    tokenIcon: { fontSize: 20, color: "#05b959" },
    tokenInfo: { flex: 1 },
    tokenLabel: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
    tokenSymbol: { fontSize: 12, color: "#888", marginTop: 2 },
    tokenAmountCont: { alignItems: "flex-end" },
    tokenAmount: { fontSize: 18, fontWeight: "700", color: "#05b959" },

    emptyCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 40,
        alignItems: "center",
        marginBottom: 16,
    },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 16, fontWeight: "600", color: "#333" },
    emptySubText: { fontSize: 13, color: "#888", marginTop: 4 },

    refreshBtn: {
        backgroundColor: "#05b959",
        borderRadius: 12,
        padding: 14,
        alignItems: "center",
        marginTop: 8,
    },
    refreshBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
