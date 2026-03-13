import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Switch,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { ChevronLeft, Snowflake, Ban, CreditCard, ShieldCheck, BellRing } from "lucide-react-native";

export default function CardSettingsScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [isFrozen, setIsFrozen] = useState(false);

    const SettingItem = ({ icon: Icon, title, subtitle, value, onValueChange, isDestructive }: any) => (
        <View style={styles.settingItem}>
            <View style={[styles.iconWrapper, isDestructive && styles.destructiveIconWrapper]}>
                <Icon size={22} color={isDestructive ? "#ff4444" : "#05b959"} />
            </View>
            <View style={styles.settingText}>
                <Text style={[styles.settingTitle, isDestructive && styles.destructiveText]}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {onValueChange ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: "#333", true: "#05b959" }}
                    thumbColor="#fff"
                />
            ) : (
                <ChevronLeft size={20} color="rgba(255,255,255,0.3)" style={{ transform: [{ rotate: '180deg' }] }} />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeft size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Card Settings</Text>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Security</Text>
                        <SettingItem
                            icon={Snowflake}
                            title="Freeze Card"
                            subtitle="Temporarily disable all transactions"
                            value={isFrozen}
                            onValueChange={setIsFrozen}
                        />
                        <SettingItem
                            icon={Ban}
                            title="Block Card"
                            subtitle="Permanently disable this card"
                            isDestructive
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Preferences</Text>
                        <SettingItem
                            icon={CreditCard}
                            title="Change PIN"
                            subtitle="Update your card's security code"
                        />
                        <SettingItem
                            icon={ShieldCheck}
                            title="Online Payments"
                            subtitle="Enable or disable web purchases"
                            value={true}
                            onValueChange={() => { }}
                        />
                        <SettingItem
                            icon={BellRing}
                            title="Transaction Alerts"
                            subtitle="Get notified for every spend"
                            value={true}
                            onValueChange={() => { }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 8,
        marginBottom: 24,
        gap: 12,
    },
    backButton: {
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
        marginLeft: 4,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(5, 185, 89, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    destructiveIconWrapper: {
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
    },
    settingText: {
        flex: 1,
        marginLeft: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
    },
    destructiveText: {
        color: '#ff4444',
    },
});
