/**
 * Utility to fetch nearby hospitals and clinics using the Overpass API.
 */

export interface Hospital {
  id: number;
  lat: number;
  lon: number;
  name: string;
  address?: string;
  type: "hospital" | "clinic";
}

export async function fetchNearbyHospitals(lat: number, lng: number, radiusMeters: number = 5000): Promise<Hospital[]> {
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
    );
    out center;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }
    const data = await response.json();
    
    return (data.elements || []).map((element: any) => {
      const name = element.tags?.name || "Unnamed Medical Center";
      const brand = element.tags?.brand || "";
      const fullName = brand ? `${brand} - ${name}` : name;
      
      return {
        id: element.id,
        lat: element.center ? element.center.lat : element.lat,
        lon: element.center ? element.center.lon : element.lon,
        name: fullName,
        address: element.tags?.["addr:street"] 
          ? `${element.tags["addr:housenumber"] || ""} ${element.tags["addr:street"]}`.trim()
          : element.tags?.["addr:full"] || "Address not available",
        type: element.tags?.amenity === "clinic" ? "clinic" : "hospital"
      };
    });
  } catch (error) {
    console.error("Failed to fetch hospitals from Overpass:", error);
    return [];
  }
}
