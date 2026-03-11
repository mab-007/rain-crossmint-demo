import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function CardScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Card</Text>
                <View style={styles.cardContainer}>
                    <Image
                        source={require("../assets/card.png")}
                        style={styles.cardImage}
                        resizeMode="contain"
                    />
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
        backgroundColor: "#f6f6f6",
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#000",
        alignSelf: "flex-start",
        marginBottom: 40,
        marginTop: 8,
    },
    cardContainer: {
        width: width * 0.8,
        height: width * 1.2,
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        backgroundColor: "#fff",
    },
    cardImage: {
        width: "100%",
        height: "100%",
    },
    footerText: {
        marginTop: "auto",
        fontSize: 10,
        color: "#999",
        textAlign: "center",
        paddingBottom: 20,
    },
});
