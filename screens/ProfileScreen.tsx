import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import { useCrossmintAuth, useWallet } from "@crossmint/client-sdk-react-native-ui";
import { useNavigation } from "@react-navigation/native";
import { X, LogOut, User, Mail, Wallet, ChevronRight } from "lucide-react-native";

export default function ProfileScreen() {
    const { user, logout } = useCrossmintAuth();
    const { wallet } = useWallet();
    const navigation = useNavigation();

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    try {
                        logout();
                    } catch {
                        Alert.alert("Error", "Failed to logout. Please try again.");
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <X size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarTextLarge}>
                            {user?.email?.[0]?.toUpperCase() ?? "?"}
                        </Text>
                    </View>
                    <Text style={styles.userName}>{user?.email?.split('@')[0] || "User"}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <Mail size={20} color="#666" />
                                <Text style={styles.infoLabel}>Email</Text>
                            </View>
                            <Text style={styles.infoValue}>{user?.email}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <Wallet size={20} color="#666" />
                                <Text style={styles.infoLabel}>Wallet Address</Text>
                            </View>
                            <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
                                {wallet?.address}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <LogOut size={20} color="#ef4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>StableCoin v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f6f6f6" },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
    },
    closeBtn: {
        padding: 4,
    },
    scroll: { padding: 20 },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 10,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e2e2e2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarTextLarge: {
        fontSize: 40,
        fontWeight: '700',
        color: '#666',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        marginBottom: 12,
        marginLeft: 4,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginLeft: 12,
    },
    infoValue: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        textAlign: 'right',
        marginLeft: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    logoutBtn: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },
    versionText: {
        textAlign: 'center',
        color: '#ccc',
        fontSize: 12,
        marginTop: 40,
        marginBottom: 20,
    },
});
