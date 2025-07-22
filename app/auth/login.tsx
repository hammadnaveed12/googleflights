import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: "",
      password: "",
    };

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
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const success = await login({ email, password });
    if (success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again. For demo, use email: demo@example.com and password: password"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
          }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <Text style={styles.title}>Welcome to Google Flights</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.formContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}

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
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={validationErrors.password}
        />

        <Button
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.loginButton}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={styles.registerLink}>Register</Text>
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
  loginButton: {
    marginTop: 8,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: Colors.light.secondary,
  },
  registerLink: {
    color: Colors.light.tint,
    fontWeight: "bold",
    marginLeft: 5,
  },
  demoContainer: {
    marginTop: 40,
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    alignItems: "center",
  },
  demoText: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  demoCredentials: {
    color: Colors.light.secondary,
  },
});
