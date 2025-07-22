import { useRouter } from "expo-router";
import { Bell, CreditCard, Heart, HelpCircle, LogOut, Settings, Ticket, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        if (!isLoading && !user && !isNavigating) {
            setIsNavigating(true);
            setTimeout(() => {
                router.replace("/auth/login");
            }, 100);
        }
    }, [user, isLoading, router, isNavigating]);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        await logout();
                        router.replace("/auth/login");
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImage}>
                            <User size={40} color={Colors.light.tint} />
                        </View>
                    </View>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Flights</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Miles</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <User size={20} color={Colors.light.secondary} />
                            <Text style={styles.menuItemText}>Personal Information</Text>
                        </View>
                        <Text style={styles.menuItemRight}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <CreditCard size={20} color={Colors.light.secondary} />
                            <Text style={styles.menuItemText}>Payment Methods</Text>
                        </View>
                        <Text style={styles.menuItemRight}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ticket size={20} color={Colors.light.secondary} />
                            <Text style={styles.menuItemText}>Travel Documents</Text>
                        </View>
                        <Text style={styles.menuItemRight}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Bell size={20} color={Colors.light.secondary} />
                            <Text style={styles.menuItemText}>Notifications</Text>
                        </View>
                        <Text style={styles.menuItemRight}>On</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Heart size={20} color={Colors.light.secondary} />
                            <Text style={styles.menuItemText}>Saved Routes</Text>
                        </View>
                        <Text style={styles.menuItemRight}>{`${0} saved`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Settings size={20} color={Colors.light.secondary} />
                            <Text style={styles.menuItemText}>App Settings</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <HelpCircle size={20} color={Colors.light.secondary} />
                            <Text style={styles.menuItemText}>Help Center</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <LogOut size={20} color={Colors.light.error} />
                            <Text style={[styles.menuItemText, { color: Colors.light.error }]}>
                                Logout
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="outline"
                        style={styles.logoutButton}
                    />
                    <Text style={styles.versionText}>Google Flights v1.0.0</Text>
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
        backgroundColor: Colors.light.tint,
        padding: 20,
        alignItems: "center",
    },
    profileImageContainer: {
        marginBottom: 16,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 12,
        padding: 16,
        width: "100%",
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    statLabel: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
    },
    statDivider: {
        width: 1,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    section: {
        padding: 16,
        borderBottomWidth: 8,
        borderBottomColor: Colors.light.card,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 12,
    },
    menuItemRight: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
    footer: {
        padding: 16,
        alignItems: "center",
    },
    logoutButton: {
        marginBottom: 16,
    },
    versionText: {
        fontSize: 14,
        color: Colors.light.secondary,
    },
});