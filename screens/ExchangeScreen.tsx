import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, ChevronDown, ArrowLeftRight, Delete } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

export default function ExchangeScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [amount, setAmount] = useState("0");
    const [fromCurrency, setFromCurrency] = useState({ symbol: "USD", name: "USD Stablecoin" });
    const [toCurrency, setToCurrency] = useState({ symbol: "PHP", name: "Philippine Peso" });
    const [rate, setRate] = useState<number | null>(null);
    const [loadingRate, setLoadingRate] = useState(true);

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setAmount("0");
    };

    useEffect(() => {
        const fetchRate = async () => {
            try {
                // Using ExchangeRate-API (Free Tier) which updates every hour
                const response = await fetch("https://open.er-api.com/v6/latest/USD");
                const data = await response.json();
                if (data.rates && data.rates.PHP) {
                    setRate(data.rates.PHP);
                }
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
                // Fallback to a more current rate if API fails
                setRate(59.50);
            } finally {
                setLoadingRate(false);
            }
        };

        fetchRate();
    }, []);

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

    const NumpadButton = ({ value, label, icon: Icon }: { value?: string, label?: string, icon?: any }) => (
        <TouchableOpacity
            style={styles.numpadButton}
            onPress={() => value ? handleNumberPress(value) : (Icon ? handleDelete() : null)}
        >
            {label ? <Text style={[styles.numpadText, { color: colors.text }]}>{label}</Text> : (Icon && <Icon size={24} color={colors.text} />)}
        </TouchableOpacity>
    );

    const isFromUSD = fromCurrency.symbol === "USD";
    const convertedAmount = rate
        ? (isFromUSD ? (parseFloat(amount) * rate) : (parseFloat(amount) / rate)).toFixed(2)
        : "0.00";

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Exchange</Text>
            </View>

            <View style={styles.content}>
                {/* Exchange Card */}
                <View style={[styles.exchangeCard, { backgroundColor: colors.card }]}>
                    {/* From */}
                    <View style={styles.currencyRow}>
                        <View style={styles.currencyInfo}>
                            <Text style={[styles.label, { color: colors.subtext }]}>From</Text>
                            <TouchableOpacity style={styles.selector}>
                                <Text style={[styles.currencySymbol, { color: colors.text }]}>{fromCurrency.symbol}</Text>
                                <ChevronDown size={16} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.amountInfo}>
                            <Text style={[styles.amountValue, { color: colors.text }]}>
                                {isFromUSD ? "$" : "₱"}{amount}
                            </Text>
                            <Text style={[styles.balanceText, { color: colors.subtext }]}>
                                Balance: {isFromUSD ? "$12,450.00" : "₱90,720.00"}
                            </Text>
                        </View>
                    </View>

                    {/* Divider with Icon */}
                    <View style={styles.dividerRow}>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <TouchableOpacity
                            style={[styles.iconCircle, { backgroundColor: colors.primary }]}
                            onPress={handleSwap}
                            activeOpacity={0.7}
                        >
                            <ArrowLeftRight size={16} color={colors.card} />
                        </TouchableOpacity>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    </View>

                    {/* To */}
                    <View style={styles.currencyRow}>
                        <View style={styles.currencyInfo}>
                            <Text style={[styles.label, { color: colors.subtext }]}>To</Text>
                            <TouchableOpacity style={styles.selector}>
                                <Text style={[styles.currencySymbol, { color: colors.text }]}>{toCurrency.symbol}</Text>
                                <ChevronDown size={16} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.amountInfo}>
                            <Text style={[styles.amountValue, { color: colors.primary }]}>
                                {!isFromUSD ? "$" : "₱"}{convertedAmount}
                            </Text>
                            <View style={styles.rateRow}>
                                {loadingRate ? (
                                    <ActivityIndicator size="small" color={colors.subtext} />
                                ) : (
                                    <>
                                        <View style={styles.liveIndicator}>
                                            <View style={styles.liveDot} />
                                            <Text style={[styles.liveText, { color: colors.primary }]}>Live</Text>
                                        </View>
                                        <Text style={[styles.rateText, { color: colors.subtext }]}>
                                            {isFromUSD
                                                ? `1 USD = ${rate?.toFixed(2)} PHP`
                                                : `1 PHP = ${(1 / (rate || 1)).toFixed(4)} USD`}
                                        </Text>
                                    </>
                                )}
                            </View>
                            {!loadingRate && (
                                <View style={[styles.insightBadge, { backgroundColor: colors.primary + '15' }]}>
                                    <Text style={[styles.insightText, { color: colors.primary }]}>5-week peak</Text>
                                </View>
                            )}
                        </View>
                    </View>
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
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                    onPress={() => Alert.alert("Exchange", "Exchange feature coming soon!")}
                >
                    <Text style={[styles.actionBtnText, { color: colors.card }]}>Review Exchange</Text>
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
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    exchangeCard: {
        borderRadius: 24,
        padding: 24,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    currencyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    currencyInfo: {
        gap: 4,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: '700',
    },
    amountInfo: {
        alignItems: 'flex-end',
        gap: 4,
    },
    amountValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    balanceText: {
        fontSize: 12,
    },
    rateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(5, 185, 89, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#05b959',
    },
    liveText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    rateText: {
        fontSize: 12,
    },
    insightBadge: {
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-end',
    },
    insightText: {
        fontSize: 11,
        fontWeight: '600',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
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
        width: width / 4,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numpadText: {
        fontSize: 24,
        fontWeight: '600',
    },
    actionBtn: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    actionBtnText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
