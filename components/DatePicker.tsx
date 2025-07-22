import { Calendar } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";

import Colors from "@/constants/colors";

interface DatePickerProps {
    label: string;
    date: string | null;
    onSelect: (date: string) => void;
    minDate?: string;
}

export default function DatePicker({ label, date, onSelect, minDate }: DatePickerProps) {
    const [showCalendar, setShowCalendar] = useState(false);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Select date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleDateSelect = (day: any) => {
        const selectedDate = new Date(day.timestamp);
        onSelect(selectedDate.toISOString().split("T")[0]);
        setShowCalendar(false);
    };

    const getMarkedDates = () => {
        if (!date) return {};
        return {
            [date]: {
                selected: true,
                selectedColor: Colors.light.tint,
            },
        };
    };

    const getMinDate = () => {
        if (minDate) return minDate;
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowCalendar(!showCalendar)}
            >
                <Text style={styles.dateText}>{date ? formatDate(date) : "Select date"}</Text>
                <Calendar size={20} color={Colors.light.secondary} />
            </TouchableOpacity>

            {showCalendar && (
                <View style={styles.calendarOverlay}>
                    <View style={styles.calendarContainer}>
                        <RNCalendar
                            onDayPress={handleDateSelect}
                            markedDates={getMarkedDates()}
                            minDate={getMinDate()}
                            theme={{
                                backgroundColor: "white",
                                calendarBackground: "white",
                                textSectionTitleColor: Colors.light.text,
                                selectedDayBackgroundColor: Colors.light.tint,
                                selectedDayTextColor: "white",
                                todayTextColor: Colors.light.tint,
                                dayTextColor: Colors.light.text,
                                textDisabledColor: Colors.light.secondary,
                                dotColor: Colors.light.tint,
                                selectedDotColor: "white",
                                arrowColor: Colors.light.tint,
                                monthTextColor: Colors.light.text,
                                indicatorColor: Colors.light.tint,
                                textDayFontWeight: "300",
                                textMonthFontWeight: "bold",
                                textDayHeaderFontWeight: "500",
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 14,
                            }}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: Colors.light.text,
        fontWeight: "500",
    },
    dateButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 48,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "white",
    },
    dateText: {
        fontSize: 16,
        color: Colors.light.text,
    },
    calendarContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: "hidden",
        maxWidth: Dimensions.get('window').width - 32,
        maxHeight: 400,
    },
    calendarOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
        elevation: 999999,
    },
});