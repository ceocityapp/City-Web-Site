"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { City } from "@/types";
import { cities, getCityBySlug } from "@/lib/cities";

interface CityContextType {
  selectedCity: City | null;
  setSelectedCity: (city: City) => void;
  clearCity: () => void;
  allCities: City[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<City | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after first render (state-during-render pattern)
  // SSR returns null → client hydrates → then we read storage.
  if (!hydrated && typeof window !== "undefined") {
    setHydrated(true);
    try {
      const stored = localStorage.getItem("city-web-selected-city");
      const city = stored ? getCityBySlug(stored) : getCityBySlug("huesca");
      if (city) setSelectedCityState(city);
    } catch {
      /* noop */
    }
  }

  const setSelectedCity = (city: City) => {
    setSelectedCityState(city);
    localStorage.setItem("city-web-selected-city", city.slug);
  };

  const clearCity = () => {
    setSelectedCityState(null);
    localStorage.removeItem("city-web-selected-city");
  };

  return (
    <CityContext.Provider
      value={{ selectedCity, setSelectedCity, clearCity, allCities: cities }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}
