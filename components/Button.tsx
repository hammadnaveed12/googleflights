import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

import Colors from "@/constants/colors";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "outline";
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function Button({
    title,
    onPress,
    variant = "primary",
    disabled = false,
    loading = false,
    style,
    textStyle,
}: ButtonProps) {
    const getButtonStyle = () => {
        if (disabled) return [styles.button, styles.disabled, style];

        switch (variant) {
            case "secondary":
                return [styles.button, styles.secondaryButton, style];
            case "outline":
                return [styles.button, styles.outlineButton, style];
            default:
                return [styles.button, styles.primaryButton, style];
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case "outline":
                return [styles.buttonText, styles.outlineButtonText, textStyle];
            case "secondary":
                return [styles.buttonText, styles.secondaryButtonText, textStyle];
            default:
                return [styles.buttonText, styles.primaryButtonText, textStyle];
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                ...getButtonStyle(),
                pressed && !disabled ? styles.pressed : null,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === "outline" ? Colors.light.tint : "white"}
                    size="small"
                />
            ) : (
                <Text style={getTextStyle()}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
    },
    primaryButton: {
        backgroundColor: Colors.light.tint,
    },
    secondaryButton: {
        backgroundColor: Colors.light.secondary,
    },
    outlineButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: Colors.light.tint,
    },
    disabled: {
        backgroundColor: Colors.light.border,
    },
    pressed: {
        opacity: 0.8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    primaryButtonText: {
        color: "white",
    },
    secondaryButtonText: {
        color: "white",
    },
    outlineButtonText: {
        color: Colors.light.tint,
    },
});