import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Grid, ChevronRight, Zap, Home, Coffee, ShoppingBag, TrendingUp, TrendingDown } from "lucide-react-native";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

const DATA = [40, 60, 45, 70, 55, 85, 65, 90, 75, 100, 80, 110, 95];
const DAYS = [
    { date: "7", day: "Sun" },
    { date: "8", day: "Mon" },
    { date: "9", day: "Tue" },
    { date: "10", day: "Wed" },
    { date: "11", day: "Thu" },
    { date: "12", day: "Fri" },
    { date: "13", day: "Sat" },
];

export default function InsightsScreen() {
    const navigation = useNavigation();
    const { theme, colors } = useTheme();
    const [activeMonth, setActiveMonth] = useState("August");

    const months = ["August", "September", "October", "November"];

    const renderGraph = () => {
        const height = 180;
        const stepX = (width - 64) / (DATA.length - 1);
        const maxVal = Math.max(...DATA);
        const minVal = Math.min(...DATA);
        const range = maxVal - minVal;

        let pathData = `M 0 ${height - ((DATA[0] - minVal) / range) * height}`;
        for (let i = 0; i < DATA.length - 1; i++) {
            const x1 = i * stepX;
            const y1 = height - ((DATA[i] - minVal) / range) * height;
            const x2 = (i + 1) * stepX;
            const y2 = height - ((DATA[i + 1] - minVal) / range) * height;

            const cx1 = x1 + (x2 - x1) / 2;
            const cy1 = y1;
            const cx2 = x1 + (x2 - x1) / 2;
            const cy2 = y2;

            pathData += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
        }

        const fillPath = `${pathData} L ${(DATA.length - 1) * stepX} ${height} L 0 ${height} Z`;

        return (
            <View style={styles.graphContainer}>
                <Svg height={height} width={width - 64}>
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={colors.primary} stopOpacity="0.3" />
                            <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>
                    <Path d={fillPath} fill="url(#grad)" />
                    <Path d={pathData} fill="none" stroke={colors.primary} strokeWidth="3" />
                    {/* Highlight point for Friday 12 */}
                    <Circle
                        cx={5 * ((width - 64) / 6)}
                        cy={height - ((DATA[11] - minVal) / range) * height}
                        r="6"
                        fill={colors.primary}
                        stroke={colors.background}
                        strokeWidth="2"
                    />
                </Svg>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: colors.iconBg }]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Statistics</Text>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.iconBg }]}>
                    <Grid size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Month Selector */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthSelector}>
                    {months.map((month) => (
                        <TouchableOpacity
                            key={month}
                            onPress={() => setActiveMonth(month)}
                            style={styles.monthBtn}
                        >
                            <Text style={[
                                styles.monthText,
                                { color: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" },
                                activeMonth === month && { color: colors.text }
                            ]}>
                                {month}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Active Category Info */}
                <View style={styles.categoryInfo}>
                    <View>
                        <Text style={[styles.categoryTitle, { color: colors.text }]}>Subscriptions & Phone</Text>
                        <Text style={[styles.categorySubtitle, { color: colors.primary }]}>Average level</Text>
                    </View>
                    <View style={[styles.amountBadge, { backgroundColor: colors.iconBg }]}>
                        <Text style={[styles.amountText, { color: colors.text }]}>₴ 560</Text>
                    </View>
                </View>

                {/* Graph */}
                {renderGraph()}

                {/* X-Axis */}
                <View style={styles.xAxis}>
                    {DAYS.map((item, idx) => (
                        <View key={idx} style={styles.xItem}>
                            <Text style={[
                                styles.xDate,
                                { color: colors.text },
                                item.date === "12" && { color: colors.primary }
                            ]}>{item.date}</Text>
                            <Text style={[
                                styles.xDay,
                                { color: colors.subtext },
                                item.date === "12" && { color: colors.primary }
                            ]}>{item.day}</Text>
                        </View>
                    ))}
                </View>

                {/* Spending Categories Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending categories</Text>
                    <ChevronRight size={20} color={colors.text} />
                </View>

                <View style={styles.categoriesGrid}>
                    <View style={[styles.categoryCard, { backgroundColor: colors.card }]}>
                        <View style={[styles.categoryIcon, { backgroundColor: colors.background }]}>
                            <Text style={{ fontSize: 24 }}>🔋</Text>
                        </View>
                        <Text style={[styles.cardLabel, { color: colors.text }]}>Subscriptions &{"\n"}Phone</Text>
                    </View>
                    <View style={[styles.categoryCard, { backgroundColor: colors.card }]}>
                        <View style={[styles.categoryIcon, { backgroundColor: colors.background }]}>
                            <Text style={{ fontSize: 24 }}>🏠</Text>
                        </View>
                        <Text style={[styles.cardLabel, { color: colors.text }]}>Housing &{"\n"}energy</Text>
                    </View>
                </View>

                {/* Transaction History (Moved from Home) */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent activity</Text>
                </View>

                {/* Placeholder for transactions */}
                <View style={styles.txList}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={[styles.txItem, { backgroundColor: colors.card }]}>
                            <View style={[styles.txIcon, { backgroundColor: colors.background }]}>
                                <ShoppingBag size={20} color={colors.text} />
                            </View>
                            <View style={styles.txInfo}>
                                <Text style={[styles.txName, { color: colors.text }]}>Apple Store</Text>
                                <Text style={[styles.txDate, { color: colors.subtext }]}>Today, 12:45 PM</Text>
                            </View>
                            <Text style={[styles.txAmount, { color: colors.text }]}>-$99.00</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    monthSelector: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 30,
    },
    monthBtn: {
        marginRight: 25,
    },
    monthText: {
        fontSize: 22,
        fontWeight: "600",
        color: "rgba(255,255,255,0.3)",
    },
    activeMonthText: {
        color: "#fff",
    },
    categoryInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
    },
    categorySubtitle: {
        fontSize: 14,
        color: "#d4ff00",
        marginTop: 4,
    },
    amountBadge: {
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    amountText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },
    graphContainer: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    xAxis: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 40,
    },
    xItem: {
        alignItems: "center",
    },
    xDate: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 4,
    },
    xDay: {
        fontSize: 12,
        color: "rgba(255,255,255,0.5)",
    },
    activeXText: {
        color: "#d4ff00",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#fff",
    },
    categoriesGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    categoryCard: {
        width: (width - 64) / 2,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 24,
        padding: 20,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        lineHeight: 22,
    },
    txList: {
        gap: 16,
    },
    txItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: 16,
        borderRadius: 20,
    },
    txIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    txInfo: {
        flex: 1,
    },
    txName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    txDate: {
        fontSize: 13,
        color: "rgba(255,255,255,0.5)",
        marginTop: 2,
    },
    txAmount: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },
});
