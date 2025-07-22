export interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
  navigation: {
    entityId: string;
    entityType: string;
    localizedName: string;
    relevantFlightParams: {
      skyId: string;
      entityId: string;
      flightPlaceType: string;
      localizedName: string;
    };
    relevantHotelParams: {
      entityId: string;
      entityType: string;
      localizedName: string;
    };
  };
}

export interface FlightSearchParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
  adults?: number;
  cabinClass?: string;
  sortBy?: string;
  childrens?: number;
  infants?: number;
  currency?: string;
  market?: string;
  countryCode?: string;
}

export interface FlightItinerary {
  id: string;
  price: {
    amount: number;
    currency: string;
  };
  legs: FlightLeg[];
  agent: {
    name: string;
    logo: string;
  };
  duration: number;
}

export interface FlightLeg {
  id: string;
  departure: {
    airport: {
      name: string;
      code: string;
    };
    time: string;
  };
  arrival: {
    airport: {
      name: string;
      code: string;
    };
    time: string;
  };
  duration: number;
  airline: {
    name: string;
    logo: string;
    code: string;
  };
  stops: number;
  stopDetails?: {
    airport: {
      name: string;
      code: string;
    };
    duration: number;
  }[];
}
