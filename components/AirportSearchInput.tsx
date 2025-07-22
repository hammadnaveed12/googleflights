import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { searchAirport } from "@/api/skyScrapperApi";
import Colors from "@/constants/colors";
import { Airport } from "@/types/flight";
import Input from "./Input";

interface AirportSearchInputProps {
    label: string;
    placeholder: string;
    onSelect: (airport: Airport) => void;
    selectedAirport: Airport | null;
}

export default function AirportSearchInput({
    label,
    placeholder,
    onSelect,
    selectedAirport,
}: AirportSearchInputProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [showResults, setShowResults] = useState(false);

    // Debounce the search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["airports", debouncedQuery],
        queryFn: () => searchAirport(debouncedQuery),
        enabled: debouncedQuery.length > 2 && showResults,
        retry: 1,
        retryDelay: 2000,
    });

    const handleSelectAirport = (airport: Airport) => {
        onSelect(airport);
        setShowResults(false);
        setSearchQuery("");
    };

    const getErrorMessage = (error: any) => {
        if (error?.message?.includes('429')) {
            return "Too many requests. Please wait a moment and try again.";
        }
        return "Error loading airports. Please try again.";
    };

    return (
        <View style={styles.container}>
            {selectedAirport ? (
                <View style={styles.selectedContainer}>
                    <View>
                        <Text style={styles.label}>{label}</Text>
                        <Text style={styles.selectedTitle}>{selectedAirport.presentation.title}</Text>
                        <Text style={styles.selectedSubtitle}>
                            {selectedAirport.presentation.subtitle}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => {
                            onSelect(null as any);
                            setShowResults(true);
                        }}
                    >
                        <Text style={styles.changeButtonText}>Change</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Input
                        label={label}
                        placeholder={placeholder}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text.length > 2) {
                                setShowResults(true);
                            } else {
                                setShowResults(false);
                            }
                        }}
                        onFocus={() => {
                            if (searchQuery.length > 2) {
                                setShowResults(true);
                            }
                        }}
                    />

                    {showResults && searchQuery.length > 2 && (
                        <View style={styles.resultsContainer}>
                            {isLoading ? (
                                <ActivityIndicator color={Colors.light.tint} style={styles.loader} />
                            ) : error ? (
                                <Text style={styles.errorText}>{getErrorMessage(error)}</Text>
                            ) : data && data.length > 0 ? (
                                <ScrollView style={styles.resultsList} nestedScrollEnabled={true}>
                                    {data.map((item) => (
                                        <TouchableOpacity
                                            key={item.skyId}
                                            style={styles.resultItem}
                                            onPress={() => handleSelectAirport(item)}
                                        >
                                            <Text style={styles.resultTitle}>
                                                {item.presentation.title}
                                            </Text>
                                            <Text style={styles.resultSubtitle}>
                                                {item.presentation.subtitle}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <Text style={styles.noResults}>No airports found</Text>
                            )}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    selectedContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        backgroundColor: Colors.light.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    label: {
        fontSize: 12,
        color: Colors.light.secondary,
        marginBottom: 4,
    },
    selectedTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.light.text,
    },
    selectedSubtitle: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    changeButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: Colors.light.tint,
        borderRadius: 4,
    },
    changeButtonText: {
        color: "white",
        fontWeight: "500",
        fontSize: 14,
    },
    resultsContainer: {
        position: "absolute",
        top: 90,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
        zIndex: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    resultsList: {
        maxHeight: 200,
    },
    resultItem: {
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
    loader: {
        padding: 20,
    },
    errorText: {
        padding: 12,
        color: Colors.light.error,
        textAlign: "center",
    },
    noResults: {
        padding: 12,
        textAlign: "center",
        color: Colors.light.secondary,
    },
});