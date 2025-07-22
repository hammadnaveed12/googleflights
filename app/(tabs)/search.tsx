import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { searchAirport } from "@/api/skyScrapperApi";
import AirportSearchInput from "@/components/AirportSearchInput";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Colors from "@/constants/colors";
import { useFlightStore } from "@/hooks/flight-store";
import { Airport } from "@/types/flight";

export default function SearchScreen() {
    const router = useRouter();
    const { addRecentSearch } = useFlightStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [origin, setOrigin] = useState<Airport | null>(null);
    const [destination, setDestination] = useState<Airport | null>(null);
    const [departureDate, setDepartureDate] = useState<string | null>(null);
    const [returnDate, setReturnDate] = useState<string | null>(null);
    const [isRoundTrip, setIsRoundTrip] = useState(false);

    const { data: searchResults, isLoading } = useQuery({
        queryKey: ["airportSearch", searchQuery],
        queryFn: () => searchAirport(searchQuery),
        enabled: searchQuery.length > 2,
    });

    const handleSearch = () => {
        if (!origin || !destination || !departureDate) {
            return;
        }

        addRecentSearch(origin, destination, departureDate, isRoundTrip ? returnDate : null);

        router.push({
            pathname: "/flight/search-results",
            params: {
                originSkyId: origin.skyId,
                destinationSkyId: destination.skyId,
                originEntityId: origin.navigation.entityId,
                destinationEntityId: destination.navigation.entityId,
                date: departureDate,
                returnDate: isRoundTrip ? returnDate : undefined,
            },
        });
    };

    const handleAirportSelect = (airport: Airport) => {
        if (!origin) {
            setOrigin(airport);
        } else if (!destination) {
            setDestination(airport);
        }
        setSearchQuery("");
    };

    const handlePopularRouteSelect = (route: { from: string; to: string; fromCode: string; toCode: string }) => {
        // Create mock airport objects for the popular routes
        const originAirport: Airport = {
            skyId: route.fromCode,
            entityId: route.fromCode,
            presentation: {
                title: route.from,
                suggestionTitle: route.from,
                subtitle: "Popular Route",
            },
            navigation: {
                entityId: route.fromCode,
                entityType: "AIRPORT",
                localizedName: route.from,
                relevantFlightParams: {
                    skyId: route.fromCode,
                    entityId: route.fromCode,
                    flightPlaceType: "AIRPORT",
                    localizedName: route.from,
                },
                relevantHotelParams: {
                    entityId: route.fromCode,
                    entityType: "CITY",
                    localizedName: route.from,
                },
            },
        };

        const destinationAirport: Airport = {
            skyId: route.toCode,
            entityId: route.toCode,
            presentation: {
                title: route.to,
                suggestionTitle: route.to,
                subtitle: "Popular Route",
            },
            navigation: {
                entityId: route.toCode,
                entityType: "AIRPORT",
                localizedName: route.to,
                relevantFlightParams: {
                    skyId: route.toCode,
                    entityId: route.toCode,
                    flightPlaceType: "AIRPORT",
                    localizedName: route.to,
                },
                relevantHotelParams: {
                    entityId: route.toCode,
                    entityType: "CITY",
                    localizedName: route.to,
                },
            },
        };

        setOrigin(originAirport);
        setDestination(destinationAirport);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.searchHeader}>
                    <Text style={styles.title}>Search Flights</Text>
                    <Text style={styles.subtitle}>Find the best deals for your journey</Text>
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.tripTypeContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tripTypeButton,
                                !isRoundTrip && styles.tripTypeButtonActive,
                            ]}
                            onPress={() => setIsRoundTrip(false)}
                        >
                            <Text
                                style={[
                                    styles.tripTypeText,
                                    !isRoundTrip && styles.tripTypeTextActive,
                                ]}
                            >
                                One Way
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.tripTypeButton,
                                isRoundTrip && styles.tripTypeButtonActive,
                            ]}
                            onPress={() => setIsRoundTrip(true)}
                        >
                            <Text
                                style={[
                                    styles.tripTypeText,
                                    isRoundTrip && styles.tripTypeTextActive,
                                ]}
                            >
                                Round Trip
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <AirportSearchInput
                        label="From"
                        placeholder="Select departure airport"
                        onSelect={setOrigin}
                        selectedAirport={origin}
                    />

                    <AirportSearchInput
                        label="To"
                        placeholder="Select destination airport"
                        onSelect={setDestination}
                        selectedAirport={destination}
                    />

                    <DatePicker
                        label="Departure Date"
                        date={departureDate}
                        onSelect={setDepartureDate}
                    />

                    {isRoundTrip && (
                        <DatePicker
                            label="Return Date"
                            date={returnDate}
                            onSelect={setReturnDate}
                            minDate={departureDate || undefined}
                        />
                    )}

                    <Button
                        title="Search Flights"
                        onPress={handleSearch}
                        disabled={!origin || !destination || !departureDate || (isRoundTrip && !returnDate)}
                        style={styles.searchButton}
                    />
                </View>



                <View style={styles.popularSection}>
                    <Text style={styles.sectionTitle}>Popular Routes</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity style={styles.popularRoute} onPress={() => handlePopularRouteSelect({ from: "New York", to: "London", fromCode: "NYC", toCode: "LON" })}>
                            <Text style={styles.routeText}>New York → London</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popularRoute} onPress={() => handlePopularRouteSelect({ from: "Los Angeles", to: "Tokyo", fromCode: "LAX", toCode: "TYO" })}>
                            <Text style={styles.routeText}>Los Angeles → Tokyo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popularRoute} onPress={() => handlePopularRouteSelect({ from: "Chicago", to: "Paris", fromCode: "ORD", toCode: "CDG" })}>
                            <Text style={styles.routeText}>Chicago → Paris</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popularRoute} onPress={() => handlePopularRouteSelect({ from: "Miami", to: "Cancun", fromCode: "MIA", toCode: "CUN" })}>
                            <Text style={styles.routeText}>Miami → Cancun</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    contentContainer: {
        paddingBottom: 24,
    },
    searchHeader: {
        padding: 20,
        backgroundColor: Colors.light.tint,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "white",
    },
    searchContainer: {
        padding: 16,
        backgroundColor: "white",
        borderRadius: 12,
        margin: 16,
        marginTop: -20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tripTypeContainer: {
        flexDirection: "row",
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
        overflow: "hidden",
    },
    tripTypeButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: "white",
    },
    tripTypeButtonActive: {
        backgroundColor: Colors.light.tint,
    },
    tripTypeText: {
        color: Colors.light.secondary,
        fontWeight: "500",
    },
    tripTypeTextActive: {
        color: "white",
    },
    searchButton: {
        marginTop: 8,
    },
    quickSearchSection: {
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    searchInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    quickSearchInput: {
        flex: 1,
        marginRight: 8,
        marginBottom: 0,
    },
    loadingText: {
        textAlign: "center",
        padding: 12,
        color: Colors.light.secondary,
    },
    resultsContainer: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 8,
    },
    resultItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: "500",
    },
    resultSubtitle: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    airportCode: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.light.tint,
    },
    noResults: {
        textAlign: "center",
        padding: 12,
        color: Colors.light.secondary,
    },
    popularSection: {
        padding: 16,
    },
    popularRoute: {
        backgroundColor: Colors.light.card,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    routeText: {
        fontWeight: "500",
    },
});
