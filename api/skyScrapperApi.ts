import { Airport, FlightItinerary, FlightSearchParams } from "@/types/flight";

const BASE_URL = "https://sky-scrapper.p.rapidapi.com/api/v1/flights";

const headers = {
  "X-RapidAPI-Key": process.env.EXPO_PUBLIC_RAPID_API_KEY || "",
  "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
  "Content-Type": "application/json",
};

export interface PopularDestination {
  name: string;
  city: string;
  country: string;
  airportCode: string;
  image: string;
  price: string;
}

export async function getPopularDestinations(): Promise<PopularDestination[]> {
  try {
    const popularDestinations: PopularDestination[] = [
      {
        name: "New York",
        city: "New York",
        country: "United States",
        airportCode: "JFK",
        image:
          "https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?q=80&w=1974&auto=format&fit=crop",
        price: "$199",
      },
      {
        name: "Paris",
        city: "Paris",
        country: "France",
        airportCode: "CDG",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
        price: "$399",
      },
      {
        name: "Tokyo",
        city: "Tokyo",
        country: "Japan",
        airportCode: "NRT",
        image:
          "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop",
        price: "$599",
      },
      {
        name: "London",
        city: "London",
        country: "United Kingdom",
        airportCode: "LHR",
        image:
          "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop",
        price: "$349",
      },
      {
        name: "Dubai",
        city: "Dubai",
        country: "United Arab Emirates",
        airportCode: "DXB",
        image:
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
        price: "$499",
      },
      {
        name: "Singapore",
        city: "Singapore",
        country: "Singapore",
        airportCode: "SIN",
        image:
          "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2070&auto=format&fit=crop",
        price: "$449",
      },
    ];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(popularDestinations);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching popular destinations:", error);
    throw error;
  }
}

export async function searchAirport(query: string): Promise<Airport[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/searchAirport?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching airports:", error);
    throw error;
  }
}

export async function getNearByAirports(
  lat: number,
  lng: number
): Promise<Airport[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/getNearByAirports?lat=${lat}&lng=${lng}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.nearby || [];
  } catch (error) {
    console.error("Error getting nearby airports:", error);
    throw error;
  }
}

export async function searchFlights(
  params: FlightSearchParams
): Promise<FlightItinerary[]> {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${BASE_URL}/searchFlights?${queryParams.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.itineraries || [];
  } catch (error) {
    console.error("Error searching flights:", error);
    throw error;
  }
}
