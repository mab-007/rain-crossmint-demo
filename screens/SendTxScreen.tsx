import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
    Linking,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";

type TxResult = {
    hash?: string;
    explorerLink?: string;
};

export default function SendTxScreen() {
    const { wallet } = useWallet();
    const { theme, colors } = useTheme();
    const [to, setTo] = useState("");
    const [value, setValue] = useState("");
    const [data, setData] = useState("");
    const [loading, setLoading] = useState(false);
    const [txResult, setTxResult] = useState<TxResult | null>(null);

    const handleSend = async () => {
        if (!wallet) {
            Alert.alert("Error", "Wallet not loaded.");
            return;
        }
        if (!to.trim().startsWith("0x")) {
            Alert.alert("Invalid Address", "Please enter a valid 0x Ethereum address.");
            return;
        }

        setLoading(true);
        setTxResult(null);
        try {
            // EVMWallet.sendTransaction() — raw EVM transaction
            const evmWallet = wallet as any;
            if (typeof evmWallet.sendTransaction !== "function") {
                // Fallback to wallet.send() with native ETH
                const result = await wallet.send(
                    to.trim(),
                    "eth",
                    value.trim() || "0"
                );
                setTxResult({ hash: result.hash, explorerLink: result.explorerLink });
            } else {
                const result = await evmWallet.sendTransaction({
                    to: to.trim(),
                    value: value.trim() ? value.trim() : "0",
                    ...(data.trim() ? { data: data.trim() } : {}),
                });
                setTxResult({ hash: result.hash, explorerLink: result.explorerLink });
            }
        } catch (err: any) {
            Alert.alert(
                "Transaction Failed",
                err?.message ?? "An unexpected error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* Info Banner */}
                <View style={[styles.banner, { backgroundColor: theme === "dark" ? "rgba(30, 64, 175, 0.1)" : "#eff6ff", borderColor: theme === "dark" ? "#1e40af" : "#bfdbfe" }]}>
                    <Text style={styles.bannerIcon}>⚡</Text>
                    <Text style={[styles.bannerText, { color: theme === "dark" ? "#60a5fa" : "#1e40af" }]}>
                        Send a raw EVM transaction. Value is in ETH. Data field is optional (hex calldata).
                    </Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Send Transaction</Text>
                    <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>Base Sepolia · Raw EVM Transaction</Text>

                    {/* To Address */}
                    <Text style={[styles.label, { color: colors.subtext }]}>To Address *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                        placeholder="0x..."
                        placeholderTextColor={colors.subtext}
                        value={to}
                        onChangeText={setTo}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                    />

                    {/* Value */}
                    <Text style={[styles.label, { color: colors.subtext }]}>Value (ETH)</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                        placeholder="0.0"
                        placeholderTextColor={colors.subtext}
                        value={value}
                        onChangeText={setValue}
                        keyboardType="decimal-pad"
                        editable={!loading}
                    />

                    {/* Calldata (optional) */}
                    <Text style={[styles.label, { color: colors.subtext }]}>Data (optional hex calldata)</Text>
                    <TextInput
                        style={[styles.input, styles.dataInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                        placeholder="0x..."
                        placeholderTextColor={colors.subtext}
                        value={data}
                        onChangeText={setData}
                        autoCapitalize="none"
                        autoCorrect={false}
                        multiline
                        numberOfLines={3}
                        editable={!loading}
                    />

                    {/* Summary */}
                    {(to || value) ? (
                        <View style={[styles.summaryBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <Text style={[styles.summaryTitle, { color: colors.subtext }]}>Transaction Summary</Text>
                            {to ? (
                                <View style={styles.summaryRow}>
                                    <Text style={[styles.summaryLabel, { color: colors.subtext }]}>To:</Text>
                                    <Text style={[styles.summaryValue, { color: colors.text }]} numberOfLines={1}>
                                        {to}
                                    </Text>
                                </View>
                            ) : null}
                            <View style={styles.summaryRow}>
                                <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Value:</Text>
                                <Text style={[styles.summaryValue, { color: colors.text }]}>{value || "0"} ETH</Text>
                            </View>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: colors.primary }, loading && styles.btnDisabled]}
                        onPress={handleSend}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.card} />
                        ) : (
                            <Text style={[styles.btnText, { color: colors.card }]}>⚡ Send Transaction</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {txResult && (
                    <View style={[styles.successCard, { backgroundColor: theme === "dark" ? "rgba(21, 128, 61, 0.1)" : "#f0fdf4", borderColor: theme === "dark" ? colors.primary : "#86efac" }]}>
                        <Text style={[styles.successTitle, { color: colors.primary }]}>✅ Transaction Sent!</Text>

                        {txResult.hash && (
                            <>
                                <Text style={[styles.hashLabel, { color: colors.subtext }]}>Transaction Hash</Text>
                                <Text style={[styles.hashValue, { color: colors.text }]} selectable>
                                    {txResult.hash}
                                </Text>
                            </>
                        )}

                        {txResult.explorerLink && (
                            <TouchableOpacity
                                style={[styles.explorerBtn, { backgroundColor: colors.primary }]}
                                onPress={() => Linking.openURL(txResult.explorerLink!)}
                            >
                                <Text style={[styles.explorerBtnText, { color: colors.card }]}>🔍 View on Block Explorer</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 20, paddingBottom: 40 },

    banner: {
        backgroundColor: "#eff6ff",
        borderRadius: 12,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#bfdbfe",
    },
    bannerIcon: { fontSize: 20, marginRight: 10 },
    bannerText: { flex: 1, fontSize: 12, color: "#1e40af", lineHeight: 18 },

    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: { fontSize: 20, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
    cardSubtitle: { fontSize: 13, color: "#888", marginBottom: 20 },

    label: { fontSize: 13, color: "#555", fontWeight: "600", marginBottom: 8 },
    input: {
        borderWidth: 1.5,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        color: "#1a1a1a",
        backgroundColor: "#fafafa",
        marginBottom: 16,
        fontFamily: "monospace",
    },
    dataInput: {
        minHeight: 80,
        textAlignVertical: "top",
    },

    summaryBox: {
        backgroundColor: "#f8fafc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    summaryTitle: { fontSize: 12, fontWeight: "700", color: "#64748b", marginBottom: 8 },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    summaryLabel: { fontSize: 13, color: "#64748b" },
    summaryValue: { fontSize: 13, color: "#1a1a1a", fontWeight: "600", flex: 1, textAlign: "right" },

    btn: {
        backgroundColor: "#05b959",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    btnDisabled: { opacity: 0.7 },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

    successCard: {
        backgroundColor: "#f0fdf4",
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        borderWidth: 1.5,
        borderColor: "#86efac",
    },
    successTitle: { fontSize: 18, fontWeight: "700", color: "#15803d", marginBottom: 12 },
    hashLabel: { fontSize: 12, color: "#888", marginBottom: 4 },
    hashValue: {
        fontSize: 12,
        color: "#1a1a1a",
        fontFamily: "monospace",
        lineHeight: 18,
        marginBottom: 16,
    },
    explorerBtn: {
        backgroundColor: "#15803d",
        borderRadius: 10,
        padding: 12,
        alignItems: "center",
    },
    explorerBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
