import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    Linking,
    TextInput,
    Image as RNImage
} from "react-native";
import { useWallet, useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import { useNavigation } from "@react-navigation/native";
import { Delete, X, Pencil } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function TransferScreen() {
    const { wallet } = useWallet();
    const { user } = useCrossmintAuth();
    const navigation = useNavigation<any>();
    const { theme, colors } = useTheme();
    const [amount, setAmount] = useState("0");
    const [recipient, setRecipient] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"amount" | "recipient" | "confirm">("amount");

    const truncateAddress = (addr: string) => {
        if (!addr) return "";
        if (addr.includes("@")) return addr;
        if (addr.startsWith("0x") && addr.length > 12) {
            return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
        }
        return addr;
    };

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
        if (amount.length === 1) {
            setAmount("0");
        } else {
            setAmount(amount.slice(0, -1));
        }
    };

    const handlePay = async () => {
        if (step === "amount") {
            if (parseFloat(amount) <= 0) {
                Alert.alert("Invalid Amount", "Please enter an amount greater than 0.");
                return;
            }
            setStep("recipient");
            return;
        }

        if (step === "recipient") {
            if (!recipient.trim()) {
                Alert.alert("Error", "Please enter a recipient.");
                return;
            }
            setStep("confirm");
            return;
        }

        if (!wallet) {
            Alert.alert("Error", "Wallet not loaded yet.");
            return;
        }

        setLoading(true);
        try {
            const result = await wallet.send(recipient.trim(), "usdxm", amount);
            Alert.alert("Success", "Transfer sent successfully!", [
                { text: "View on Explorer", onPress: () => result.explorerLink && Linking.openURL(result.explorerLink) },
                { text: "OK" }
            ]);
            setAmount("0");
            setRecipient("");
            setStep("amount");
        } catch (err: any) {
            Alert.alert("Transfer Failed", err?.message ?? "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePress = () => {
        navigation.navigate("Profile");
    };

    const NumpadButton = ({ value, label, icon: Icon }: { value?: string, label?: string, icon?: any }) => (
        <TouchableOpacity
            style={styles.numpadButton}
            onPress={() => value ? handleNumberPress(value) : (Icon ? handleDelete() : null)}
        >
            <View style={styles.numpadButtonInner}>
                {label ? <Text style={styles.numpadText}>{label}</Text> : (Icon && <Icon size={22} color="#000000" />)}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Transfer</Text>
                        <TouchableOpacity onPress={handleProfilePress} style={styles.profileBtn}>
                            <RNImage source={require('../assets/icon.png')} style={styles.avatarImage} />
                        </TouchableOpacity>
                    </View>

                    {/* Amount Display */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountText}>${amount}</Text>

                        {step === "amount" && (
                            <View style={styles.suggestionRow}>
                                {['1', '10', '100'].map((val) => (
                                    <TouchableOpacity
                                        key={val}
                                        style={[styles.suggestionBadge, { backgroundColor: 'rgba(0,0,0,0.05)' }]}
                                        onPress={() => setAmount(val)}
                                    >
                                        <Text style={styles.suggestionText}>${val}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {step === "confirm" && (
                            <View style={styles.confirmInfo}>
                                <View style={styles.confirmRecipientRow}>
                                    <Text style={styles.confirmTo}>To: {truncateAddress(recipient)}</Text>
                                    <TouchableOpacity
                                        onPress={() => setStep("recipient")}
                                        style={styles.editIconBtn}
                                    >
                                        <Pencil size={16} color="#000000" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Recipient Input (Step 2) */}
                    {step === "recipient" && (
                        <View style={styles.recipientStepContainer}>
                            <View style={styles.recipientInputRow}>
                                <Text style={styles.recipientLabel}>To:</Text>
                                <TextInput
                                    style={[styles.recipientInputMinimal, { color: colors.text }]}
                                    placeholder="0x... or email"
                                    placeholderTextColor="rgba(0,0,0,0.3)"
                                    value={recipient}
                                    onChangeText={setRecipient}
                                    autoFocus
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setStep("amount")} style={styles.closeBtn}>
                                    <X size={20} color="#000000" />
                                </TouchableOpacity>
                            </View>

                            {/* Dummy Suggestions */}
                            <View style={styles.suggestionsContainer}>
                                <Text style={styles.suggestionsTitle}>Suggestions</Text>
                                {['Alice (0x1234...abcd)', 'Bob (bob@example.com)', 'Charlie (0x9876...fedc)'].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.suggestionItem}
                                        onPress={() => {
                                            const val = item.includes('(') ? item.split('(')[1].replace(')', '') : item;
                                            setRecipient(val);
                                            setStep("confirm");
                                        }}
                                    >
                                        <View style={styles.suggestionAvatar}>
                                            <Text style={styles.avatarText}>{item[0]}</Text>
                                        </View>
                                        <Text style={styles.suggestionItemText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Numpad (Only in Amount step) */}
                    {step === "amount" && (
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
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.payButton, loading && styles.disabled]}
                            onPress={handlePay}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text style={styles.payButtonText}>
                                    {step === "amount" ? "Pay" : step === "recipient" ? "Continue" : "Confirm Pay"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'flex-start',
        paddingBottom: 40
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000000',
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    amountContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    amountText: {
        fontSize: 80,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 16,
    },
    suggestionRow: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
        paddingHorizontal: 20,
    },
    suggestionBadge: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    suggestionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },

    recipientStepContainer: {
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 4,
    },
    recipientInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingVertical: 12,
    },
    recipientLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginRight: 12,
    },
    recipientInputMinimal: {
        flex: 1,
        fontSize: 20,
        color: '#000000',
        padding: 0,
    },
    closeBtn: {
        padding: 4,
    },
    suggestionsContainer: {
        marginTop: 32,
    },
    suggestionsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        opacity: 0.4,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    suggestionAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    suggestionItemText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '500',
    },
    confirmInfo: {
        alignItems: 'center',
        marginTop: 10,
    },
    confirmRecipientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmTo: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        opacity: 0.7,
    },
    editIconBtn: {
        marginLeft: 8,
        padding: 4,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
    },
    editLink: {
        fontSize: 14,
        color: '#000000',
        marginTop: 8,
        textDecorationLine: 'underline',
        opacity: 0.5,
    },
    recipientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    recipientTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    recipientInput: {
        fontSize: 18,
        color: '#000000',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    numpad: {
        flex: 1,
        justifyContent: 'center',
    },
    numpadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    numpadButton: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numpadButtonInner: {
        width: 68,
        height: 52,
        borderRadius: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numpadText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
    },

    actions: {
        marginTop: 'auto',
        marginBottom: 20,
    },
    payButton: {
        backgroundColor: '#000000',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
    },
    disabled: {
        opacity: 0.7,
    },
});
