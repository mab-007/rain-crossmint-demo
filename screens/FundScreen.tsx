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
import { Delete, CheckCircle2, X } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function FundScreen() {
    const { wallet } = useWallet();
    const navigation = useNavigation();
    const [amount, setAmount] = useState("10");
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
            await wallet.stagingFund(num);
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
            {label ? <Text style={styles.numpadText}>{label}</Text> : (Icon && <Icon size={24} color="#000" />)}
        </TouchableOpacity>
    );

    if (status === "loading") {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#05b959" />
                <Text style={styles.statusText}>Adding ${amount} USDXM...</Text>
            </View>
        );
    }

    if (status === "success") {
        return (
            <View style={styles.centered}>
                <CheckCircle2 size={80} color="#05b959" />
                <Text style={styles.statusText}>Successfully added ${amount}!</Text>
                <Text style={styles.subStatusText}>Returning to your account...</Text>
            </View>
        );
    }

    if (status === "error") {
        return (
            <View style={styles.centered}>
                <X size={80} color="#ef4444" />
                <Text style={styles.statusText}>Funding Failed</Text>
                <Text style={styles.subStatusText}>{errorMsg}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => setStatus("idle")}>
                    <Text style={styles.retryBtnText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <X size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Money</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {/* Amount Display */}
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>${amount}</Text>
                    <Text style={styles.currencyLabel}>USDXM</Text>
                </View>

                {/* Suggestions */}
                <View style={styles.suggestions}>
                    {["10", "50", "100"].map((v) => (
                        <TouchableOpacity
                            key={v}
                            style={[styles.suggestionBtn, amount === v && styles.suggestionBtnActive]}
                            onPress={() => setAmount(v)}
                        >
                            <Text style={[styles.suggestionText, amount === v && styles.suggestionTextActive]}>${v}</Text>
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
                <TouchableOpacity style={styles.fundBtn} onPress={handleFund}>
                    <Text style={styles.fundBtnText}>Add money</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
    },
    closeBtn: {
        padding: 4,
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
        backgroundColor: '#fff',
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
