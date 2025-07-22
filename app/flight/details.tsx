import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Briefcase, Calendar, Clock, CreditCard, Heart, Plane, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { useFlightStore } from "@/hooks/flight-store";
import { Airport, FlightItinerary } from "@/types/flight";

export default function FlightDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { isFavorite, toggleFavorite } = useFlightStore();

    const [selectedTab, setSelectedTab] = useState<"details" | "fare" | "baggage">("details");

    // Mock airports for demo purposes
    const originAirport: Airport = {
        skyId: params.originId as string,
        entityId: "123",
        presentation: {
            title: "Origin Airport",
            suggestionTitle: "Origin Airport",
            subtitle: "Country",
        },
        navigation: {
            entityId: "123",
            entityType: "AIRPORT",
            localizedName: "Origin Airport",
            relevantFlightParams: {
                skyId: params.originId as string,
                entityId: "123",
                flightPlaceType: "AIRPORT",
                localizedName: "Origin Airport",
            },
            relevantHotelParams: {
                entityId: "123",
                entityType: "CITY",
                localizedName: "Origin City",
            },
        },
    };

    const destinationAirport: Airport = {
        skyId: params.destinationId as string,
        entityId: "456",
        presentation: {
            title: "Destination Airport",
            suggestionTitle: "Destination Airport",
            subtitle: "Country",
        },
        navigation: {
            entityId: "456",
            entityType: "AIRPORT",
            localizedName: "Destination Airport",
            relevantFlightParams: {
                skyId: params.destinationId as string,
                entityId: "456",
                flightPlaceType: "AIRPORT",
                localizedName: "Destination Airport",
            },
            relevantHotelParams: {
                entityId: "456",
                entityType: "CITY",
                localizedName: "Destination City",
            },
        },
    };

    // In a real app, we would fetch the flight details
    // For demo purposes, we'll use mock data
    const { data: flight } = useQuery({
        queryKey: ["flightDetails", params.flightId],
        queryFn: () => {
            // Mock flight details
            return Promise.resolve({
                id: params.flightId as string,
                price: {
                    amount: 349.99,
                    currency: "USD",
                },
                legs: [
                    {
                        id: "leg-1",
                        departure: {
                            airport: {
                                name: "Origin Airport",
                                code: params.originId as string,
                            },
                            time: new Date().toISOString(),
                        },
                        arrival: {
                            airport: {
                                name: "Destination Airport",
                                code: params.destinationId as string,
                            },
                            time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                        },
                        duration: 240,
                        airline: {
                            name: "American Airlines",
                            logo: "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2080&auto=format&fit=crop",
                            code: "AA",
                        },
                        stops: 0,
                    },
                ],
                duration: 240,
                agent: {
                    name: "Google Flights",
                    logo: "",
                },
            } as FlightItinerary);
        },
    });

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleBooking = () => {
        Alert.alert(
            "Complete Booking",
            "This would proceed to the payment screen in a real app.",
            [{ text: "OK" }]
        );
    };

    const isFav = isFavorite(params.originId as string, params.destinationId as string);

    if (!flight) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading flight details...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.airlineContainer}>
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
                        onPress={() => toggleFavorite(originAirport, destinationAirport)}
                    >
                        <Heart
                            size={24}
                            color={isFav ? Colors.light.error : "white"}
                            fill={isFav ? Colors.light.error : "none"}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Total Price</Text>
                    <Text style={styles.price}>
                        ${flight.price?.amount.toFixed(2) || "N/A"}
                    </Text>
                    <Text style={styles.priceSubtext}>per person, including taxes and fees</Text>
                </View>

                <View style={styles.flightSummary}>
                    <View style={styles.flightRoute}>
                        <View style={styles.routePoint}>
                            <Text style={styles.routeTime}>
                                {formatTime(flight.legs[0]?.departure?.time || "")}
                            </Text>
                            <Text style={styles.routeDate}>
                                {formatDate(flight.legs[0]?.departure?.time || "")}
                            </Text>
                            <Text style={styles.routeAirport}>
                                {flight.legs[0]?.departure?.airport?.code || ""}
                            </Text>
                        </View>

                        <View style={styles.routeConnection}>
                            <Text style={styles.routeDuration}>
                                {formatDuration(flight.duration || 0)}
                            </Text>
                            <View style={styles.routeLine}>
                                <View style={styles.routeDot} />
                                <View style={styles.routeLineMiddle} />
                                <View style={styles.routeDot} />
                            </View>
                            <Text style={styles.routeStops}>
                                {flight.legs[0]?.stops === 0
                                    ? "Direct Flight"
                                    : `${flight.legs[0]?.stops} stop${flight.legs[0]?.stops !== 1 ? "s" : ""
                                    }`}
                            </Text>
                        </View>

                        <View style={styles.routePoint}>
                            <Text style={styles.routeTime}>
                                {formatTime(flight.legs[0]?.arrival?.time || "")}
                            </Text>
                            <Text style={styles.routeDate}>
                                {formatDate(flight.legs[0]?.arrival?.time || "")}
                            </Text>
                            <Text style={styles.routeAirport}>
                                {flight.legs[0]?.arrival?.airport?.code || ""}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            selectedTab === "details" && styles.activeTabButton,
                        ]}
                        onPress={() => setSelectedTab("details")}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                selectedTab === "details" && styles.activeTabButtonText,
                            ]}
                        >
                            Details
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            selectedTab === "fare" && styles.activeTabButton,
                        ]}
                        onPress={() => setSelectedTab("fare")}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                selectedTab === "fare" && styles.activeTabButtonText,
                            ]}
                        >
                            Fare Info
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            selectedTab === "baggage" && styles.activeTabButton,
                        ]}
                        onPress={() => setSelectedTab("baggage")}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                selectedTab === "baggage" && styles.activeTabButtonText,
                            ]}
                        >
                            Baggage
                        </Text>
                    </TouchableOpacity>
                </View>

                {selectedTab === "details" && (
                    <View style={styles.tabContent}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Plane size={20} color={Colors.light.tint} />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailTitle}>Flight Number</Text>
                                <Text style={styles.detailValue}>AA1234</Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Clock size={20} color={Colors.light.tint} />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailTitle}>Duration</Text>
                                <Text style={styles.detailValue}>
                                    {formatDuration(flight.duration || 0)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Calendar size={20} color={Colors.light.tint} />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailTitle}>Date</Text>
                                <Text style={styles.detailValue}>
                                    {formatDate(flight.legs[0]?.departure?.time || "")}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Users size={20} color={Colors.light.tint} />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailTitle}>Passengers</Text>
                                <Text style={styles.detailValue}>1 Adult</Text>
                            </View>
                        </View>
                    </View>
                )}

                {selectedTab === "fare" && (
                    <View style={styles.tabContent}>
                        <View style={styles.fareItem}>
                            <Text style={styles.fareTitle}>Base Fare</Text>
                            <Text style={styles.fareValue}>$299.99</Text>
                        </View>
                        <View style={styles.fareItem}>
                            <Text style={styles.fareTitle}>Taxes & Fees</Text>
                            <Text style={styles.fareValue}>$50.00</Text>
                        </View>
                        <View style={styles.fareItem}>
                            <Text style={styles.fareTitle}>Total per Person</Text>
                            <Text style={styles.fareTotalValue}>$349.99</Text>
                        </View>
                        <View style={styles.fareNotes}>
                            <Text style={styles.fareNotesText}>
                                Fare Rules: Non-refundable, changes allowed with fee.
                            </Text>
                        </View>
                    </View>
                )}

                {selectedTab === "baggage" && (
                    <View style={styles.tabContent}>
                        <View style={styles.baggageItem}>
                            <View style={styles.baggageIcon}>
                                <Briefcase size={20} color={Colors.light.tint} />
                            </View>
                            <View style={styles.baggageInfo}>
                                <Text style={styles.baggageTitle}>Carry-on Baggage</Text>
                                <Text style={styles.baggageValue}>1 bag included (7kg max)</Text>
                            </View>
                        </View>
                        <View style={styles.baggageItem}>
                            <View style={styles.baggageIcon}>
                                <Briefcase size={20} color={Colors.light.tint} />
                            </View>
                            <View style={styles.baggageInfo}>
                                <Text style={styles.baggageTitle}>Checked Baggage</Text>
                                <Text style={styles.baggageValue}>
                                    First bag: $30, Second bag: $40
                                </Text>
                            </View>
                        </View>
                        <View style={styles.baggageNotes}>
                            <Text style={styles.baggageNotesText}>
                                Additional or overweight baggage may incur extra fees. Please check
                                with the airline for specific baggage policies.
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.bookingContainer}>
                    <View style={styles.paymentMethods}>
                        <Text style={styles.paymentTitle}>Payment Methods</Text>
                        <View style={styles.paymentIcons}>
                            <CreditCard size={24} color={Colors.light.secondary} />
                            <Text style={styles.paymentText}>Credit/Debit Card, PayPal</Text>
                        </View>
                    </View>
                    <Button
                        title="Book Now"
                        onPress={handleBooking}
                        style={styles.bookButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        backgroundColor: Colors.light.tint,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backButton: {
        padding: 8,
    },
    airlineContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginLeft: 8,
    },
    airlineLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    airlineName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    favoriteButton: {
        padding: 8,
    },
    priceContainer: {
        backgroundColor: Colors.light.card,
        padding: 16,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    priceLabel: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    price: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.light.tint,
        marginVertical: 4,
    },
    priceSubtext: {
        fontSize: 12,
        color: Colors.light.secondary,
    },
    flightSummary: {
        padding: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    flightRoute: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    routePoint: {
        alignItems: "center",
        width: 80,
    },
    routeTime: {
        fontSize: 18,
        fontWeight: "bold",
    },
    routeDate: {
        fontSize: 12,
        color: Colors.light.secondary,
        marginVertical: 4,
    },
    routeAirport: {
        fontSize: 16,
        fontWeight: "500",
    },
    routeConnection: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 8,
    },
    routeDuration: {
        fontSize: 12,
        color: Colors.light.secondary,
        marginBottom: 4,
    },
    routeLine: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    routeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.tint,
    },
    routeLineMiddle: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.light.tint,
    },
    routeStops: {
        fontSize: 12,
        color: Colors.light.secondary,
        marginTop: 4,
    },
    tabContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.light.tint,
    },
    tabButtonText: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    activeTabButtonText: {
        color: Colors.light.tint,
        fontWeight: "500",
    },
    tabContent: {
        padding: 16,
    },
    detailItem: {
        flexDirection: "row",
        marginBottom: 16,
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.card,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    detailInfo: {
        flex: 1,
    },
    detailTitle: {
        fontSize: 14,
        color: Colors.light.secondary,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "500",
    },
    fareItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    fareTitle: {
        fontSize: 16,
    },
    fareValue: {
        fontSize: 16,
    },
    fareTotalValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.light.tint,
    },
    fareNotes: {
        marginTop: 16,
        padding: 12,
        backgroundColor: Colors.light.card,
        borderRadius: 8,
    },
    fareNotesText: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    baggageItem: {
        flexDirection: "row",
        marginBottom: 16,
    },
    baggageIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.card,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    baggageInfo: {
        flex: 1,
    },
    baggageTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    baggageValue: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    baggageNotes: {
        marginTop: 16,
        padding: 12,
        backgroundColor: Colors.light.card,
        borderRadius: 8,
    },
    baggageNotesText: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    bookingContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    paymentMethods: {
        marginBottom: 16,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    paymentIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
    paymentText: {
        marginLeft: 8,
        color: Colors.light.secondary,
    },
    bookButton: {
        marginTop: 8,
    },
});