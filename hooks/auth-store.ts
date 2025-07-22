import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/auth";

// Mock user
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    createdAt: new Date().toISOString(),
  },
];

export const [AuthContext, useAuth] = createContextHook(() => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          setState({
            user: JSON.parse(userJson),
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: "Failed to load user data",
        });
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState({ ...state, isLoading: true, error: null });

      const user = MOCK_USERS.find((u) => u.email === credentials.email);

      if (user && credentials.password === "password") {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setState({
          user,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setState({
          ...state,
          isLoading: false,
          error: "Invalid email or password",
        });
        return false;
      }
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: "Login failed. Please try again.",
      });
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setState({ ...state, isLoading: true, error: null });

      const existingUser = MOCK_USERS.find(
        (u) => u.email === credentials.email
      );
      if (existingUser) {
        setState({
          ...state,
          isLoading: false,
          error: "Email already in use",
        });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: (MOCK_USERS.length + 1).toString(),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date().toISOString(),
      };

      MOCK_USERS.push(newUser);

      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      setState({
        user: newUser,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: "Registration failed. Please try again.",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
  };
});
