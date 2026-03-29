import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { type Region } from "@shared/constants";

export function useRegion(): Region {
  const { user } = useAuth();

  const [localRegion, setLocalRegion] = useState<Region>(() => {
    return (localStorage.getItem("nursenest-region") as Region) || "US";
  });

  useEffect(() => {
    const handler = () => {
      setLocalRegion((localStorage.getItem("nursenest-region") as Region) || "US");
    };
    window.addEventListener("regionChange", handler);
    return () => window.removeEventListener("regionChange", handler);
  }, []);

  if (user?.region && (user.region === "US" || user.region === "CA")) {
    return user.region as Region;
  }

  return localRegion;
}
