import React, { useRef, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, TouchableOpacity, Animated, Easing, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get("window");

export default function CardScreen() {
    const { user } = useCrossmintAuth();
    const navigation = useNavigation<any>();
    const { theme, colors } = useTheme();

    // Animation values using built-in RN Animated
    const rotationY = useRef(new Animated.Value(0)).current;
    const rotationX = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            // Reset
            rotationY.setValue(0);
            rotationX.setValue(0);
            scale.setValue(0.8);
            opacity.setValue(0);

            Animated.parallel([
                // Fade in
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                // Scale up with spring feel
                Animated.spring(scale, {
                    toValue: 1,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                }),
                // 360 rotate on Y axis — slow & elegant
                Animated.timing(rotationY, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    useNativeDriver: true,
                }),
                // Subtle tilt on X axis
                Animated.sequence([
                    Animated.timing(rotationX, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotationX, {
                        toValue: -0.5,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotationX, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        }, [])
    );

    const spinY = rotationY.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const tiltX = rotationX.interpolate({
        inputRange: [-0.5, 0, 1],
        outputRange: ['-10deg', '0deg', '15deg'],
    });

    const handleProfilePress = () => {
        navigation.navigate("Profile");
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme === "dark" ? colors.background : "#e5e2d9" }]}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Card</Text>
                    <TouchableOpacity onPress={handleProfilePress} style={styles.profileBtn}>
                        <Image source={require('../assets/icon.png')} style={styles.avatarImage} />
                    </TouchableOpacity>
                </View>

                {/* Main Title */}
                <View style={styles.titleContainer}>
                    <Text style={[styles.mainTitle, { color: colors.text }]}>Design a card unlike any other</Text>
                </View>

                {/* Focused Vertical Card with Animation */}
                <View style={styles.cardWrapper}>
                    <Animated.View
                        style={[
                            styles.cardContainer,
                            {
                                opacity,
                                transform: [
                                    { perspective: 1000 },
                                    { scale },
                                    { rotateY: spinY },
                                    { rotateX: tiltX },
                                ],
                            },
                        ]}
                    >
                        <View style={[styles.cardContainer, {
                            backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212',
                            borderColor: theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)',
                            borderWidth: 1
                        }]}>
                            {/* Top Section */}
                            <View style={[styles.cardSectionTop, { borderBottomColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]}>
                                <LinearGradient
                                    colors={theme === 'light' ? ['#F9F9F9', '#FFFFFF'] : ['#1A1A1A', '#252525']}
                                    style={StyleSheet.absoluteFill}
                                />
                                <View style={[styles.minimalistLogo, { backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]} />
                            </View>

                            {/* Middle Section: Brushed Metal Band */}
                            <View style={styles.cardSectionMiddle}>
                                <LinearGradient
                                    colors={theme === 'light'
                                        ? ['#F0F0F0', '#E0E0E0', '#F0F0F0', '#D0D0D0', '#F0F0F0']
                                        : ['#2A2A2A', '#3A3A3A', '#2A2A2A', '#4A4A4A', '#2A2A2A']}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                />
                                <View style={styles.chip}>
                                    <LinearGradient
                                        colors={['#FFD700', '#E5C100', '#B8860B']}
                                        style={StyleSheet.absoluteFill}
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
                            <View style={[styles.cardSectionBottom, { borderTopColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]}>
                                <LinearGradient
                                    colors={theme === 'light' ? ['#FFFFFF', '#F9F9F9'] : ['#252525', '#1A1A1A']}
                                    style={StyleSheet.absoluteFill}
                                />
                                <Text style={[styles.cardHolderName, {
                                    color: theme === 'light' ? '#333' : '#E0E0E0',
                                    textShadowColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                                    textShadowOffset: { width: 0, height: 1 },
                                    textShadowRadius: 1
                                }]}>
                                    INAAYA CHANDRA
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

                            {/* Premium Shine Overlay */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
                                style={styles.premiumShine}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                pointerEvents="none"
                            />
                        </View>
                    </Animated.View>
                </View>

                {/* Explore CTA */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity
                        style={styles.ctaButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("Explore")}
                    >
                        <Text style={styles.ctaText}>Explore</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        paddingBottom: 90, // Account for absolute tab bar
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '700',
    },
    profileBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    titleContainer: {
        marginTop: 20,
        marginBottom: 0,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '500',
        lineHeight: 36,
        letterSpacing: -1,
    },
    cardWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginVertical: 4,
    },
    cardContainer: {
        width: width * 0.65,
        height: width * 1.0,
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: 20,
    },
    cardGradient: {
        width: "100%",
        height: "100%",
    },
    chipContainer: {
        position: 'absolute',
        top: '10%',
        right: '10%',
    },
    chip: {
        width: 44,
        height: 34,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
        justifyContent: 'space-around',
    },
    chipInner: {
        flex: 1,
        padding: 4,
        justifyContent: 'space-around',
    },
    premiumShine: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 5,
    },
    chipLine: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: '100%',
    },
    chipLineVertical: {
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    cardSectionTop: {
        height: '30%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        borderBottomWidth: 0.5,
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
        overflow: 'hidden',
    },
    minimalistLogo: {
        width: 24,
        height: 24,
        borderRadius: 4,
    },
    cardHolderName: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 2,
    },
    graphicElement: {
        width: 60,
        height: 30,
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
    ctaContainer: {
        marginTop: 8,
        marginBottom: 8,
    },
    ctaButton: {
        backgroundColor: '#010101', // Rich Black
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    ctaText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
