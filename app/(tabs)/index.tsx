import { useRouter } from "expo-router";
import { ChevronRight, Plane } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { getPopularDestinations, PopularDestination } from "@/api/skyScrapperApi";
import AirportSearchInput from "@/components/AirportSearchInput";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { useFlightStore } from "@/hooks/flight-store";
import { Airport } from "@/types/flight";

export default function HomeScreen() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const { recentSearches, favorites, addRecentSearch } = useFlightStore();

    const [origin, setOrigin] = useState<Airport | null>(null);
    const [destination, setDestination] = useState<Airport | null>(null);
    const [departureDate, setDepartureDate] = useState<string | null>(null);
    const [returnDate, setReturnDate] = useState<string | null>(null);
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [popularDestinations, setPopularDestinations] = useState<PopularDestination[]>([]);
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);

    useEffect(() => {
        if (!isLoading && !user && !isNavigating) {
            setIsNavigating(true);

            setTimeout(() => {
                router.replace("/auth/login");
            }, 100);
        }
    }, [user, isLoading, router, isNavigating]);

    useEffect(() => {
        const fetchPopularDestinations = async () => {
            try {
                setIsLoadingDestinations(true);
                const destinations = await getPopularDestinations();
                setPopularDestinations(destinations);
            } catch (error) {
                console.error("Error fetching popular destinations:", error);
                // Fallback to empty array if API fails
                setPopularDestinations([]);
            } finally {
                setIsLoadingDestinations(false);
            }
        };

        fetchPopularDestinations();
    }, []);

    const handleSearch = () => {
        if (!origin || !destination || !departureDate) {
            return;
        }

        // Add to recent searches immediately when search is initiated
        addRecentSearch(origin, destination, departureDate, isRoundTrip ? returnDate : null);

        router.push({
            pathname: "/flight/search-results",
            params: {
                originSkyId: origin.skyId,
                destinationSkyId: destination.skyId,
                originEntityId: origin.navigation.entityId,
                destinationEntityId: destination.navigation.entityId,
                originTitle: origin.presentation.title,
                destinationTitle: destination.presentation.title,
                originSubtitle: origin.presentation.subtitle,
                destinationSubtitle: destination.presentation.subtitle,
                date: departureDate,
                returnDate: isRoundTrip ? returnDate : undefined,
            },
        });
    };

    const handleRecentSearch = (search: {
        origin: Airport | null;
        destination: Airport | null;
        date: string | null;
        returnDate: string | null;
    }) => {
        setOrigin(search.origin);
        setDestination(search.destination);
        setDepartureDate(search.date);
        setReturnDate(search.returnDate);
        setIsRoundTrip(!!search.returnDate);
    };

    const handleFavoriteSelect = (favorite: {
        origin: Airport;
        destination: Airport;
    }) => {
        setOrigin(favorite.origin);
        setDestination(favorite.destination);
    };

    const handleDestinationSelect = (destination: PopularDestination) => {
        // Create a mock airport object for the selected destination
        const destinationAirport: Airport = {
            skyId: destination.airportCode,
            entityId: destination.airportCode,
            presentation: {
                title: `${destination.name} (${destination.airportCode})`,
                suggestionTitle: destination.name,
                subtitle: destination.country,
            },
            navigation: {
                entityId: destination.airportCode,
                entityType: "AIRPORT",
                localizedName: destination.name,
                relevantFlightParams: {
                    skyId: destination.airportCode,
                    entityId: destination.airportCode,
                    flightPlaceType: "AIRPORT",
                    localizedName: destination.name,
                },
                relevantHotelParams: {
                    entityId: destination.airportCode,
                    entityType: "CITY",
                    localizedName: destination.city,
                },
            },
        };

        setDestination(destinationAirport);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Image
                    source={{
                        uri: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070&auto=format&fit=crop",
                    }}
                    style={styles.headerImage}
                />
                <View style={styles.overlay} />
                <Text style={styles.welcomeText}>Welcome, {user.name}</Text>
                <Text style={styles.headerTitle}>Where would you like to fly today?</Text>
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

            {recentSearches.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    {recentSearches.map((search: any, index: any) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.recentSearchItem}
                            onPress={() => handleRecentSearch(search)}
                        >
                            <View style={styles.recentSearchInfo}>
                                <View style={styles.recentSearchRoute}>
                                    <Text style={styles.recentSearchCity}>
                                        {search.origin?.presentation.title}
                                    </Text>
                                    <Plane size={16} color={Colors.light.secondary} style={styles.planeIcon} />
                                    <Text style={styles.recentSearchCity}>
                                        {search.destination?.presentation.title}
                                    </Text>
                                </View>
                                <Text style={styles.recentSearchDate}>
                                    {search.date ? new Date(search.date).toLocaleDateString() : ""}
                                    {search.returnDate
                                        ? ` - ${new Date(search.returnDate).toLocaleDateString()}`
                                        : ""}
                                </Text>
                            </View>
                            <ChevronRight size={20} color={Colors.light.secondary} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {favorites.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Favorite Routes</Text>
                    {favorites.map((favorite: any, index: any) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.favoriteItem}
                            onPress={() => handleFavoriteSelect(favorite)}
                        >
                            <View style={styles.favoriteInfo}>
                                <Text style={styles.favoriteCity}>
                                    {favorite.origin.presentation.title}
                                </Text>
                                <Plane size={16} color={Colors.light.tint} style={styles.planeIcon} />
                                <Text style={styles.favoriteCity}>
                                    {favorite.destination.presentation.title}
                                </Text>
                            </View>
                            <ChevronRight size={20} color={Colors.light.secondary} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Popular Destinations</Text>
                {isLoadingDestinations ? (
                    <View style={styles.loadingDestinations}>
                        <Text style={styles.loadingText}>Loading destinations...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={popularDestinations}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.destinationCard}
                                onPress={() => handleDestinationSelect(item)}
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.destinationImage}
                                />
                                <View style={styles.destinationInfo}>
                                    <Text style={styles.destinationName}>{item.name}</Text>
                                    <Text style={styles.destinationPrice}>From {item.price}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.airportCode}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.destinationList}
                    />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    contentContainer: {
        paddingBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    loadingText: {
        fontSize: 16,
        color: Colors.light.secondary,
    },
    header: {
        height: 200,
        justifyContent: "flex-end",
        padding: 20,
    },
    headerImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    welcomeText: {
        fontSize: 16,
        color: "white",
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
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
    section: {
        padding: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    recentSearchItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    recentSearchInfo: {
        flex: 1,
    },
    recentSearchRoute: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    recentSearchCity: {
        fontSize: 16,
        fontWeight: "500",
    },
    planeIcon: {
        marginHorizontal: 8,
        transform: [{ rotate: "45deg" }],
    },
    recentSearchDate: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    favoriteItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    favoriteInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    favoriteCity: {
        fontSize: 16,
        fontWeight: "500",
    },
    destinationCard: {
        width: 160,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginRight: 12,
    },
    destinationImage: {
        width: "100%",
        height: "100%",
    },
    destinationInfo: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    destinationName: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    destinationPrice: {
        color: "white",
        fontSize: 14,
    },
    destinationList: {
        paddingHorizontal: 12,
    },
    loadingDestinations: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
});