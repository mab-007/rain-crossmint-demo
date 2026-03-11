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
} from "react-native";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { Delete, X } from "lucide-react-native";

export default function TransferScreen() {
    const { wallet } = useWallet();
    const [amount, setAmount] = useState("0");
    const [recipient, setRecipient] = useState("");
    const [loading, setLoading] = useState(false);
    const [showRecipient, setShowRecipient] = useState(false);

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
        if (!showRecipient) {
            setShowRecipient(true);
            return;
        }

        if (!wallet) {
            Alert.alert("Error", "Wallet not loaded yet.");
            return;
        }
        if (!recipient.trim().startsWith("0x")) {
            Alert.alert("Invalid Address", "Please enter a valid 0x Ethereum address.");
            return;
        }
        if (parseFloat(amount) <= 0) {
            Alert.alert("Invalid Amount", "Please enter an amount greater than 0.");
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
            setShowRecipient(false);
        } catch (err: any) {
            Alert.alert("Transfer Failed", err?.message ?? "An error occurred.");
        } finally {
            setLoading(false);
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Amount Display */}
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>${amount}</Text>
                </View>

                {/* Recipient Input (Overlay/Conditional) */}
                {showRecipient && (
                    <View style={styles.recipientContainer}>
                        <View style={styles.recipientHeader}>
                            <Text style={styles.recipientTitle}>To:</Text>
                            <TouchableOpacity onPress={() => setShowRecipient(false)}>
                                <X size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.recipientInput}
                            placeholder="0x... or email"
                            placeholderTextColor="#666"
                            value={recipient}
                            onChangeText={setRecipient}
                            autoFocus
                            autoCapitalize="none"
                        />
                    </View>
                )}

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

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.payButton, loading && styles.disabled]}
                        onPress={handlePay}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.payButtonText}>{showRecipient ? "Confirm Pay" : "Pay"}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#05b959" },
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingVertical: 40, paddingBottom: 100 },

    amountContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    amountText: {
        fontSize: 80,
        fontWeight: '700',
        color: '#000',
    },

    recipientContainer: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
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
        color: '#000',
    },
    recipientInput: {
        fontSize: 18,
        color: '#000',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    numpad: {
        marginTop: 20,
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
    numpadText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#000',
    },

    actions: {
        marginBottom: 20,
    },
    payButton: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    disabled: {
        opacity: 0.7,
    },
});
