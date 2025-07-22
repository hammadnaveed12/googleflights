import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading, error } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationErrors, setValidationErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const validateForm = () => {
        let isValid = true;
        const errors = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!name) {
            errors.name = "Name is required";
            isValid = false;
        }

        if (!email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email is invalid";
            isValid = false;
        }

        if (!password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        const success = await register({
            name,
            email,
            password,
        });

        if (success) {
            Alert.alert("Success", "Account created successfully", [
                { text: "OK", onPress: () => router.replace("/(tabs)") },
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{
                        uri: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070&auto=format&fit=crop",
                    }}
                    style={styles.headerImage}
                />
                <View style={styles.overlay} />
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join Google Flights today</Text>
            </View>

            <View style={styles.formContainer}>
                {error && <Text style={styles.errorText}>{error}</Text>}

                <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                    error={validationErrors.name}
                />

                <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={validationErrors.email}
                />

                <Input
                    label="Password"
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    error={validationErrors.password}
                />

                <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    error={validationErrors.confirmPassword}
                />

                <Button
                    title="Register"
                    onPress={handleRegister}
                    loading={isLoading}
                    style={styles.registerButton}
                />

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.push("/auth/login")}>
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "white",
    },
    formContainer: {
        flex: 1,
        padding: 20,
    },
    errorText: {
        color: Colors.light.error,
        marginBottom: 16,
        textAlign: "center",
    },
    registerButton: {
        marginTop: 8,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loginText: {
        color: Colors.light.secondary,
    },
    loginLink: {
        color: Colors.light.tint,
        fontWeight: "bold",
        marginLeft: 5,
    },
});