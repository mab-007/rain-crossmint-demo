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
    Image as RNImage,
    ScrollView,
    Dimensions
} from "react-native";
import { useWallet, useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import { useNavigation } from "@react-navigation/native";
import { Delete, X, Pencil, ChevronLeft, Users, User, Briefcase, MoreHorizontal } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

const { height } = Dimensions.get("window");

export default function TransferScreen() {
    const { user } = useCrossmintAuth();
    const initial = user?.email?.[0]?.toUpperCase() ?? "?";
    const { wallet } = useWallet();
    const navigation = useNavigation<any>();
    const { theme, colors } = useTheme();
    const [amount, setAmount] = useState("0");
    const [recipient, setRecipient] = useState("");
    const [selectedWallet, setSelectedWallet] = useState<"USD" | "PHP">("USD");
    const [usdBalance, setUsdBalance] = useState<number>(0);
    const [phpBalance, setPhpBalance] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"amount" | "recipient" | "confirm">("amount");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isCrossCurrency, setIsCrossCurrency] = useState(false);

    const TAGS = [
        { id: 'family', label: 'Family', icon: Users },
        { id: 'friend', label: 'Friend', icon: User },
        { id: 'employee', label: 'Employee', icon: Briefcase },
        { id: 'other', label: 'Other', icon: MoreHorizontal },
    ];

    React.useEffect(() => {
        const fetchBalances = async () => {
            if (!wallet) return;
            try {
                const result = await wallet.balances(["usdc", "usdxm"]);
                // @ts-ignore
                const tokens = result.tokens || [];
                const usdxmToken = tokens.find((t: any) => t.symbol?.toUpperCase() === "USDXM");
                setUsdBalance(usdxmToken ? parseFloat(usdxmToken.amount) : parseFloat(result.usdc?.amount || "0"));
                // PHP is currently independent/mocked as per previous steps
                setPhpBalance(90720.00);
            } catch (err) {
                console.error("Failed to fetch balances in TransferScreen:", err);
            }
        };
        fetchBalances();
    }, [wallet]);

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

    const handleBack = () => {
        if (step === "confirm") {
            setStep("recipient");
        } else if (step === "recipient") {
            setStep("amount");
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
            let tokenSymbol = selectedWallet === "USD" ? "usdxm" : "php";
            if (isCrossCurrency) {
                tokenSymbol = selectedWallet === "USD" ? "php" : "usdxm";
            }
            const result = await wallet.send(recipient.trim(), tokenSymbol, amount);
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
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            {step !== "amount" && (
                                <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                                    <ChevronLeft size={28} color="#000000" />
                                </TouchableOpacity>
                            )}
                            <Text style={styles.headerTitle}>Transfer</Text>
                        </View>
                        <TouchableOpacity onPress={handleProfilePress} style={[styles.profileBtn, { backgroundColor: '#ffffff' }]}>
                            <Text style={[styles.avatarTextSmall, { color: colors.primary }]}>{initial}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Amount Display */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountText}>
                            {selectedWallet === "USD" ? "$" : "₱"}{amount}
                        </Text>

                        {step === "amount" && (
                            <View style={styles.segmentedControl}>
                                <TouchableOpacity
                                    style={[styles.segment, selectedWallet === "USD" && styles.segmentActive]}
                                    onPress={() => setSelectedWallet("USD")}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.segmentText, selectedWallet === "USD" && styles.segmentTextActive]}>USD</Text>
                                    <Text style={[styles.segmentBalance, selectedWallet === "USD" && styles.segmentBalanceActive]}>${usdBalance.toLocaleString()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.segment, selectedWallet === "PHP" && styles.segmentActive]}
                                    onPress={() => setSelectedWallet("PHP")}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.segmentText, selectedWallet === "PHP" && styles.segmentTextActive]}>PHP</Text>
                                    <Text style={[styles.segmentBalance, selectedWallet === "PHP" && styles.segmentBalanceActive]}>₱{phpBalance.toLocaleString()}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {step === "confirm" && (
                            <View style={styles.confirmInfo}>
                                <View style={styles.confirmRecipientRow}>
                                    <Text style={styles.confirmTo}>To: {truncateAddress(recipient)}</Text>
                                    {selectedTag && (
                                        <View style={styles.confirmTag}>
                                            <Text style={styles.confirmTagText}>{selectedTag}</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        onPress={() => setStep("recipient")}
                                        style={styles.editIconBtn}
                                    >
                                        <Pencil size={16} color="#000000" />
                                    </TouchableOpacity>
                                </View>

                                {/* Cross-Currency Toggle */}
                                <TouchableOpacity
                                    style={styles.currencyToggle}
                                    onPress={() => setIsCrossCurrency(!isCrossCurrency)}
                                >
                                    <Text style={styles.currencyToggleText}>
                                        Pay with {selectedWallet === "USD" ? "PHP" : "USD"} Wallet?
                                    </Text>
                                    <View style={[styles.toggleTrack, isCrossCurrency && styles.toggleTrackActive]}>
                                        <View style={[styles.toggleThumb, isCrossCurrency && styles.toggleThumbActive]} />
                                    </View>
                                </TouchableOpacity>

                                {/* Charges Breakdown */}
                                {isCrossCurrency && (
                                    <View style={styles.chargesBreakdown}>
                                        <Text style={styles.payingThroughCopy}>
                                            Paying through {selectedWallet === "USD" ? "PHP" : "USD"} Wallet
                                        </Text>

                                        <View style={styles.chargesTitleRow}>
                                            <Text style={styles.chargesTitle}>Charges Breakup</Text>
                                            <View style={styles.liveRateBadge}>
                                                <View style={styles.liveDot} />
                                                <Text style={styles.liveRateText}>1 USD = 56.20 PHP</Text>
                                            </View>
                                        </View>

                                        <View style={styles.chargeRow}>
                                            <Text style={styles.chargeLabel}>Flat Fee</Text>
                                            <Text style={styles.chargeValue}>$1.00</Text>
                                        </View>
                                        <View style={styles.chargeRow}>
                                            <Text style={styles.chargeLabel}>FX Markup</Text>
                                            <View style={styles.fxMarkupContainer}>
                                                <Text style={styles.fxMarkupOld}>1%</Text>
                                                <Text style={styles.chargeValue}>0.25%</Text>
                                            </View>
                                        </View>
                                        <View style={styles.chargeRow}>
                                            <Text style={styles.chargeLabel}>TAT</Text>
                                            <Text style={[styles.chargeValue, { color: '#000000', fontWeight: '400' }]}>Instant</Text>
                                        </View>
                                    </View>
                                )}
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

                            {/* Address Tags */}
                            <View style={styles.tagsContainer}>
                                <Text style={styles.tagsTitle}>Add Tag</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
                                    {TAGS.map((tag) => {
                                        const Icon = tag.icon;
                                        const isSelected = selectedTag === tag.label;
                                        return (
                                            <TouchableOpacity
                                                key={tag.id}
                                                style={[styles.tagItem, isSelected && styles.tagItemActive]}
                                                onPress={() => setSelectedTag(isSelected ? null : tag.label)}
                                            >
                                                <Icon size={16} color={isSelected ? "#ffffff" : "#000000"} />
                                                <Text style={[styles.tagLabel, isSelected && styles.tagLabelActive]}>{tag.label}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
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
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 60,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        marginRight: 12,
        marginLeft: -8,
        padding: 4,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '700',
        color: '#000000',
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    avatarTextSmall: {
        fontSize: 18,
        fontWeight: '800',
    },

    amountContainer: {
        alignItems: 'center',
        marginTop: height * 0.04,
        marginBottom: 20,
    },
    amountText: {
        fontSize: 80,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 16,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 24,
        padding: 4,
        width: '70%',
        marginTop: 10,
    },
    segment: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    segmentActive: {
        backgroundColor: '#1A1A1A',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
        opacity: 0.5,
    },
    segmentTextActive: {
        color: '#ffffff',
        opacity: 1,
    },
    segmentBalance: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
        opacity: 0.3,
    },
    segmentBalanceActive: {
        color: '#ffffff',
        opacity: 0.7,
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
    tagsContainer: {
        marginTop: 24,
    },
    tagsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        opacity: 0.4,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    tagsScroll: {
        gap: 8,
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        gap: 6,
    },
    tagItemActive: {
        backgroundColor: '#000000',
    },
    tagLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    tagLabelActive: {
        color: '#ffffff',
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
    confirmTag: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: '#000000',
        borderRadius: 8,
    },
    confirmTagText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#ffffff',
    },
    currencyToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 16,
        borderRadius: 16,
        marginTop: 24,
        width: '100%',
    },
    currencyToggleText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
    },
    toggleTrack: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 2,
    },
    toggleTrackActive: {
        backgroundColor: '#05b959',
    },
    toggleThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff',
    },
    toggleThumbActive: {
        transform: [{ translateX: 20 }],
    },
    chargesBreakdown: {
        marginTop: 24,
        width: '100%',
        backgroundColor: 'transparent',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 0,
    },
    payingThroughCopy: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
        opacity: 0.4,
        marginBottom: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    chargesTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16,
    },
    chargesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    liveRateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#05b959',
    },
    liveRateText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000000',
    },
    chargeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    chargeLabel: {
        fontSize: 14.75,
        color: '#000000',
        opacity: 0.7,
        fontWeight: '600',
    },
    chargeValue: {
        fontSize: 14.75,
        fontWeight: '700',
        color: '#000000',
    },
    fxMarkupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    fxMarkupOld: {
        fontSize: 12.75,
        color: '#000000',
        opacity: 0.5,
        textDecorationLine: 'line-through',
        fontWeight: '600',
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
        marginVertical: 10,
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
        marginBottom: 40,
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
