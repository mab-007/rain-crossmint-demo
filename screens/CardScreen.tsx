import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, TouchableOpacity } from "react-native";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function CardScreen() {
    const { user } = useCrossmintAuth();
    const navigation = useNavigation<any>();

    const handleProfilePress = () => {
        navigation.navigate("Profile");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Card</Text>
                    <TouchableOpacity onPress={handleProfilePress} style={styles.profileBtn}>
                        <Image source={require('../assets/icon.png')} style={styles.avatarImage} />
                    </TouchableOpacity>
                </View>

                {/* Main Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Design a card{"\n"}unlike{"\n"}any other</Text>
                </View>

                {/* Focused Vertical Card */}
                <View style={styles.cardWrapper}>
                    <View style={styles.cardContainer}>
                        <Image
                            source={require("../assets/card.png")}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        {/* Gold Chip Overlay */}
                        <View style={styles.chipContainer}>
                            <View style={styles.chip}>
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLineVertical} />
                            </View>
                        </View>
                    </View>
                </View>

                <Text style={styles.footerText}>
                    Prepaid debit cards issued by Sutton Bank, Member FDIC.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5e2d9",
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000',
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    titleContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    mainTitle: {
        fontSize: 48,
        fontWeight: '500',
        color: '#000',
        lineHeight: 52,
        letterSpacing: -1,
    },
    cardWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end', // Position at bottom
        overflow: 'hidden', // Clip the card
    },
    cardContainer: {
        width: width * 0.85,
        height: width * 1.4,
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: "#000",
        position: 'relative',
        bottom: -width * 0.28, // Hide ~20% of the card (1.4 * 0.2 = 0.28)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: 20,
    },
    cardImage: {
        width: "100%",
        height: "100%",
    },
    chipContainer: {
        position: 'absolute',
        top: '10%',
        right: '10%',
    },
    chip: {
        width: 60,
        height: 48,
        backgroundColor: '#d4af37',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        padding: 4,
        justifyContent: 'space-around',
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
    footerText: {
        fontSize: 11,
        color: '#888',
        textAlign: "center",
        paddingBottom: 24,
        marginTop: 40,
    },
});
