import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ArrowUpDown, Filter } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FlightCard from "@/components/FlightCard";
import Colors from "@/constants/colors";
import { useFlightStore } from "@/hooks/flight-store";
import { Airport, FlightItinerary } from "@/types/flight";

export default function SearchResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { addRecentSearch } = useFlightStore();

    const [sortBy, setSortBy] = useState<"price" | "duration">("price");
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    // Create airport objects with actual names from parameters
    const originAirport: Airport = {
        skyId: params.originSkyId as string,
        entityId: params.originEntityId as string,
        presentation: {
            title: params.originTitle as string || "Origin Airport",
            suggestionTitle: params.originTitle as string || "Origin Airport",
            subtitle: params.originSubtitle as string || "Country",
        },
        navigation: {
            entityId: params.originEntityId as string,
            entityType: "AIRPORT",
            localizedName: params.originTitle as string || "Origin Airport",
            relevantFlightParams: {
                skyId: params.originSkyId as string,
                entityId: params.originEntityId as string,
                flightPlaceType: "AIRPORT",
                localizedName: params.originTitle as string || "Origin Airport",
            },
            relevantHotelParams: {
                entityId: "123",
                entityType: "CITY",
                localizedName: params.originTitle as string || "Origin City",
            },
        },
    };

    const destinationAirport: Airport = {
        skyId: params.destinationSkyId as string,
        entityId: params.destinationEntityId as string,
        presentation: {
            title: params.destinationTitle as string || "Destination Airport",
            suggestionTitle: params.destinationTitle as string || "Destination Airport",
            subtitle: params.destinationSubtitle as string || "Country",
        },
        navigation: {
            entityId: params.destinationEntityId as string,
            entityType: "AIRPORT",
            localizedName: params.destinationTitle as string || "Destination Airport",
            relevantFlightParams: {
                skyId: params.destinationSkyId as string,
                entityId: params.destinationEntityId as string,
                flightPlaceType: "AIRPORT",
                localizedName: params.destinationTitle as string || "Destination Airport",
            },
            relevantHotelParams: {
                entityId: "456",
                entityType: "CITY",
                localizedName: params.destinationTitle as string || "Destination City",
            },
        },
    };


    const { data, isLoading, error } = useQuery({
        queryKey: ["flights", params],
        queryFn: () => {

            return Promise.resolve(getMockFlights());
        },
    });


    const getMockFlights = (): FlightItinerary[] => {
        return Array.from({ length: 10 }, (_, i) => ({
            id: `flight-${i}`,
            price: {
                amount: 200 + Math.floor(Math.random() * 300),
                currency: "USD",
            },
            legs: [
                {
                    id: `leg-${i}`,
                    departure: {
                        airport: {
                            name: "Origin Airport",
                            code: params.originSkyId as string,
                        },
                        time: new Date(
                            new Date(params.date as string).getTime() + 8 * 60 * 60 * 1000
                        ).toISOString(),
                    },
                    arrival: {
                        airport: {
                            name: "Destination Airport",
                            code: params.destinationSkyId as string,
                        },
                        time: new Date(
                            new Date(params.date as string).getTime() + 12 * 60 * 60 * 1000
                        ).toISOString(),
                    },
                    duration: 180 + Math.floor(Math.random() * 120),
                    airline: {
                        name: ["American Airlines", "Delta", "United", "JetBlue", "Southwest"][
                            Math.floor(Math.random() * 5)
                        ],
                        logo: "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2080&auto=format&fit=crop",
                        code: "AA",
                    },
                    stops: Math.floor(Math.random() * 2),
                },
            ],
            duration: 180 + Math.floor(Math.random() * 120),
            agent: {
                name: "Google Flights",
                logo: "",
            },
        }));
    };

    const sortedFlights = () => {
        if (!data) return [];

        return [...data].sort((a, b) => {
            if (sortBy === "price") {
                return (a.price?.amount || 0) - (b.price?.amount || 0);
            } else {
                return (a.duration || 0) - (b.duration || 0);
            }
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.card }}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.routeInfo}>
                    <Text style={styles.routeText}>
                        {params.originSkyId} → {params.destinationSkyId}
                    </Text>
                    <Text style={styles.dateText}>
                        {new Date(params.date as string).toLocaleDateString()}
                        {params.returnDate
                            ? ` - ${new Date(params.returnDate as string).toLocaleDateString()}`
                            : ""}
                    </Text>
                </View>
            </View>

            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setFilterModalVisible(true)}
                >
                    <Filter size={16} color={Colors.light.text} />
                    <Text style={styles.filterButtonText}>Filter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() =>
                        setSortBy(sortBy === "price" ? "duration" : "price")
                    }
                >
                    <ArrowUpDown size={16} color={Colors.light.text} />
                    <Text style={styles.sortButtonText}>
                        Sort by: {sortBy === "price" ? "Price" : "Duration"}
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.light.tint} />
                    <Text style={styles.loadingText}>Searching for the best flights...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Error loading flights. Please try again.
                    </Text>
                </View>
            ) : data && data.length > 0 ? (
                <FlatList
                    data={sortedFlights()}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <FlightCard
                            flight={item}
                            origin={originAirport}
                            destination={destinationAirport}
                        />
                    )}
                    contentContainerStyle={styles.flightsList}
                />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                        No flights found for this route and date.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.card,
    },
    header: {
        backgroundColor: Colors.light.tint,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: 10,
    },
    routeInfo: {
        alignItems: "center",
    },
    routeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
    },
    filterBar: {
        flexDirection: "row",
        padding: 12,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 20,
    },
    filterButtonText: {
        marginLeft: 4,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 20,
    },
    sortButtonText: {
        marginLeft: 4,
    },
    flightsList: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.light.secondary,
        textAlign: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: Colors.light.error,
        textAlign: "center",
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    noResultsText: {
        fontSize: 16,
        color: Colors.light.secondary,
        textAlign: "center",
    },
});