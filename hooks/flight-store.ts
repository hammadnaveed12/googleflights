import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { Airport } from "@/types/flight";

export const [FlightContext, useFlightStore] = createContextHook(() => {
  const [recentSearches, setRecentSearches] = useState<
    {
      origin: Airport | null;
      destination: Airport | null;
      date: string | null;
      returnDate: string | null;
    }[]
  >([]);

  const [favorites, setFavorites] = useState<
    {
      origin: Airport;
      destination: Airport;
    }[]
  >([]);

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const recentSearchesJson = await AsyncStorage.getItem("recentSearches");
        const favoritesJson = await AsyncStorage.getItem("favorites");

        if (recentSearchesJson) {
          setRecentSearches(JSON.parse(recentSearchesJson));
        }

        if (favoritesJson) {
          setFavorites(JSON.parse(favoritesJson));
        }
      } catch (error) {
        console.error("Error loading flight data:", error);
      }
    };

    loadData();
  }, []);

  const addRecentSearch = async (
    origin: Airport | null,
    destination: Airport | null,
    date: string | null,
    returnDate: string | null
  ) => {
    if (!origin || !destination) return;

    const newSearch = { origin, destination, date, returnDate };
    const updatedSearches = [
      newSearch,
      ...recentSearches.filter(
        (search) =>
          !(
            search.origin?.skyId === origin.skyId &&
            search.destination?.skyId === destination.skyId
          )
      ),
    ].slice(0, 5); // Keep only the 5 most recent searches

    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedSearches)
    );
  };

  const toggleFavorite = async (origin: Airport, destination: Airport) => {
    const isFavorite = favorites.some(
      (fav) =>
        fav.origin.skyId === origin.skyId &&
        fav.destination.skyId === destination.skyId
    );

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(
        (fav) =>
          !(
            fav.origin.skyId === origin.skyId &&
            fav.destination.skyId === destination.skyId
          )
      );
    } else {
      updatedFavorites = [...favorites, { origin, destination }];
    }

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (originSkyId: string, destinationSkyId: string) => {
    return favorites.some(
      (fav) =>
        fav.origin.skyId === originSkyId &&
        fav.destination.skyId === destinationSkyId
    );
  };

  return {
    recentSearches,
    favorites,
    addRecentSearch,
    toggleFavorite,
    isFavorite,
  };
});
