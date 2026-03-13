import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import { ArrowRight, X, Send, ArrowDownLeft, PieChart, Grid, Check, ChevronLeft, Settings } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

type Step = "hero" | "naming" | "settled";

export default function ExploreScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { theme, colors } = useTheme();
    const [step, setStep] = useState<Step>("hero");
    const [cardName, setCardName] = useState("");

    const renderHero = () => (
        <View style={styles.content}>
            {/* Hero Text */}
            <View style={styles.heroContainer}>
                <Text style={styles.heroText}>
                    For travelers, entrepreneurs and global investors
                </Text>
            </View>

            {/* Full Page Card Visual - Centered and Clean */}
            <View style={styles.cardWrapper}>
                <View style={styles.cardContainer}>
                    <Image
                        source={require("../assets/marble_texture.png")}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                    {/* High-Quality Gold Chip Overlay */}
                    <View style={styles.chipContainer}>
                        <View style={styles.chip}>
                            <View style={styles.chipInner}>
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLineVertical} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.cardShine} />
                </View>
            </View>

            {/* Bottom Navigation Arrow */}
            <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => setStep("naming")}
            >
                <ArrowRight size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    const renderNaming = () => (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
        >
            <View style={styles.namingHeader}>
                <Text style={styles.namingTitle}>Personalize your card</Text>
                <Text style={styles.namingSubtitle}>Enter the name you'd like to see engraved</Text>
            </View>

            <View style={styles.verticalCardWrapper}>
                <View style={styles.verticalCard}>
                    <Image
                        source={require("../assets/marble_texture.png")}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                    <View style={styles.verticalChipContainer}>
                        <View style={styles.chip}>
                            <View style={styles.chipInner}>
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLineVertical} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.engravedNameContainer}>
                        <Text style={styles.engravedName}>{cardName || "YOUR NAME"}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter name"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={cardName}
                    onChangeText={setCardName}
                    autoFocus
                    maxLength={20}
                />
                <TouchableOpacity
                    style={[styles.doneButton, { backgroundColor: cardName ? "#05b959" : "rgba(255,255,255,0.1)" }]}
                    onPress={() => setStep("settled")}
                    disabled={!cardName}
                >
                    <ArrowRight size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );

    const renderSettled = () => (
        <ScrollView style={styles.settledContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settledHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ChevronLeft size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.settledTitle}>Card Management</Text>
            </View>

            <View style={styles.dashboardCardWrapper}>
                <View style={styles.dashboardCard}>
                    <Image
                        source={require("../assets/marble_texture.png")}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                    <View style={styles.dashboardChipContainer}>
                        <View style={styles.chip}>
                            <View style={styles.chipInner}>
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLineVertical} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.dashboardCardInfo}>
                        <Text style={styles.dashboardCardBalance}>$ 12,034.98</Text>
                        <View style={styles.dashboardCardBottom}>
                            <Text style={styles.dashboardCardName}>{cardName.toUpperCase()}</Text>
                            <Text style={styles.dashboardCardExpiry}>02/30</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.actionGrid}>
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={() => navigation.navigate('Transfer')}
                >
                    <View style={styles.actionIconWrapper}>
                        <Send size={24} color="#05b959" />
                    </View>
                    <Text style={styles.actionLabel}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem}>
                    <View style={styles.actionIconWrapper}>
                        <ArrowDownLeft size={24} color="#05b959" />
                    </View>
                    <Text style={styles.actionLabel}>Request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={() => navigation.navigate('Insights')}
                >
                    <View style={styles.actionIconWrapper}>
                        <PieChart size={24} color="#05b959" />
                    </View>
                    <Text style={styles.actionLabel}>Statistic</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={() => navigation.navigate('CardSettings')}
                >
                    <View style={styles.actionIconWrapper}>
                        <Settings size={24} color="#05b959" />
                    </View>
                    <Text style={styles.actionLabel}>Settings</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.transactionsSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent transaction</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View all</Text>
                    </TouchableOpacity>
                </View>

                {[
                    { id: 1, name: "Adobe Creative suite", type: "Subscription", amount: "-$242", time: "Today, 12:03 PM", icon: "A" },
                    { id: 2, name: "Wise - from Zack", type: "Transfer", amount: "+$2,499", time: "Yesterday", icon: "W" },
                    { id: 3, name: "Apple", type: "Online payment", amount: "-$6,733", time: "Today, 12:03 PM", icon: "" },
                ].map((tx) => (
                    <View key={tx.id} style={styles.transactionItem}>
                        <View style={styles.txIconWrapper}>
                            <Text style={styles.txIconText}>{tx.icon}</Text>
                        </View>
                        <View style={styles.txInfo}>
                            <Text style={styles.txName}>{tx.name}</Text>
                            <Text style={styles.txType}>{tx.type}</Text>
                        </View>
                        <View style={styles.txAmountWrapper}>
                            <Text style={[styles.txAmount, { color: tx.amount.startsWith('+') ? "#05b959" : "#fff" }]}>{tx.amount}</Text>
                            <Text style={styles.txTime}>{tx.time}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    return (
        <View style={[styles.container, { backgroundColor: "#000" }]}>
            <StatusBar barStyle="light-content" />

            {/* Close Button - Only for naming flow */}
            {step !== "settled" && (
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <X size={28} color="#fff" />
                </TouchableOpacity>
            )}

            <SafeAreaView style={styles.safeArea}>
                {step === "hero" && renderHero()}
                {step === "naming" && renderNaming()}
                {step === "settled" && renderSettled()}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 24,
        zIndex: 10,
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 40,
    },
    heroContainer: {
        marginTop: 20,
    },
    heroText: {
        fontSize: 42,
        fontWeight: '700',
        color: '#fff',
        lineHeight: 48,
        letterSpacing: -1,
    },
    cardWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        width: width * 0.85,
        height: (width * 0.85) * 0.63,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#111',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 15,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    chipContainer: {
        position: 'absolute',
        top: '35%',
        left: '10%',
    },
    chip: {
        width: 54,
        height: 42,
        backgroundColor: '#e5c100',
        borderRadius: 8,
        padding: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    chipInner: {
        flex: 1,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'space-around',
        padding: 4,
    },
    chipLine: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        width: '100%',
    },
    chipLineVertical: {
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    cardShine: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.05)',
        transform: [{ skewX: '-20deg' }, { translateX: -width }],
    },
    arrowButton: {
        alignSelf: 'flex-end',
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    // Naming Step Styles
    namingHeader: {
        marginTop: 20,
    },
    namingTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    namingSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
    },
    verticalCardWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verticalCard: {
        width: width * 0.7,
        height: width * 1.1,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#111',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 10,
    },
    verticalChipContainer: {
        position: 'absolute',
        top: '10%',
        right: '10%',
    },
    engravedNameContainer: {
        position: 'absolute',
        bottom: '15%',
        left: '10%',
    },
    engravedName: {
        fontSize: 20,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    textInput: {
        flex: 1,
        height: 56,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 28,
        paddingHorizontal: 24,
        color: '#fff',
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    doneButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Settled Step Styles
    settledContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    settledHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
        gap: 12,
    },
    settledTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'left',
    },
    backButton: {
        marginLeft: -8,
    },
    dashboardCardWrapper: {
        marginBottom: 30,
    },
    dashboardCard: {
        width: '100%',
        height: (width - 48) * 0.63,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#111',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    dashboardChipContainer: {
        position: 'absolute',
        bottom: '15%',
        right: '10%',
    },
    dashboardCardInfo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 24,
        justifyContent: 'center',
    },
    dashboardCardBalance: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    dashboardCardBottom: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    dashboardCardName: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 1,
    },
    dashboardCardExpiry: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    actionItem: {
        alignItems: 'center',
        gap: 8,
    },
    actionIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    actionLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
    },
    transactionsSection: {
        marginBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    viewAllText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 12,
        borderRadius: 16,
    },
    txIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txIconText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '700',
    },
    txInfo: {
        flex: 1,
        marginLeft: 16,
    },
    txName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    txType: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
    },
    txAmountWrapper: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    txTime: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
    },
});
