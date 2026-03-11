import React, { useEffect, useState } from "react";
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
} from "react-native";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import * as Linking from "expo-linking";

export default function LoginScreen() {
    const { loginWithOAuth, createAuthSession, crossmintAuth, status } =
        useCrossmintAuth();

    const [email, setEmail] = useState("");
    const [emailId, setEmailId] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isPending, setIsPending] = useState(false);

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
            const oneTimeSecret = await crossmintAuth?.confirmEmailOtp(
                email,
                emailId,
                otp
            );
            await createAuthSession(oneTimeSecret);
        } catch {
            Alert.alert("Error", "Invalid OTP code. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    if (status === "initializing") {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#05b959" />
                <Text style={styles.initText}>Initializing...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo / Header */}
                    <View style={styles.header}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoText}>💰</Text>
                        </View>
                        <Text style={styles.title}>StableCoin Wallet</Text>
                        <Text style={styles.subtitle}>
                            Powered by Crossmint · Base Sepolia
                        </Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Sign In</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            editable={!otpSent && !isPending}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        {!otpSent ? (
                            <TouchableOpacity
                                style={[styles.btn, styles.btnGreen, isPending && styles.btnDisabled]}
                                onPress={sendOtp}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.btnText}>Send OTP</Text>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter OTP code"
                                    placeholderTextColor="#999"
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    editable={!isPending}
                                />
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnGreen, isPending && styles.btnDisabled]}
                                    onPress={verifyOtp}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.btnText}>Verify OTP</Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnGrey]}
                                    onPress={() => {
                                        setOtpSent(false);
                                        setOtp("");
                                    }}
                                    disabled={isPending}
                                >
                                    <Text style={[styles.btnText, { color: "#333" }]}>Back</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.line} />
                        </View>

                        <TouchableOpacity
                            style={[styles.btn, styles.btnGoogle]}
                            onPress={() => loginWithOAuth("google")}
                            disabled={isPending}
                        >
                            <Text style={styles.btnText}>🔵 Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footer}>
                        By signing in, a wallet is automatically created for you on Base Sepolia.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f0fdf4" },
    scroll: { flexGrow: 1, padding: 24, justifyContent: "center" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    initText: { marginTop: 12, color: "#666", fontSize: 16 },

    header: { alignItems: "center", marginBottom: 32 },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#05b959",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#05b959",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoText: { fontSize: 36 },
    title: { fontSize: 26, fontWeight: "700", color: "#1a1a1a" },
    subtitle: { fontSize: 13, color: "#666", marginTop: 4 },

    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1.5,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        fontSize: 15,
        color: "#1a1a1a",
        backgroundColor: "#fafafa",
    },
    btn: {
        padding: 15,
        alignItems: "center",
        borderRadius: 12,
        marginBottom: 10,
    },
    btnGreen: { backgroundColor: "#05b959" },
    btnGrey: { backgroundColor: "#f0f0f0" },
    btnGoogle: { backgroundColor: "#4285f4" },
    btnDisabled: { opacity: 0.7 },
    btnText: { color: "#fff", fontWeight: "600", fontSize: 15 },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16,
    },
    line: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
    orText: { marginHorizontal: 12, color: "#999", fontSize: 13 },

    footer: {
        textAlign: "center",
        color: "#888",
        fontSize: 12,
        marginTop: 24,
        paddingHorizontal: 16,
        lineHeight: 18,
    },
});
