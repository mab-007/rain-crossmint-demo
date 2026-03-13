import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
    Animated,
} from "react-native";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { useNavigation } from "@react-navigation/native";
import { Delete, CheckCircle2, ChevronLeft } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get("window");

export default function FundScreen() {
    const { wallet } = useWallet();
    const navigation = useNavigation();
    const { theme, colors } = useTheme();
    const [amount, setAmount] = useState("10");
    const [selectedWallet, setSelectedWallet] = useState<"USD" | "PHP">("USD");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleNumberPress = (num: string) => {
        if (amount === "0" && num !== ".") {
            setAmount(num);
        } else if (num === "." && amount.includes(".")) {
            return;
        } else {
            setAmount(amount + num);
        }
    };

    const handleDelete = () => {
        if (amount.length <= 1) {
            setAmount("0");
        } else {
            setAmount(amount.slice(0, -1));
        }
    };

    const handleFund = async () => {
        if (!wallet) return;

        const num = parseFloat(amount);
        if (isNaN(num) || num <= 0) return;

        setStatus("loading");
        try {
            if (selectedWallet === "USD") {
                await wallet.stagingFund(num);
            } else {
                // Mocking PHP funding for staging
                // In a real scenario, this might call a different endpoint or use a different token symbol
                console.log(`Mocking PHP funding: ${num} PHP`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            setStatus("success");
            // Auto-navigate back after 2 seconds
            setTimeout(() => {
                navigation.goBack();
            }, 2000);
        } catch (err: any) {
            setErrorMsg(err?.message ?? "Failed to fund wallet");
            setStatus("error");
        }
    };

    const NumpadButton = ({ value, label, icon: Icon }: { value?: string, label?: string, icon?: any }) => (
        <TouchableOpacity
            style={styles.numpadButton}
            onPress={() => value ? handleNumberPress(value) : (Icon ? handleDelete() : null)}
        >
            {label ? <Text style={[styles.numpadText, { color: colors.text }]}>{label}</Text> : (Icon && <Icon size={24} color={colors.text} />)}
        </TouchableOpacity>
    );

    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const loadingMessages = [
        "Securing your transaction...",
        "Minting your stablecoins...",
        "Finalizing on-chain...",
        "Almost there...",
        "Verifying with Crossmint...",
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === "loading") {
            interval = setInterval(() => {
                setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [status]);

    if (status === "loading") {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <View style={{ transform: [{ scale: 1.5 }], marginBottom: 40 }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <Text style={[styles.statusText, { color: colors.text }]}>Adding ${amount}...</Text>
                <Text style={[styles.subStatusText, { color: colors.subtext, marginTop: 12 }]}>
                    {loadingMessages[loadingMessageIndex]}
                </Text>
            </View>
        );
    }

    if (status === "success") {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <CheckCircle2 size={80} color={colors.primary} />
                <Text style={[styles.statusText, { color: colors.text }]}>Successfully added ${amount}!</Text>
                <Text style={[styles.subStatusText, { color: colors.subtext }]}>Returning to your account...</Text>
            </View>
        );
    }

    if (status === "error") {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <X size={80} color={colors.danger} />
                <Text style={[styles.statusText, { color: colors.text }]}>Funding Failed</Text>
                <Text style={[styles.subStatusText, { color: colors.subtext }]}>{errorMsg}</Text>
                <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.text }]} onPress={() => setStatus("idle")}>
                    <Text style={[styles.retryBtnText, { color: colors.card }]}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.closeBtn, { backgroundColor: colors.card }]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Invest now</Text>
            </View>

            <View style={styles.content}>
                {/* Wallet Selector */}
                <View style={styles.walletSelector}>
                    <TouchableOpacity
                        style={[
                            styles.walletOption,
                            { backgroundColor: colors.card, borderColor: colors.border },
                            selectedWallet === "USD" && { backgroundColor: colors.primary + '15', borderColor: colors.primary }
                        ]}
                        onPress={() => setSelectedWallet("USD")}
                    >
                        <Text style={[styles.walletOptionText, { color: colors.text }, selectedWallet === "USD" && { color: colors.primary }]}>USD Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.walletOption,
                            { backgroundColor: colors.card, borderColor: colors.border },
                            selectedWallet === "PHP" && { backgroundColor: colors.primary + '15', borderColor: colors.primary }
                        ]}
                        onPress={() => setSelectedWallet("PHP")}
                    >
                        <Text style={[styles.walletOptionText, { color: colors.text }, selectedWallet === "PHP" && { color: colors.primary }]}>PHP Wallet</Text>
                    </TouchableOpacity>
                </View>

                {/* Amount Display */}
                <View style={styles.amountContainer}>
                    <Text style={[styles.amountText, { color: colors.text }]}>
                        {selectedWallet === "USD" ? "$" : "₱"}{amount}
                    </Text>
                </View>

                {/* Suggestions */}
                <View style={styles.suggestions}>
                    {["10", "50", "100"].map((v) => (
                        <TouchableOpacity
                            key={v}
                            style={[
                                styles.suggestionBtn,
                                { backgroundColor: colors.card, borderColor: colors.border },
                                amount === v && [styles.suggestionBtnActive, { backgroundColor: colors.primary, borderColor: colors.primary }]
                            ]}
                            onPress={() => setAmount(v)}
                        >
                            <Text style={[
                                styles.suggestionText,
                                { color: colors.text },
                                amount === v && [styles.suggestionTextActive, { color: colors.card }]
                            ]}>{selectedWallet === "USD" ? "$" : "₱"}{v}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Numpad */}
                <View style={styles.numpad}>
                    <View style={styles.numpadRow}>
                        <NumpadButton value="1" label="1" />
                        <NumpadButton value="2" label="2" />
                        <NumpadButton value="3" label="3" />
                    </View>
                    <View style={styles.numpadRow}>
                        <NumpadButton value="4" label="4" />
                        <NumpadButton value="5" label="5" />
                        <NumpadButton value="6" label="6" />
                    </View>
                    <View style={styles.numpadRow}>
                        <NumpadButton value="7" label="7" />
                        <NumpadButton value="8" label="8" />
                        <NumpadButton value="9" label="9" />
                    </View>
                    <View style={styles.numpadRow}>
                        <NumpadButton value="." label="." />
                        <NumpadButton value="0" label="0" />
                        <NumpadButton icon={Delete} />
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity style={[styles.fundBtn, { backgroundColor: colors.primary }]} onPress={handleFund}>
                    <Text style={[styles.fundBtnText, { color: colors.card }]}>Add money</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    walletSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 10,
    },
    walletOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    walletOptionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingBottom: 100 },

    amountContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    amountText: {
        fontSize: 72,
        fontWeight: '700',
        color: '#000',
    },
    currencyLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: -8,
    },

    suggestions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 20,
    },
    suggestionBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f6f6f6',
        borderWidth: 1,
        borderColor: '#eee',
    },
    suggestionBtnActive: {
        backgroundColor: '#05b959',
        borderColor: '#05b959',
    },
    suggestionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    suggestionTextActive: {
        color: '#fff',
    },

    numpad: {
        marginTop: 20,
    },
    numpadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    numpadButton: {
        width: 80,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numpadText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#000',
    },

    fundBtn: {
        backgroundColor: '#05b959',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    fundBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    statusText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginTop: 24,
        textAlign: 'center',
    },
    subStatusText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    retryBtn: {
        marginTop: 32,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#000',
    },
    retryBtnText: {
        color: '#fff',
        fontWeight: '700',
    },
});
