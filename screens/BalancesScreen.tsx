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
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react-native";
import * as Clipboard from 'expo-clipboard';
import { useTheme } from "../context/ThemeContext";

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
    const navigation = useNavigation<any>();
    const { theme, colors } = useTheme();
    const [balances, setBalances] = useState<Balances | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

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

    const handleCopy = async (value: string, field: string) => {
        await Clipboard.setStringAsync(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const allTokens = [
        balances?.nativeToken && { ...balances.nativeToken, label: "Ethereum", sublabel: "ETH" },
        balances?.usdc && { ...balances.usdc, label: "USD Coin", sublabel: "USDC" },
        ...(balances?.tokens?.map((t) => ({ ...t, label: t.symbol, sublabel: t.symbol })) ?? []),
    ].filter(Boolean) as (TokenBalance & { label: string; sublabel: string })[];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Balances</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Account Details */}
                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>ACCOUNT DETAILS</Text>
                <View style={[styles.accountCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                    <View style={styles.accountRow}>
                        <View>
                            <Text style={[styles.accountFieldLabel, { color: colors.subtext }]}>Account number</Text>
                            <Text style={[styles.accountFieldValue, { color: colors.text }]}>••5430</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleCopy("••5430", "acct")} style={styles.copyBtn}>
                            <Copy size={16} color={copiedField === "acct" ? colors.primary : colors.subtext} />
                            <Text style={[styles.copyText, { color: colors.subtext }, copiedField === "acct" && { color: colors.primary }]}>
                                {copiedField === "acct" ? "Copied!" : "Copy"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.accountDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.accountRow}>
                        <View>
                            <Text style={[styles.accountFieldLabel, { color: colors.subtext }]}>Routing number</Text>
                            <Text style={[styles.accountFieldValue, { color: colors.text }]}>••329</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleCopy("••329", "routing")} style={styles.copyBtn}>
                            <Copy size={16} color={copiedField === "routing" ? colors.primary : colors.subtext} />
                            <Text style={[styles.copyText, { color: colors.subtext }, copiedField === "routing" && { color: colors.primary }]}>
                                {copiedField === "routing" ? "Copied!" : "Copy"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tokens */}
                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>ASSETS</Text>
                {allTokens.length === 0 ? (
                    <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
                        <Text style={styles.emptyIcon}>💸</Text>
                        <Text style={[styles.emptyText, { color: colors.text }]}>No balances found</Text>
                        <Text style={[styles.emptySubText, { color: colors.subtext }]}>Fund your wallet to get started</Text>
                    </View>
                ) : (
                    allTokens.map((token, idx) => (
                        <View key={idx} style={[styles.tokenCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                            <View style={[styles.tokenIconCircle, { backgroundColor: colors.iconBg }]}>
                                <Text style={[styles.tokenIcon, { color: colors.primary }]}>
                                    {token.symbol?.includes("ETH") ? "Ξ" : token.symbol?.includes("USD") ? "$" : "●"}
                                </Text>
                            </View>
                            <View style={styles.tokenInfo}>
                                <Text style={[styles.tokenLabel, { color: colors.text }]}>{token.label}</Text>
                                <Text style={[styles.tokenSymbol, { color: colors.subtext }]}>{token.sublabel} · Base Sepolia</Text>
                            </View>
                            <View style={styles.tokenAmountCont}>
                                <Text style={[styles.tokenAmount, { color: colors.text }]}>{token.amount ?? "0"}</Text>
                                <Text style={[styles.tokenSymbolSmall, { color: colors.subtext }]}>{token.symbol}</Text>
                            </View>
                        </View>
                    ))
                )}

                <Text style={[styles.networkNote, { color: colors.subtext }]}>Chain: Base Sepolia · Pull to refresh</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f6f6f6',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

    scroll: { padding: 20, paddingBottom: 60 },

    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#aaa',
        letterSpacing: 1,
        marginBottom: 10,
        marginTop: 4,
        marginLeft: 4,
    },

    accountCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 20,
        marginBottom: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    accountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    accountDivider: { height: 1, backgroundColor: '#f5f5f5' },
    accountFieldLabel: { fontSize: 12, color: '#aaa', fontWeight: '600', marginBottom: 4 },
    accountFieldValue: { fontSize: 18, fontWeight: '700', color: '#000' },
    copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    copyText: { fontSize: 13, color: '#999', fontWeight: '600' },

    tokenCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 16,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    tokenIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#f0fdf4",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    tokenIcon: { fontSize: 22, color: "#05b959", fontWeight: '700' },
    tokenInfo: { flex: 1 },
    tokenLabel: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
    tokenSymbol: { fontSize: 12, color: "#aaa", marginTop: 3 },
    tokenAmountCont: { alignItems: "flex-end" },
    tokenAmount: { fontSize: 18, fontWeight: "700", color: "#000" },
    tokenSymbolSmall: { fontSize: 12, color: "#aaa", marginTop: 2 },

    emptyCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 44,
        alignItems: "center",
        marginBottom: 16,
    },
    emptyIcon: { fontSize: 44, marginBottom: 12 },
    emptyText: { fontSize: 17, fontWeight: "700", color: "#333" },
    emptySubText: { fontSize: 14, color: "#aaa", marginTop: 6 },

    networkNote: {
        textAlign: 'center',
        color: '#ccc',
        fontSize: 12,
        marginTop: 16,
    }
});
