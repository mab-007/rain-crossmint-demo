import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, Dimensions } from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G, Rect, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

export const GlobalGlobe = () => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(anim, {
                toValue: 1,
                duration: 25000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            <Svg width="240" height="240" viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#05b959" stopOpacity="0.3" />
                        <Stop offset="50%" stopColor="#05b959" stopOpacity="0.1" />
                        <Stop offset="100%" stopColor="#05b959" stopOpacity="0.05" />
                    </LinearGradient>
                    <LinearGradient id="glowGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                        <Stop offset="0%" stopColor="#05b959" stopOpacity="0.4" />
                        <Stop offset="100%" stopColor="#05b959" stopOpacity="0" />
                    </LinearGradient>
                </Defs>
                {/* Outer Glow */}
                <Circle cx="100" cy="100" r="95" fill="url(#glowGrad)" opacity={0.2} />
                {/* Main Globe */}
                <Circle cx="100" cy="100" r="80" fill="url(#globeGrad)" stroke="#05b959" strokeWidth="0.5" strokeDasharray="4 4" />

                <AnimatedG transform={[{ rotate }]}>
                    {/* Latitudes */}
                    <Path d="M20 100 A80 80 0 0 1 180 100" stroke="#05b959" strokeWidth="0.5" opacity={0.3} fill="none" />
                    <Path d="M30 70 A80 80 0 0 1 170 70" stroke="#05b959" strokeWidth="0.3" opacity={0.2} fill="none" />
                    <Path d="M30 130 A80 80 0 0 1 170 130" stroke="#05b959" strokeWidth="0.3" opacity={0.2} fill="none" />

                    {/* Longitudes */}
                    <Path d="M100 20 A80 80 0 0 1 100 180" stroke="#05b959" strokeWidth="0.5" opacity={0.3} fill="none" />
                    <Path d="M70 25 Q100 100 70 175" stroke="#05b959" strokeWidth="0.3" opacity={0.2} fill="none" />
                    <Path d="M130 25 Q100 100 130 175" stroke="#05b959" strokeWidth="0.3" opacity={0.2} fill="none" />

                    {/* Connection Points */}
                    <Circle cx="60" cy="60" r="3" fill="#05b959" />
                    <Circle cx="140" cy="140" r="3" fill="#05b959" />
                    <Circle cx="150" cy="60" r="2" fill="#05b959" opacity={0.6} />
                    <Circle cx="50" cy="140" r="2" fill="#05b959" opacity={0.6} />

                    {/* Arcs */}
                    <Path d="M60 60 Q100 100 140 140" stroke="#05b959" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <Path d="M150 60 Q100 100 50 140" stroke="#05b959" strokeWidth="1" fill="none" strokeDasharray="5 5" opacity={0.5} />
                </AnimatedG>
            </Svg>
        </View>
    );
};

export const PremiumCard = () => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
    });

    const rotateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["15deg", "25deg"],
    });

    const shineX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 200],
    });

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY }, { rotateX }] }]}>
            <Svg width="240" height="160" viewBox="0 0 220 140">
                <Defs>
                    <LinearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#333333" />
                        <Stop offset="50%" stopColor="#111111" />
                        <Stop offset="100%" stopColor="#000000" />
                    </LinearGradient>
                    <LinearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="white" stopOpacity="0" />
                        <Stop offset="50%" stopColor="white" stopOpacity="0.1" />
                        <Stop offset="100%" stopColor="white" stopOpacity="0" />
                    </LinearGradient>
                    <LinearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#FFD700" />
                        <Stop offset="100%" stopColor="#B8860B" />
                    </LinearGradient>
                </Defs>
                {/* Shadow */}
                <Rect x="15" y="15" width="200" height="120" rx="16" fill="black" opacity={0.3} />
                {/* Card Body */}
                <Rect x="10" y="10" width="200" height="120" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

                {/* Animated Shine */}
                <AnimatedG transform={[{ translateX: shineX }]}>
                    <Rect x="0" y="10" width="60" height="120" fill="url(#shineGrad)" opacity={0.5} />
                </AnimatedG>

                {/* Chip */}
                <Rect x="35" y="45" width="40" height="30" rx="6" fill="url(#chipGrad)" />
                <Path d="M35 60 H75 M55 45 V75" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />

                {/* Card Details Placeholders */}
                <Rect x="35" y="90" width="120" height="6" rx="3" fill="rgba(255,255,255,0.15)" />
                <Rect x="35" y="105" width="80" height="6" rx="3" fill="rgba(255,255,255,0.1)" />

                {/* Mastercard-style Logo */}
                <Circle cx="175" cy="105" r="12" fill="#EB001B" opacity={0.8} />
                <Circle cx="185" cy="105" r="12" fill="#F79E1B" opacity={0.8} />
            </Svg>
        </Animated.View>
    );
};

export const CurrencyFlow = () => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(anim, {
                toValue: 1,
                duration: 5000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            <Svg width="220" height="220" viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                        <Stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </LinearGradient>
                </Defs>

                {/* Orbit Path */}
                <Circle cx="100" cy="100" r="75" fill="none" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="1" strokeDasharray="5 5" />

                <AnimatedG transform={[{ rotate }]}>
                    <Circle cx="100" cy="100" r="75" fill="none" stroke="url(#flowGrad)" strokeWidth="3" strokeLinecap="round" />
                    {/* Small particles on the path */}
                    <Circle cx="175" cy="100" r="3" fill="#8b5cf6" />
                    <Circle cx="25" cy="100" r="3" fill="#8b5cf6" />
                </AnimatedG>

                {/* USD Symbol Container */}
                <G transform="translate(100, 60)">
                    <Circle cx="0" cy="0" r="30" fill="#1A1A1A" stroke="#8b5cf6" strokeWidth="2" />
                    <SvgText x="0" y="8" fontSize="24" fontWeight="bold" fill="#8b5cf6" textAnchor="middle">$</SvgText>
                </G>

                {/* PHP Symbol Container */}
                <G transform="translate(100, 140)">
                    <Circle cx="0" cy="0" r="30" fill="#1A1A1A" stroke="#8b5cf6" strokeWidth="2" />
                    <SvgText x="0" y="8" fontSize="24" fontWeight="bold" fill="#8b5cf6" textAnchor="middle">₱</SvgText>
                </G>
            </Svg>
        </View>
    );
};

export const InstantZap = () => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = anim.interpolate({
        inputRange: [0, 0.2, 0.8, 1],
        outputRange: [0.3, 1, 1, 0.3],
    });

    const scale = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.95, 1.05, 0.95],
    });

    return (
        <View style={styles.container}>
            <Svg width="220" height="220" viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="zapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#f59e0b" />
                        <Stop offset="100%" stopColor="#d97706" />
                    </LinearGradient>
                </Defs>

                {/* Energy Aura */}
                <Circle cx="100" cy="100" r="70" fill="#f59e0b" opacity={0.05} />

                <AnimatedG opacity={opacity} transform={[{ scale }]}>
                    <Path
                        d="M115 30 L65 105 H100 L90 170 L140 95 H105 L115 30"
                        fill="url(#zapGrad)"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </AnimatedG>

                {/* Dynamic Speed Lines */}
                <G opacity={0.6}>
                    <Rect x="40" y="70" width="25" height="2" rx="1" fill="#f59e0b" />
                    <Rect x="30" y="95" width="35" height="2" rx="1" fill="#f59e0b" />
                    <Rect x="135" y="105" width="35" height="2" rx="1" fill="#f59e0b" />
                    <Rect x="145" y="130" width="25" height="2" rx="1" fill="#f59e0b" />
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 240,
        height: 240,
        justifyContent: "center",
        alignItems: "center",
    },
});
