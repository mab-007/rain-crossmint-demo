import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, ExternalLink } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqs = [
    {
        question: "How do I fund my wallet?",
        answer: "You can fund your wallet by clicking the 'Invest now' button on the Cash Details screen. You can choose between USD and PHP wallets to add funds.",
    },
    {
        question: "What is the exchange rate?",
        answer: "We use live market rates for currency conversion. You can see the current rate on the Exchange screen before confirming any transaction.",
    },
    {
        question: "Is my money safe?",
        answer: "Yes, your funds are secured using Crossmint's enterprise-grade wallet infrastructure on the Base blockchain.",
    },
    {
        question: "How do I contact support?",
        answer: "You can reach out to us via email at support@stablecoin.app or use the live chat feature available in the app.",
    },
    {
        question: "What are the transaction fees?",
        answer: "We strive to keep fees minimal. Most internal transfers are free, while external blockchain transactions may incur small gas fees.",
    },
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [expanded, setExpanded] = useState(false);
    const { colors } = useTheme();

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <TouchableOpacity
            style={[styles.faqItem, { backgroundColor: colors.card }]}
            onPress={toggleExpand}
            activeOpacity={0.7}
        >
            <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>{question}</Text>
                {expanded ? <ChevronUp size={20} color={colors.subtext} /> : <ChevronDown size={20} color={colors.subtext} />}
            </View>
            {expanded && (
                <View style={styles.faqAnswerContainer}>
                    <Text style={[styles.faqAnswer, { color: colors.subtext }]}>{answer}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default function HelpSupportScreen() {
    const navigation = useNavigation();
    const { colors, theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
                        <HelpCircle size={40} color={colors.primary} />
                    </View>
                    <Text style={[styles.heroTitle, { color: colors.text }]}>How can we help?</Text>
                    <Text style={[styles.heroSubtitle, { color: colors.subtext }]}>Search our FAQs or contact us directly.</Text>
                </View>

                {/* Contact Options */}
                <View style={styles.contactContainer}>
                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.card }]}>
                        <MessageCircle size={24} color={colors.primary} />
                        <Text style={[styles.contactLabel, { color: colors.text }]}>Live Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.card }]}>
                        <Mail size={24} color="#4F80FF" />
                        <Text style={[styles.contactLabel, { color: colors.text }]}>Email Us</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQs */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}

                {/* Footer Link */}
                <TouchableOpacity style={styles.footerLink}>
                    <Text style={[styles.footerLinkText, { color: colors.primary }]}>Visit our full Help Center</Text>
                    <ExternalLink size={14} color={colors.primary} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        marginVertical: 32,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
    contactContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    contactCard: {
        flex: 1,
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    faqItem: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
        marginRight: 16,
    },
    faqAnswerContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    faqAnswer: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.8,
    },
    footerLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        gap: 6,
    },
    footerLinkText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
