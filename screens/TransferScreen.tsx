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
import { Delete, X } from "lucide-react-native";

export default function TransferScreen() {
    const { wallet } = useWallet();
    const { user } = useCrossmintAuth();
    const navigation = useNavigation<any>();
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

    const handleProfilePress = () => {
        navigation.navigate("Profile");
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

                    {/* Amount Suggestions */}
                    <View style={styles.suggestionRow}>
                        {['1', '10', '100'].map((val) => (
                            <TouchableOpacity
                                key={val}
                                style={styles.suggestionBadge}
                                onPress={() => setAmount(val)}
                            >
                                <Text style={styles.suggestionText}>${val}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
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
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingBottom: 100 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000',
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
        marginTop: 40,
    },
    amountText: {
        fontSize: 80,
        fontWeight: '700',
        color: '#000',
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
