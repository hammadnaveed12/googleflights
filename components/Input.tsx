import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";

import Colors from "@/constants/colors";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export default function Input({
    label,
    error,
    containerStyle,
    value,
    onChangeText,
    secureTextEntry,
    ...rest
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.focusedInput,
                    error && styles.errorInput,
                ]}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                secureTextEntry={secureTextEntry}
                placeholderTextColor={Colors.light.placeholder}
                {...rest}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: "100%",
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: Colors.light.text,
        fontWeight: "500",
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: "white",
    },
    focusedInput: {
        borderColor: Colors.light.tint,
    },
    errorInput: {
        borderColor: Colors.light.error,
    },
    errorText: {
        color: Colors.light.error,
        fontSize: 12,
        marginTop: 4,
    },
});