const CITY_COORDINATES: Record<string, { latitude: number; longitude: number; region: string }> = {
  douala: { latitude: 4.0511, longitude: 9.7679, region: "Littoral" },
  yaounde: { latitude: 3.8667, longitude: 11.5167, region: "Centre" },
  "yaoundé": { latitude: 3.8667, longitude: 11.5167, region: "Centre" },
  bafoussam: { latitude: 5.4778, longitude: 10.4176, region: "Ouest" },
  garoua: { latitude: 9.3265, longitude: 13.3958, region: "Nord" },
  bamenda: { latitude: 5.9631, longitude: 10.1591, region: "Nord-Ouest" },
  buea: { latitude: 4.155, longitude: 9.241, region: "Sud-Ouest" },
  ngaoundere: { latitude: 7.3277, longitude: 13.5847, region: "Adamaoua" },
  "ngaoundéré": { latitude: 7.3277, longitude: 13.5847, region: "Adamaoua" },
  maroua: { latitude: 10.591, longitude: 14.3159, region: "Extrême-Nord" },
  bertoua: { latitude: 4.577, longitude: 13.6846, region: "Est" },
  ebolowa: { latitude: 2.9, longitude: 11.15, region: "Sud" },
};

function normalizeCityKey(city: string): string {
  return city.trim().toLowerCase();
}

export function regionForCity(city: string): string | null {
  return CITY_COORDINATES[normalizeCityKey(city)]?.region ?? null;
}

export function coordinatesForCity(city: string): { latitude: number; longitude: number } {
  return CITY_COORDINATES[normalizeCityKey(city)] ?? CITY_COORDINATES.yaounde;
}

export function normalizeCameroonPhone(value: string): string {
  const compact = value.replace(/[\s.-]/g, "");
  if (compact.startsWith("+237")) return compact;
  if (compact.startsWith("237")) return `+${compact}`;
  if (compact.startsWith("6") || compact.startsWith("2")) return `+237${compact}`;
  return compact;
}

export function isCameroonPhone(value: string): boolean {
  return /^\+237[26]\d{8}$/.test(value);
}

export async function resolvePharmacyCoordinates(
  city: string,
): Promise<{ latitude: number; longitude: number }> {
  const fallback = coordinatesForCity(city);

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return fallback;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => resolve(fallback),
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 60_000 },
    );
  });
}
