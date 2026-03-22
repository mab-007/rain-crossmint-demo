import React, { useState, useRef } from "react";
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
    Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, X, Send, ArrowDownLeft, PieChart, Grid, Check, ChevronLeft, Settings, Plus, Apple, Eye, EyeOff } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

type Step = "hero" | "naming" | "settled";

export default function ExploreScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { theme, colors } = useTheme();
    const [step, setStep] = useState<Step>("hero");
    const [cardName, setCardName] = useState("");
    const [isFlipped, setIsFlipped] = useState(false);

    // Animation for card flip
    const flipAnim = useRef(new Animated.Value(0)).current;

    const toggleFlip = () => {
        const toValue = isFlipped ? 0 : 1;
        Animated.spring(flipAnim, {
            toValue,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
        setIsFlipped(!isFlipped);
    };

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontOpacity = flipAnim.interpolate({
        inputRange: [0, 0.5, 0.5, 1],
        outputRange: [1, 1, 0, 0],
    });

    const backOpacity = flipAnim.interpolate({
        inputRange: [0, 0.5, 0.5, 1],
        outputRange: [0, 0, 1, 1],
    });

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
                <View style={[styles.cardContainer, {
                    backgroundColor: theme === 'light' ? '#E8E8E8' : '#1A1A1A',
                    borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                    borderWidth: 1
                }]}>
                    {/* Silver to Gold Story Gradient */}
                    <LinearGradient
                        colors={theme === 'light'
                            ? ['#D8D8D8', '#F5F5F5', '#E8E8E8', '#FFD700', '#DAA520', '#B8860B']
                            : ['#2A2A2A', '#4A4A4A', '#1A1A1A', '#8B6B00', '#554400', '#332200']}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />

                    {/* Story Elements: PHP to USD */}
                    <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        <Text style={[styles.storySymbol, { left: '10%', top: '20%', opacity: 0.05, transform: [{ rotate: '-15deg' }] }]}>₱</Text>
                        <Text style={[styles.storySymbol, { left: '25%', top: '60%', opacity: 0.03, transform: [{ rotate: '10deg' }] }]}>₱</Text>
                        <Text style={[styles.storySymbol, { right: '25%', top: '15%', opacity: 0.03, transform: [{ rotate: '-10deg' }] }]}>$</Text>
                        <Text style={[styles.storySymbol, { right: '10%', top: '55%', opacity: 0.05, transform: [{ rotate: '15deg' }] }]}>$</Text>
                    </View>

                    {/* Artistic Flow Shine Overlays */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
                        style={[styles.artisticShine, { top: '-20%', left: '-10%', width: '120%', height: '40%', transform: [{ rotate: '-25deg' }] }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        pointerEvents="none"
                    />

                    {/* Branding & Logo */}
                    <View style={styles.pureCardHeader}>
                        <Text style={[styles.brandText, { color: theme === 'light' ? '#000000' : '#FFFFFF' }]}>KinnectFi</Text>
                    </View>

                    {/* Chip */}
                    <View style={styles.pureCardMiddle}>
                        <View style={styles.chip}>
                            <LinearGradient
                                colors={['#FFD700', '#E5C100', '#B8860B']}
                                style={styles.chipInnerGradient}
                            />
                            <View style={styles.chipInner}>
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLineVertical} />
                            </View>
                        </View>
                    </View>

                    {/* Premium Shine Overlays */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
                        style={styles.premiumShine}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        pointerEvents="none"
                    />
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
                <View style={[styles.verticalCard, {
                    backgroundColor: theme === 'light' ? '#E8E8E8' : '#1A1A1A',
                    borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                    borderWidth: 1
                }]}>
                    {/* Silver to Gold Story Gradient */}
                    <LinearGradient
                        colors={theme === 'light'
                            ? ['#D8D8D8', '#F5F5F5', '#E8E8E8', '#FFD700', '#DAA520', '#B8860B']
                            : ['#2A2A2A', '#4A4A4A', '#1A1A1A', '#8B6B00', '#554400', '#332200']}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />

                    {/* Story Elements: PHP to USD */}
                    <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        <Text style={[styles.storySymbol, { left: '10%', top: '20%', opacity: 0.05, transform: [{ rotate: '-15deg' }] }]}>₱</Text>
                        <Text style={[styles.storySymbol, { left: '25%', top: '60%', opacity: 0.03, transform: [{ rotate: '10deg' }] }]}>₱</Text>
                        <Text style={[styles.storySymbol, { right: '25%', top: '15%', opacity: 0.03, transform: [{ rotate: '-10deg' }] }]}>$</Text>
                        <Text style={[styles.storySymbol, { right: '10%', top: '55%', opacity: 0.05, transform: [{ rotate: '15deg' }] }]}>$</Text>
                    </View>

                    {/* Artistic Flow Shine Overlays */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
                        style={[styles.artisticShine, { top: '-20%', left: '-10%', width: '120%', height: '40%', transform: [{ rotate: '-25deg' }] }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        pointerEvents="none"
                    />

                    {/* Branding & Logo */}
                    <View style={styles.pureCardHeader}>
                        <Text style={[styles.brandText, { color: theme === 'light' ? '#000000' : '#FFFFFF' }]}>KinnectFi</Text>
                    </View>

                    {/* Chip */}
                    <View style={styles.pureCardMiddle}>
                        <View style={styles.chip}>
                            <LinearGradient
                                colors={['#FFD700', '#E5C100', '#B8860B']}
                                style={styles.chipInnerGradient}
                            />
                            <View style={styles.chipInner}>
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLineVertical} />
                            </View>
                        </View>
                    </View>

                    {/* Bottom Section */}
                    <View style={styles.pureCardBottom}>
                        <Text style={[styles.engravedName, {
                            color: theme === 'light' ? '#333' : '#E0E0E0',
                            textShadowColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 1
                        }]}>
                            {cardName.toUpperCase() || "YOUR NAME"}
                        </Text>
                    </View>

                    {/* Premium Shine Overlays */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
                        style={styles.premiumShine}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        pointerEvents="none"
                    />
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

            <View style={styles.singleCardWrapper}>
                <Animated.View style={[styles.flipCard, { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity }]}>
                    <View style={[styles.mainCard, {
                        backgroundColor: theme === 'light' ? '#E8E8E8' : '#1A1A1A',
                        borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'
                    }]}>
                        {/* Silver to Gold Story Gradient */}
                        <LinearGradient
                            colors={theme === 'light'
                                ? ['#D8D8D8', '#F5F5F5', '#E8E8E8', '#FFD700', '#DAA520', '#B8860B']
                                : ['#2A2A2A', '#4A4A4A', '#1A1A1A', '#8B6B00', '#554400', '#332200']}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />

                        {/* Story Elements: PHP to USD */}
                        <View style={StyleSheet.absoluteFill} pointerEvents="none">
                            <Text style={[styles.storySymbol, { left: '10%', top: '20%', opacity: 0.05, transform: [{ rotate: '-15deg' }] }]}>₱</Text>
                            <Text style={[styles.storySymbol, { left: '25%', top: '60%', opacity: 0.03, transform: [{ rotate: '10deg' }] }]}>₱</Text>
                            <Text style={[styles.storySymbol, { right: '25%', top: '15%', opacity: 0.03, transform: [{ rotate: '-10deg' }] }]}>$</Text>
                            <Text style={[styles.storySymbol, { right: '10%', top: '55%', opacity: 0.05, transform: [{ rotate: '15deg' }] }]}>$</Text>
                        </View>

                        {/* Artistic Flow Shine Overlays */}
                        <LinearGradient
                            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
                            style={[styles.artisticShine, { top: '-20%', left: '-10%', width: '120%', height: '40%', transform: [{ rotate: '-25deg' }] }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            pointerEvents="none"
                        />

                        {/* Branding & Logo */}
                        <View style={styles.pureCardHeader}>
                            <Text style={[styles.brandText, { color: theme === 'light' ? '#000000' : '#FFFFFF' }]}>KinnectFi</Text>
                            <View style={[styles.minimalistLogo, { backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]} />
                        </View>

                        {/* Middle Section: Chip */}
                        <View style={styles.pureCardMiddle}>
                            <View style={styles.chip}>
                                <LinearGradient
                                    colors={['#FFD700', '#E5C100', '#B8860B']}
                                    style={styles.chipInnerGradient}
                                />
                                <View style={styles.chipInner}>
                                    <View style={styles.chipLine} />
                                    <View style={styles.chipLine} />
                                    <View style={styles.chipLine} />
                                    <View style={styles.chipLineVertical} />
                                </View>
                            </View>
                        </View>

                        {/* Bottom Section: Name & Graphic */}
                        <View style={styles.pureCardBottom}>
                            <Text style={[styles.cardHolderNameNew, {
                                color: theme === 'light' ? '#333' : '#E0E0E0',
                                textShadowColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 1
                            }]}>
                                {cardName.toUpperCase() || "YOUR NAME"}
                            </Text>
                            <View style={styles.graphicElement}>
                                <LinearGradient
                                    colors={['#EB001B', '#F79E1B']}
                                    style={[styles.graphicHalf, { opacity: 0.9 }]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                                <LinearGradient
                                    colors={['#0033A0', '#0072CE']}
                                    style={[styles.graphicHalf, { opacity: 0.9 }]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                                <View style={styles.graphicOverlay} />
                            </View>
                        </View>

                        {/* Premium Shine Overlays */}
                        <LinearGradient
                            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
                            style={styles.premiumShine}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            pointerEvents="none"
                        />
                    </View>
                </Animated.View>

                {/* Back of the Card */}
                <Animated.View style={[styles.flipCard, styles.flipCardBack, { transform: [{ rotateY: backInterpolate }], opacity: backOpacity }]}>
                    <View style={[styles.mainCard, {
                        backgroundColor: theme === 'light' ? '#E8E8E8' : '#1A1A1A',
                        borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'
                    }]}>
                        <LinearGradient
                            colors={theme === 'light'
                                ? ['#D8D8D8', '#F5F5F5', '#E8E8E8', '#FFD700', '#DAA520', '#B8860B']
                                : ['#2A2A2A', '#4A4A4A', '#1A1A1A', '#8B6B00', '#554400', '#332200']}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />

                        {/* Magnetic Strip */}
                        <View style={styles.magneticStrip} />

                        {/* Card Details */}
                        <View style={styles.cardDetailsBack}>
                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: theme === 'light' ? '#666' : '#AAA' }]}>CARD NUMBER</Text>
                                <Text style={[styles.detailValue, { color: theme === 'light' ? '#000' : '#FFF' }]}>4532 7812 9034 3507</Text>
                            </View>
                            <View style={styles.detailGrid}>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: theme === 'light' ? '#666' : '#AAA' }]}>EXPIRY</Text>
                                    <Text style={[styles.detailValue, { color: theme === 'light' ? '#000' : '#FFF' }]}>09/28</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: theme === 'light' ? '#666' : '#AAA' }]}>CVV</Text>
                                    <Text style={[styles.detailValue, { color: theme === 'light' ? '#000' : '#FFF' }]}>842</Text>
                                </View>
                            </View>
                        </View>

                        {/* Branding Back */}
                        <View style={styles.brandingBack}>
                            <Text style={[styles.brandTextSmall, { color: theme === 'light' ? '#000' : '#FFF' }]}>KinnectFi</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            <View style={styles.actionGridHorizontal}>
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={toggleFlip}
                >
                    <View style={[styles.actionIconWrapper, { backgroundColor: theme === 'light' ? '#f5f5f5' : '#1A1A1A' }]}>
                        {isFlipped ? <EyeOff size={24} color="#05b959" /> : <Eye size={24} color="#05b959" />}
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.subtext }]}>{isFlipped ? "Hide" : "Details"}</Text>
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
                    { id: 1, name: "Adobe Creative suite", type: "Subscription", amount: "-$242", time: "Today, 12:03 PM", icon: require("../assets/adobe.png") },
                    { id: 2, name: "Wise - from Zack", type: "Transfer", amount: "+$2,499", time: "Yesterday", icon: require("../assets/wise.png") },
                    { id: 3, name: "Apple", type: "Online payment", amount: "-$6,733", time: "Today, 12:03 PM", icon: require("../assets/apple.png") },
                ].map((tx) => (
                    <View key={tx.id} style={[styles.transactionItem, { backgroundColor: theme === 'light' ? '#f9f9f9' : '#111' }]}>
                        <View style={[styles.txIconWrapper, { backgroundColor: theme === 'light' ? '#f0f0f0' : '#1A1A1A' }]}>
                            <Image source={tx.icon} style={styles.txIconImage} />
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
        width: '70%',
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
        borderRadius: 8,
        padding: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    chipInnerGradient: {
        ...StyleSheet.absoluteFillObject,
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
    premiumShine: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
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
        fontSize: 30,
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
        fontSize: 30,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'left',
    },
    backButton: {
        marginLeft: -8,
    },
    singleCardWrapper: {
        width: "100%",
        height: 240,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    flipCard: {
        width: "100%",
        height: 230,
        backfaceVisibility: 'hidden',
    },
    flipCardBack: {
        position: 'absolute',
        top: 0,
    },
    mainCard: {
        width: "100%",
        height: 230,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: '#121212',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    pureCardHeader: {
        height: '25%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    pureCardMiddle: {
        height: '50%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
    },
    pureCardBottom: {
        height: '25%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
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
        color: '#E0E0E0',
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
    actionGridHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 10,
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
    txIconImage: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
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
    brandText: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
        opacity: 0.9,
    },
    storySymbol: {
        position: 'absolute',
        fontSize: 60,
        fontWeight: '900',
        color: '#fff',
    },
    artisticShine: {
        position: 'absolute',
        zIndex: 5,
    },
    // Back of Card Styles
    magneticStrip: {
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.8)',
        marginTop: 30,
    },
    cardDetailsBack: {
        padding: 24,
        gap: 16,
    },
    detailRow: {
        gap: 4,
    },
    detailGrid: {
        flexDirection: 'row',
        gap: 40,
    },
    detailLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 2,
    },
    brandingBack: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
    brandTextSmall: {
        fontSize: 14,
        fontWeight: '800',
        opacity: 0.8,
    },
});
