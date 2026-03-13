import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    Pressable,
} from "react-native";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import * as Linking from "expo-linking";
import { useTheme } from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
    const { loginWithOAuth, createAuthSession, crossmintAuth, status } =
        useCrossmintAuth();
    const { theme, colors } = useTheme();

    const [email, setEmail] = useState("");
    const [emailId, setEmailId] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const emailInputRef = React.useRef<TextInput>(null);
    const otpInputRef = React.useRef<TextInput>(null);

    // Entrance animation
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(40)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
        ]).start();
    }, []);

    // Handle OAuth deep-link callback
    const url = Linking.useURL();
    useEffect(() => {
        if (url != null) {
            createAuthSession(url);
        }
    }, [url, createAuthSession]);

    const sendOtp = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }
        setIsPending(true);
        try {
            const res = await crossmintAuth?.sendEmailOtp(email);
            setEmailId(res.emailId);
            setOtpSent(true);
        } catch {
            Alert.alert("Error", "Failed to send OTP. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp.trim()) {
            Alert.alert("Error", "Please enter the OTP code");
            return;
        }
        setIsPending(true);
        try {
            const oneTimeSecret = await crossmintAuth?.confirmEmailOtp(email, emailId, otp);
            await createAuthSession(oneTimeSecret);
        } catch {
            Alert.alert("Error", "Invalid OTP code. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    if (status === "initializing") {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.initText, { color: colors.subtext }]}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <Text style={[styles.heroTitle, { color: colors.text }]}>KinnectFi</Text>
                        <Text style={[styles.heroSubtitle, { color: colors.subtext }]}>Your money, at the speed of the internet</Text>
                    </Animated.View>

                    {/* Form Section */}
                    <Animated.View style={[styles.formSection, { backgroundColor: colors.background, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        {!otpSent ? (
                            <>
                                <Text style={[styles.formLabel, { color: colors.text }]}>Sign in with email</Text>
                                <Pressable
                                    onPress={() => emailInputRef.current?.focus()}
                                    style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }, focusedInput === 'email' && [styles.inputFocused, { borderColor: colors.primary, shadowColor: colors.primary }]]}
                                >
                                    <TextInput
                                        ref={emailInputRef}
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="your@email.com"
                                        placeholderTextColor={colors.subtext}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onFocus={() => setFocusedInput('email')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                </Pressable>
                                <TouchableOpacity
                                    style={[styles.primaryBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }, isPending && styles.btnDisabled]}
                                    onPress={sendOtp}
                                    disabled={isPending}
                                >
                                    {isPending
                                        ? <ActivityIndicator color="#fff" size="small" />
                                        : <Text style={styles.primaryBtnText}>Continue →</Text>
                                    }
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.formLabel, { color: colors.text }]}>Enter the code sent to</Text>
                                <Text style={[styles.emailDisplay, { color: colors.primary }]}>{email}</Text>
                                <Pressable
                                    onPress={() => otpInputRef.current?.focus()}
                                    style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }, focusedInput === 'otp' && [styles.inputFocused, { borderColor: colors.primary, shadowColor: colors.primary }]]}
                                >
                                    <TextInput
                                        ref={otpInputRef}
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="6-digit code"
                                        placeholderTextColor={colors.subtext}
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        onFocus={() => setFocusedInput('otp')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                </Pressable>
                                <TouchableOpacity
                                    style={[styles.primaryBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }, isPending && styles.btnDisabled]}
                                    onPress={verifyOtp}
                                    disabled={isPending}
                                >
                                    {isPending
                                        ? <ActivityIndicator color="#fff" size="small" />
                                        : <Text style={styles.primaryBtnText}>Verify →</Text>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ghostBtn} onPress={() => { setOtpSent(false); setOtp(""); }} disabled={isPending}>
                                    <Text style={[styles.ghostBtnText, { color: colors.subtext }]}>← Change email</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <View style={styles.divider}>
                            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                            <Text style={[styles.dividerText, { color: colors.subtext }]}>or</Text>
                            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                        </View>

                        <TouchableOpacity style={[styles.googleBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => loginWithOAuth("google")} disabled={isPending}>
                            <Text style={[styles.googleBtnText, { color: colors.text }]}>Continue with Google</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Text style={[styles.footer, { color: colors.subtext }]}>
                        By continuing, you agree to our Terms. A wallet is automatically created on Base Sepolia.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 20, paddingBottom: 40 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    initText: { marginTop: 12, fontSize: 16 },

    // Hero
    hero: {
        alignItems: "center",
        paddingVertical: 60,
    },
    heroTitle: { fontSize: 42, fontWeight: "800", color: "#000", letterSpacing: -1.5 },
    heroSubtitle: { fontSize: 15, color: "#888", marginTop: 8, textAlign: "center", lineHeight: 22 },

    // Form
    formSection: {
        backgroundColor: "#fff",
    },
    formLabel: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 12 },
    emailDisplay: { fontSize: 15, fontWeight: "700", color: "#05b959", marginBottom: 16, marginTop: -4 },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#e8e8e8",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 14,
        backgroundColor: "#fafafa",
    },
    inputFocused: {
        borderColor: "#05b959",
        backgroundColor: "#fff",
        shadowColor: "#05b959",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    inputPrefix: { fontSize: 18, color: "#aaa", marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: "#000", paddingVertical: 12 },

    primaryBtn: {
        backgroundColor: "#05b959",
        borderRadius: 16,
        paddingVertical: 17,
        alignItems: "center",
        shadowColor: "#05b959",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 12,
    },
    btnDisabled: { opacity: 0.6 },
    primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16, letterSpacing: 0.3 },

    ghostBtn: { alignItems: "center", paddingVertical: 12 },
    ghostBtnText: { color: "#666", fontSize: 15, fontWeight: "600" },

    divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: "#f0f0f0" },
    dividerText: { marginHorizontal: 14, color: "#bbb", fontSize: 13, fontWeight: "500" },

    googleBtn: {
        borderWidth: 1.5,
        borderColor: "#e8e8e8",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    googleBtnText: { fontSize: 15, fontWeight: "600", color: "#333" },

    footer: {
        textAlign: "center",
        color: "#bbb",
        fontSize: 12,
        marginTop: 32,
        lineHeight: 18,
        paddingHorizontal: 8,
    },
});
