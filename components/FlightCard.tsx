import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "@/constants/colors";
import { useFlightStore } from "@/hooks/flight-store";
import { Airport, FlightItinerary } from "@/types/flight";

interface FlightCardProps {
    flight: FlightItinerary;
    origin: Airport;
    destination: Airport;
}

export default function FlightCard({ flight, origin, destination }: FlightCardProps) {
    const router = useRouter();
    const { isFavorite, toggleFavorite } = useFlightStore();

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handlePress = () => {
        router.push({
            pathname: "/flight/details",
            params: {
                flightId: flight.id,
                originId: origin.skyId,
                destinationId: destination.skyId,
            },
        });
    };

    const isFav = isFavorite(origin.skyId, destination.skyId);

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.header}>
                <View style={styles.airline}>
                    {flight.legs[0]?.airline?.logo ? (
                        <Image
                            source={{ uri: flight.legs[0].airline.logo }}
                            style={styles.airlineLogo}
                        />
                    ) : null}
                    <Text style={styles.airlineName}>
                        {flight.legs[0]?.airline?.name || "Airline"}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(origin, destination)}
                >
                    <Heart
                        size={20}
                        color={isFav ? Colors.light.error : Colors.light.secondary}
                        fill={isFav ? Colors.light.error : "none"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.flightInfo}>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>
                        {formatTime(flight.legs[0]?.departure?.time || "")}
                    </Text>
                    <Text style={styles.airport}>
                        {flight.legs[0]?.departure?.airport?.code || ""}
                    </Text>
                </View>

                <View style={styles.durationContainer}>
                    <Text style={styles.duration}>
                        {formatDuration(flight.duration || 0)}
                    </Text>
                    <View style={styles.flightPath}>
                        <View style={styles.dot} />
                        <View style={styles.line} />
                        <View style={styles.dot} />
                    </View>
                    <Text style={styles.stops}>
                        {flight.legs[0]?.stops === 0
                            ? "Direct"
                            : `${flight.legs[0]?.stops} stop${flight.legs[0]?.stops !== 1 ? "s" : ""
                            }`}
                    </Text>
                </View>

                <View style={styles.timeContainer}>
                    <Text style={styles.time}>
                        {formatTime(flight.legs[0]?.arrival?.time || "")}
                    </Text>
                    <Text style={styles.airport}>
                        {flight.legs[0]?.arrival?.airport?.code || ""}
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.price}>
                    {flight.price?.amount
                        ? `$${flight.price.amount.toFixed(2)}`
                        : "Price unavailable"}
                </Text>
                <Text style={styles.viewDetails}>View Details</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    airline: {
        flexDirection: "row",
        alignItems: "center",
    },
    airlineLogo: {
        width: 24,
        height: 24,
        marginRight: 8,
        borderRadius: 12,
    },
    airlineName: {
        fontSize: 16,
        fontWeight: "600",
    },
    favoriteButton: {
        padding: 4,
    },
    flightInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    timeContainer: {
        alignItems: "center",
    },
    time: {
        fontSize: 18,
        fontWeight: "bold",
    },
    airport: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    durationContainer: {
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 8,
    },
    duration: {
        fontSize: 14,
        color: Colors.light.secondary,
        marginBottom: 4,
    },
    flightPath: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.tint,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.light.border,
        marginHorizontal: 4,
    },
    stops: {
        fontSize: 12,
        color: Colors.light.secondary,
        marginTop: 4,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        paddingTop: 12,
    },
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.light.tint,
    },
    viewDetails: {
        fontSize: 14,
        color: Colors.light.tint,
        fontWeight: "500",
    },
});