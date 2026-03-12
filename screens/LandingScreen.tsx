import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Animated,
    Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Globe, CreditCard, TrendingUp, Zap } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

type NavigationProp = StackNavigationProp<RootStackParamList, "Landing">;

const SLIDES = [
    {
        id: 1,
        title: "Banking Built for Global Families",
        description: "For travelers, entrepreneurs, and global citizens supporting loved ones in the Philippines.",
        icon: Globe,
        color: "#05b959",
    },
    {
        id: 2,
        title: "Pay Globally with Best Rates",
        description: "Unparalleled rewards and seamless dual-currency spending with your KennectFi card.",
        icon: CreditCard,
        color: "#3b82f6",
    },
    {
        id: 3,
        title: "Convert at the Real Rate",
        description: "Same pesos, more digital dollars with an industry-leading 5% annual yield on your savings.",
        icon: TrendingUp,
        color: "#8b5cf6",
    },
    {
        id: 4,
        title: "Instant Transfers, Zero Friction",
        description: "Move money at the speed of light. Secure, borderless payments for the modern world.",
        icon: Zap,
        color: "#f59e0b",
    },
];

const CardStack = () => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const getCardStyle = (index: number) => {
        const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [index * 20, index * 10],
        });
        const rotate = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [`${index * -5}deg`, `${index * -12}deg`],
        });
        const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1 - index * 0.05, 1 - index * 0.02],
        });

        return {
            transform: [{ translateY }, { rotate }, { scale }],
            zIndex: 10 - index,
            opacity: 1 - index * 0.2,
        };
    };

    return (
        <View style={styles.cardStackContainer}>
            <Animated.View style={[styles.card, styles.card3, getCardStyle(2)]}>
                <LinearGradient colors={["#8b5cf6", "#6d28d9"]} style={styles.cardGradient} />
            </Animated.View>
            <Animated.View style={[styles.card, styles.card2, getCardStyle(1)]}>
                <LinearGradient colors={["#3b82f6", "#1d4ed8"]} style={styles.cardGradient} />
            </Animated.View>
            <Animated.View style={[styles.card, styles.card1, getCardStyle(0)]}>
                <LinearGradient colors={["#ec4899", "#be185d"]} style={styles.cardGradient}>
                    <View style={styles.cardContent}>
                        <View style={styles.cardChip} />
                        <Text style={styles.cardNumber}>**** **** **** 3190</Text>
                        <View style={styles.cardBottom}>
                            <Text style={styles.cardHolder}>KENNECTFI USER</Text>
                            <Text style={styles.cardExp}>09/29</Text>
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        </View>
    );
};

const CoinStack = () => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const COINS = [
        { symbol: "₱", colors: ["#e5e7eb", "#9ca3af", "#4b5563"], textColor: "#374151" }, // Silver/Piso
        { symbol: "$", colors: ["#fbbf24", "#d97706", "#92400e"], textColor: "#78350f" }, // Gold/Dollar
        { symbol: "€", colors: ["#94a3b8", "#475569", "#1e293b"], textColor: "#0f172a" }, // Dark Silver/Euro
        { symbol: "£", colors: ["#fcd34d", "#f59e0b", "#b45309"], textColor: "#78350f" }, // Bronze/Pound
    ];

    return (
        <View style={styles.coinStackContainer}>
            {COINS.map((coin, index) => {
                const translateY = anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [index * 35, index * 25],
                });
                const rotateX = anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["45deg", "35deg"],
                });
                const scale = anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1 - index * 0.05, 1 - index * 0.03],
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.realisticCoin,
                            {
                                transform: [{ translateY }, { rotateX }, { scale }],
                                zIndex: 10 - index,
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={[coin.colors[0], coin.colors[1], coin.colors[2]] as const}
                            style={styles.coinFace}
                        >
                            <View style={styles.coinInnerRing}>
                                <Text style={[styles.coinSymbol, { color: coin.textColor }]}>{coin.symbol}</Text>
                            </View>
                        </LinearGradient>
                        <View style={[styles.coinEdge, { backgroundColor: coin.colors[2] }]} />
                    </Animated.View>
                );
            })}
        </View>
    );
};

export default function LandingScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [activeSlide, setActiveSlide] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setActiveSlide((prev) => (prev + 1) % SLIDES.length);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        progressAnim.setValue(0);
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [activeSlide]);

    const handleGetStarted = () => {
        navigation.navigate("Login");
    };

    const currentSlide = SLIDES[activeSlide];
    const Icon = currentSlide.icon;

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const renderVisual = () => {
        switch (activeSlide) {
            case 1:
                return <CardStack />;
            case 2:
                return <CoinStack />;
            default:
                return (
                    <View style={[styles.iconContainer, { backgroundColor: currentSlide.color + "22" }]}>
                        <Icon size={40} color={currentSlide.color} />
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={["#000000", "#0a0a0a", "#121212"]}
                style={styles.background}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Refined Logo Section */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <LinearGradient
                                colors={["#05b959", "#04a14d"]}
                                style={styles.logoIcon}
                            >
                                <View style={styles.logoInner}>
                                    <Text style={styles.logoK}>K</Text>
                                </View>
                            </LinearGradient>
                            <Text style={styles.brandName}>KennectFi</Text>
                        </View>
                    </View>

                    {/* Carousel Section */}
                    <View style={styles.carouselContainer}>
                        <Animated.View style={[styles.visualWrapper, { opacity: fadeAnim }]}>
                            {renderVisual()}
                        </Animated.View>

                        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                            <Text style={styles.headline}>{currentSlide.title}</Text>
                            <Text style={styles.subheadline}>{currentSlide.description}</Text>
                        </Animated.View>
                    </View>

                    {/* Bottom Action */}
                    <View style={styles.footer}>
                        {/* Progress Indicators */}
                        <View style={styles.pagination}>
                            {SLIDES.map((_, index) => (
                                <View key={index} style={styles.paginationDotContainer}>
                                    <View style={[styles.paginationDot, { backgroundColor: "rgba(255,255,255,0.2)" }]} />
                                    {index === activeSlide && (
                                        <Animated.View
                                            style={[
                                                styles.paginationDotActive,
                                                { width: progressWidth, backgroundColor: currentSlide.color },
                                            ]}
                                        />
                                    )}
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleGetStarted}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={["#05b959", "#04a14d"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Get Started</Text>
                                <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.footerNote}>Join thousands of families saving more today.</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: "space-between",
        paddingVertical: 20,
    },
    header: {
        marginTop: 20,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    logoIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        padding: 2,
    },
    logoInner: {
        flex: 1,
        backgroundColor: "#000",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    logoK: {
        color: "#05b959",
        fontSize: 24,
        fontWeight: "900",
    },
    brandName: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        letterSpacing: -0.5,
    },
    carouselContainer: {
        flex: 1,
        justifyContent: "center",
        marginTop: -20,
    },
    visualWrapper: {
        height: 240,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
    },
    textContainer: {
        alignItems: "flex-start",
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    headline: {
        fontSize: 36,
        fontWeight: "800",
        color: "#fff",
        lineHeight: 44,
        marginBottom: 16,
        letterSpacing: -1,
    },
    subheadline: {
        fontSize: 18,
        color: "rgba(255, 255, 255, 0.6)",
        lineHeight: 28,
        fontWeight: "500",
    },
    pagination: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 24,
        width: "100%",
        justifyContent: "center",
    },
    paginationDotContainer: {
        height: 4,
        width: 30,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
    },
    paginationDot: {
        ...StyleSheet.absoluteFillObject,
    },
    paginationDotActive: {
        height: "100%",
        borderRadius: 2,
    },
    footer: {
        marginBottom: 20,
        alignItems: "center",
    },
    button: {
        width: "100%",
        height: 64,
        borderRadius: 32,
        overflow: "hidden",
        shadowColor: "#05b959",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 20,
    },
    buttonGradient: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    footerNote: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 14,
        fontWeight: "500",
    },
    // Card Stack Styles
    cardStackContainer: {
        width: 280,
        height: 180,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        position: "absolute",
        width: 260,
        height: 160,
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    cardGradient: {
        flex: 1,
        padding: 20,
    },
    cardContent: {
        flex: 1,
        justifyContent: "space-between",
    },
    cardChip: {
        width: 40,
        height: 30,
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 6,
    },
    cardNumber: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 2,
    },
    cardBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    cardHolder: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        opacity: 0.8,
    },
    cardExp: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        opacity: 0.8,
    },
    card1: {},
    card2: {},
    card3: {},
    // Realistic Coin Stack Styles
    coinStackContainer: {
        width: 200,
        height: 240,
        justifyContent: "center",
        alignItems: "center",
    },
    realisticCoin: {
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    coinFace: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.3)",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    coinInnerRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
    },
    coinSymbol: {
        fontSize: 48,
        fontWeight: "900",
        textShadowColor: "rgba(255,255,255,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    coinEdge: {
        position: "absolute",
        bottom: -4,
        width: 120,
        height: 8,
        borderRadius: 4,
        zIndex: -1,
        opacity: 0.8,
    },
});
