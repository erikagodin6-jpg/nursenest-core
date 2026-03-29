export type CountryMode = "CA" | "US";
export type UnitMode = "metric" | "imperial";

export function getDefaultUnitMode(country: CountryMode): UnitMode {
  return country === "CA" ? "metric" : "imperial";
}

export function convertTemp(celsius: number, mode: UnitMode): string {
  if (mode === "imperial") {
    return `${((celsius * 9) / 5 + 32).toFixed(1)}°F`;
  }
  return `${celsius.toFixed(1)}°C`;
}

export function convertWeight(kg: number, mode: UnitMode): string {
  if (mode === "imperial") {
    return `${(kg * 2.20462).toFixed(1)} lb`;
  }
  return `${kg.toFixed(1)} kg`;
}

export function convertGlucose(mmolL: number, mode: UnitMode): string {
  if (mode === "imperial") {
    return `${Math.round(mmolL * 18)} mg/dL`;
  }
  return `${mmolL.toFixed(1)} mmol/L`;
}

export function convertCreatinine(umolL: number, mode: UnitMode): string {
  if (mode === "imperial") {
    return `${(umolL / 88.4).toFixed(2)} mg/dL`;
  }
  return `${Math.round(umolL)} µmol/L`;
}

export function convertHemoglobin(gL: number, mode: UnitMode): string {
  if (mode === "imperial") {
    return `${(gL / 10).toFixed(1)} g/dL`;
  }
  return `${Math.round(gL)} g/L`;
}

export function formatBP(systolic: number, diastolic: number): string {
  return `${systolic}/${diastolic} mmHg`;
}

export function formatHR(hr: number): string {
  return `${hr} bpm`;
}

export function formatRR(rr: number): string {
  return `${rr}/min`;
}

export function formatSpO2(spo2: number): string {
  return `${spo2}%`;
}
