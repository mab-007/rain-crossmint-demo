import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ScrollView,
    Switch,
} from "react-native";
import { useCrossmintAuth, useWallet } from "@crossmint/client-sdk-react-native-ui";
import { useNavigation } from "@react-navigation/native";
import { X, LogOut, Mail, Wallet, ChevronRight, Shield, Bell, HelpCircle, Moon } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen() {
    const { user, logout } = useCrossmintAuth();
    const { wallet } = useWallet();
    const navigation = useNavigation();

    const initial = user?.email?.[0]?.toUpperCase() ?? "?";
    const username = user?.email?.split('@')[0] || "User";

    const { theme, toggleTheme, colors } = useTheme();

    const handleLogout = async () => {
        Alert.alert("Log out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Log out", style: "destructive", onPress: () => { try { logout(); } catch { } } },
        ]);
    };

    const SettingsRow = ({ icon: Icon, label, sublabel, color = colors.text, onPress, isDestructive = false, rightElement }: any) => (
        <TouchableOpacity style={styles.settingsRow} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
            <View style={[styles.settingsIconBox, { backgroundColor: isDestructive ? '#fff0f0' : colors.background }]}>
                <Icon size={18} color={isDestructive ? colors.danger : color} />
            </View>
            <View style={styles.settingsRowText}>
                <Text style={[styles.settingsLabel, { color: isDestructive ? colors.danger : colors.text }]}>{label}</Text>
                {sublabel && <Text style={[styles.settingsSublabel, { color: colors.subtext }]} numberOfLines={1} ellipsizeMode="middle">{sublabel}</Text>}
            </View>
            {rightElement ? rightElement : <ChevronRight size={18} color={colors.subtext} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.closeBtn, { backgroundColor: colors.card }]}>
                    <X size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Avatar + Name */}
                <View style={styles.profileHeader}>
                    <View style={[styles.avatarCircle, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
                        <Text style={styles.avatarText}>{initial}</Text>
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]}>{username}</Text>
                    <Text style={[styles.userEmail, { color: colors.subtext }]}>{user?.email}</Text>
                </View>

                {/* Account Settings */}
                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>ACCOUNT</Text>
                <View style={[styles.settingsCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                    <SettingsRow
                        icon={Mail}
                        label="Email"
                        sublabel={user?.email}
                        color={colors.subtext}
                    />
                    <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
                    <SettingsRow
                        icon={Wallet}
                        label="Wallet Address"
                        sublabel={wallet?.address}
                        color={colors.subtext}
                    />
                </View>

                {/* Security & Preferences */}
                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>PREFERENCES</Text>
                <View style={[styles.settingsCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                    <SettingsRow
                        icon={Moon}
                        label="Dark Mode"
                        color={colors.text}
                        rightElement={
                            <Switch
                                value={theme === "dark"}
                                onValueChange={toggleTheme}
                                trackColor={{ false: "#ccc", true: colors.primary }}
                                thumbColor="#fff"
                            />
                        }
                    />
                    <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
                    <SettingsRow icon={Shield} label="Security" color="#4F80FF" />
                    <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
                    <SettingsRow icon={Bell} label="Notifications" color="#FF9F0A" />
                    <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
                    <SettingsRow icon={HelpCircle} label="Help & Support" color="#30B0C7" />
                </View>

                {/* Logout */}
                <View style={[styles.settingsCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                    <SettingsRow
                        icon={LogOut}
                        label="Log Out"
                        color={colors.danger}
                        isDestructive
                        onPress={handleLogout}
                    />
                </View>

                <Text style={[styles.versionText, { color: colors.subtext }]}>StableCoin v1.0.0 · Base Sepolia</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
    closeBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

    scroll: { paddingHorizontal: 20, paddingBottom: 60 },

    profileHeader: {
        alignItems: 'center',
        paddingVertical: 28,
    },
    avatarCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#05b959',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#05b959',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
    userName: { fontSize: 22, fontWeight: '800', color: '#000', marginBottom: 4 },
    userEmail: { fontSize: 14, color: '#aaa', fontWeight: '500' },

    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#aaa',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 4,
        marginTop: 4,
    },
    settingsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    settingsIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    settingsRowText: { flex: 1 },
    settingsLabel: { fontSize: 16, fontWeight: '600', color: '#000' },
    settingsSublabel: { fontSize: 12, color: '#aaa', marginTop: 2 },

    rowDivider: { height: 1, backgroundColor: '#f5f5f5', marginLeft: 66 },

    versionText: {
        textAlign: 'center',
        color: '#ccc',
        fontSize: 12,
        marginTop: 12,
        marginBottom: 20,
    },
});
