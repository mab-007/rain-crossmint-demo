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
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Globe, CreditCard, TrendingUp, Zap } from "lucide-react-native";
import { GlobalGlobe, PremiumCard, CurrencyFlow, InstantZap } from "../components/LandingVisuals";

const { width, height } = Dimensions.get("window");

type NavigationProp = StackNavigationProp<RootStackParamList, "Landing">;

const SLIDES = [
    {
        id: 1,
        title: "Banking Built for Global Families",
        description: "Empowering global citizens with seamless cross-border finance and instant support for loved ones.",
        icon: Globe,
        Visual: GlobalGlobe,
        color: "#05b959",
    },
    {
        id: 2,
        title: "The Only Card You'll Ever Need",
        description: "Spend in any currency with real-time conversion and premium rewards on every transaction.",
        icon: CreditCard,
        Visual: PremiumCard,
        color: "#3b82f6",
    },
    {
        id: 3,
        title: "Your Wealth, Growing Faster",
        description: "Earn industry-leading yields on your savings while maintaining instant liquidity and security.",
        icon: TrendingUp,
        Visual: CurrencyFlow,
        color: "#8b5cf6",
    },
    {
        id: 4,
        title: "Money at the Speed of Thought",
        description: "Instant, borderless transfers with zero friction. The future of global banking is here.",
        icon: Zap,
        Visual: InstantZap,
        color: "#f59e0b",
    },
];

const TypewriterText = ({ text, style, delay = 30, onComplete }: { text: string, style: any, delay?: number, onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setDisplayedText("");
        setCurrentIndex(0);
    }, [text]);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, delay]);

    return <Text style={style}>{displayedText}</Text>;
};



export default function LandingScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [activeSlide, setActiveSlide] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const nextSlide = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setActiveSlide((prev) => (prev + 1) % SLIDES.length);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        });
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        progressAnim.setValue(0);
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 6000,
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
        const Visual = currentSlide.Visual;
        return (
            <View style={styles.imageContainer}>
                <Visual />
            </View>
        );
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
                            <Text style={styles.brandName}>KinnectFi</Text>
                        </View>
                    </View>

                    {/* Carousel Section */}
                    <TouchableOpacity
                        style={styles.carouselContainer}
                        activeOpacity={1}
                        onPress={nextSlide}
                    >
                        <Animated.View style={[styles.visualWrapper, { opacity: fadeAnim }]}>
                            {renderVisual()}
                        </Animated.View>

                        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                            <TypewriterText
                                text={currentSlide.title}
                                style={styles.headline}
                                delay={40}
                            />
                            <TypewriterText
                                text={currentSlide.description}
                                style={styles.subheadline}
                                delay={20}
                            />
                        </Animated.View>
                    </TouchableOpacity>

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
        justifyContent: "center",
    },
    brandName: {
        fontSize: 28,
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
    imageContainer: {
        width: width * 0.85,
        height: 280,
        justifyContent: "center",
        alignItems: "center",
    },
});
