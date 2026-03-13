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
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, X, Send, ArrowDownLeft, PieChart, Grid, Check, ChevronLeft, Settings, Plus, Apple } from "lucide-react-native";

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
                <Text style={[styles.heroText, { color: colors.text }]}>
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
                style={[styles.arrowButton, { backgroundColor: colors.text }]}
                onPress={() => setStep("naming")}
            >
                <ArrowRight size={32} color={colors.background} />
            </TouchableOpacity>
        </View>
    );

    const renderNaming = () => (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
        >
            <View style={styles.namingHeader}>
                <Text style={[styles.namingTitle, { color: colors.text }]}>Personalize your card</Text>
                <Text style={[styles.namingSubtitle, { color: colors.subtext }]}>Enter the name you'd like to see engraved</Text>
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
                    style={[styles.textInput, { color: colors.text, backgroundColor: theme === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.1)' }]}
                    placeholder="Enter name"
                    placeholderTextColor={colors.subtext}
                    value={cardName}
                    onChangeText={setCardName}
                    autoFocus
                    maxLength={20}
                />
                <TouchableOpacity
                    style={[styles.doneButton, { backgroundColor: cardName ? "#05b959" : (theme === 'light' ? 'rgba(0,0,0,0.05)' : "rgba(255,255,255,0.1)") }]}
                    onPress={() => setStep("settled")}
                    disabled={!cardName}
                >
                    <ArrowRight size={24} color={colors.background} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );

    const renderSettled = () => (
        <ScrollView style={[styles.settledContainer, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.settledHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ChevronLeft size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.settledTitle, { color: colors.text }]}>Card Management</Text>
            </View>

            <View style={styles.stackedCardContainer}>
                {/* Add New Card Slot */}
                <TouchableOpacity
                    style={[styles.addCardSlot, { backgroundColor: theme === 'light' ? '#f0f0f0' : '#222', borderColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }]}
                    onPress={() => setStep("hero")}
                >
                    <Text style={[styles.addCardText, { color: colors.text }]}>Add new card</Text>
                    <View style={[styles.addCardIconCircle, { backgroundColor: colors.text }]}>
                        <Plus size={16} color={colors.background} />
                    </View>
                </TouchableOpacity>

                {/* Stacked Background Card (Visual Only) */}
                <View style={[styles.backgroundCard, { top: 40, zIndex: 1, backgroundColor: '#1A1A1A' }]}>
                    <View style={styles.backgroundCardHeader}>
                        <View style={styles.mastercardLogoSmall}>
                            <View style={[styles.logoCircleSmall, { backgroundColor: '#EB001B', opacity: 0.8 }]} />
                            <View style={[styles.logoCircleSmall, { backgroundColor: '#F79E1B', opacity: 0.8, marginLeft: -6 }]} />
                        </View>
                        <Text style={styles.backgroundCardNumber}>•••• •••• 3507</Text>
                    </View>
                </View>

                {/* Main Active Card - 3 Section Design */}
                <View style={[styles.mainCard, {
                    top: 80,
                    zIndex: 2,
                    backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212',
                    borderColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'
                }]}>
                    {/* Top Section: Clean Minimalist Matte */}
                    <View style={[styles.cardSectionTop, { borderBottomColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]}>
                        <LinearGradient
                            colors={theme === 'light' ? ['#F9F9F9', '#FFFFFF'] : ['#1A1A1A', '#252525']}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        />
                        <View style={[styles.minimalistLogo, { backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]} />
                    </View>

                    {/* Middle Section: Brushed Metal Band */}
                    <View style={styles.cardSectionMiddle}>
                        <LinearGradient
                            colors={theme === 'light' ? ['#F0F0F0', '#E5E5E5', '#F0F0F0'] : ['#2A2A2A', '#353535', '#2A2A2A']}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                        <View style={styles.chip}>
                            <View style={styles.chipInner}>
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLineVertical} />
                            </View>
                        </View>
                    </View>

                    {/* Bottom Section: Matte Metal Finish */}
                    <View style={[styles.cardSectionBottom, { borderTopColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]}>
                        <LinearGradient
                            colors={theme === 'light' ? ['#FFFFFF', '#F9F9F9'] : ['#252525', '#1A1A1A']}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        />
                        <Text style={[styles.cardHolderNameNew, { color: theme === 'light' ? '#333' : '#E0E0E0' }]}>{cardName.toUpperCase() || "INAAYA CHANDRA"}</Text>
                        <View style={styles.graphicElement}>
                            <View style={[styles.graphicHalf, { backgroundColor: '#EB001B' }]} />
                            <View style={[styles.graphicHalf, { backgroundColor: '#0033A0' }]} />
                            <View style={styles.graphicOverlay} />
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.actionGrid}>
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={() => (navigation as any).navigate('Main', { screen: 'Transfer' })}
                >
                    <View style={[styles.actionIconWrapper, { backgroundColor: theme === 'light' ? '#f5f5f5' : '#1A1A1A' }]}>
                        <Send size={24} color="#05b959" />
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.subtext }]}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem}>
                    <View style={[styles.actionIconWrapper, { backgroundColor: theme === 'light' ? '#f5f5f5' : '#1A1A1A' }]}>
                        <ArrowDownLeft size={24} color="#05b959" />
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.subtext }]}>Request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={() => (navigation as any).navigate('Main', { screen: 'Insights' })}
                >
                    <View style={[styles.actionIconWrapper, { backgroundColor: theme === 'light' ? '#f5f5f5' : '#1A1A1A' }]}>
                        <PieChart size={24} color="#05b959" />
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.subtext }]}>Statistic</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={() => (navigation as any).navigate('CardSettings')}
                >
                    <View style={[styles.actionIconWrapper, { backgroundColor: theme === 'light' ? '#f5f5f5' : '#1A1A1A' }]}>
                        <Settings size={24} color="#05b959" />
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.subtext }]}>Settings</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.transactionsSection}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent transaction</Text>
                    <TouchableOpacity>
                        <Text style={[styles.viewAllText, { color: colors.subtext }]}>View all</Text>
                    </TouchableOpacity>
                </View>

                {[
                    { id: 1, name: "Adobe Creative suite", type: "Subscription", amount: "-$242", time: "Today, 12:03 PM", icon: "A" },
                    { id: 2, name: "Wise - from Zack", type: "Transfer", amount: "+$2,499", time: "Yesterday", icon: "W" },
                    { id: 3, name: "Apple", type: "Online payment", amount: "-$6,733", time: "Today, 12:03 PM", icon: Apple },
                ].map((tx) => (
                    <View key={tx.id} style={[styles.transactionItem, { backgroundColor: theme === 'light' ? '#f9f9f9' : '#111' }]}>
                        <View style={[styles.txIconWrapper, { backgroundColor: theme === 'light' ? '#f0f0f0' : '#1A1A1A' }]}>
                            {typeof tx.icon === 'string' ? (
                                <Text style={[styles.txIconText, { color: colors.text }]}>{tx.icon}</Text>
                            ) : (
                                <tx.icon size={20} color={colors.text} />
                            )}
                        </View>
                        <View style={styles.txInfo}>
                            <Text style={[styles.txName, { color: colors.text }]}>{tx.name}</Text>
                            <Text style={[styles.txType, { color: colors.subtext }]}>{tx.type}</Text>
                        </View>
                        <View style={styles.txAmountWrapper}>
                            <Text style={[styles.txAmount, { color: tx.amount.startsWith('+') ? "#05b959" : colors.text }]}>{tx.amount}</Text>
                            <Text style={[styles.txTime, { color: colors.subtext }]}>{tx.time}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={theme === "light" ? "dark-content" : "light-content"} />

            {/* Close Button - Only for naming flow */}
            {step !== "settled" && (
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <X size={28} color={colors.text} />
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
    stackedCardContainer: {
        width: "100%",
        height: 320,
        position: 'relative',
        marginBottom: 20,
    },
    addCardSlot: {
        width: "100%",
        height: 60,
        borderRadius: 16,
        backgroundColor: '#222', // More opaque
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'absolute',
        top: 0,
        zIndex: 0,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    addCardText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    addCardIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundCard: {
        width: "100%",
        height: 200,
        borderRadius: 24,
        position: 'absolute',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 5,
    },
    backgroundCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mastercardLogoSmall: {
        flexDirection: 'row',
    },
    logoCircleSmall: {
        width: 18,
        height: 18,
        borderRadius: 9,
    },
    backgroundCardNumber: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        fontWeight: '600',
    },
    mainCard: {
        width: "100%",
        height: 230,
        borderRadius: 16,
        overflow: "hidden",
        position: "absolute",
        backgroundColor: '#121212', // Midnight Onyx
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardSectionTop: {
        height: '30%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    cardSectionMiddle: {
        height: '40%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        overflow: 'hidden',
    },
    cardSectionBottom: {
        height: '30%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    minimalistLogo: {
        width: 24,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
    },
    cardHolderNameNew: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E0E0E0', // Silver/White
        letterSpacing: 2,
    },
    graphicElement: {
        width: 80,
        height: 40,
        flexDirection: 'row',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
    },
    graphicHalf: {
        flex: 1,
    },
    graphicOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
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
