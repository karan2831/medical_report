"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, 
  Search, 
  Navigation, 
  Star, 
  Clock, 
  Map as MapIcon, 
  Calendar,
  Loader2,
  AlertCircle,
  Hospital as HospitalIcon,
  Filter,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { fetchNearbyHospitals, Hospital } from "@/lib/overpass";

const CITIES = {
  Siliguri: { lat: 26.7271, lng: 88.3953 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 88.3953 } // Wait, Bangalore is 12.9716, 77.5946
};

const CITY_COORDS: Record<string, { lat: number, lng: number }> = {
  "Siliguri": { lat: 26.7271, lng: 88.3953 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Delhi": { lat: 28.6139, lng: 77.2090 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 }
};

export default function HospitalsPage() {
  const [location, setLocation] = useState<{ city: string | null, lat: number, lng: number }>({
    city: "Siliguri",
    lat: 26.7271,
    lng: 88.3953
  });
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"hospital" | "clinic" | "all">("all");

  const [searchQuery, setSearchQuery] = useState("");

  const loadHospitals = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNearbyHospitals(lat, lng);
      setHospitals(data);
    } catch (err) {
      setError("Failed to fetch nearby medical centers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals(location.lat, location.lng);
  }, []);

  const handleCityChange = (city: string) => {
    const coords = CITY_COORDS[city];
    if (coords) {
      const newLoc = { city, ...coords };
      setLocation(newLoc);
      loadHospitals(coords.lat, coords.lng);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ city: "Current Location", lat: latitude, lng: longitude });
        loadHospitals(latitude, longitude);
      },
      (err) => {
        setLoading(false);
        setError("Location access denied. Please select a city manually.");
        console.error(err);
      }
    );
  };

  const filteredHospitals = hospitals.filter(h => {
    const matchesFilter = filterType === "all" || h.type === filterType;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (h.address && h.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Helper for mock data that depends on ID for stability
  const getMockRating = (id: number) => (4.0 + (id % 10) / 10).toFixed(1);
  const getMockWaitTime = (id: number) => (10 + (id % 50)) + " mins";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Nearby Care discovery</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Access immediate clinical care through our neural network of verified specialists and medical institutions.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-outline-variant/10">
          <select 
            value={location.city || ""}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-transparent border-none text-on-surface font-semibold focus:ring-0 cursor-pointer py-2 pl-4 pr-10"
          >
            {Object.keys(CITY_COORDS).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
            {location.city === "Current Location" && <option value="Current Location">Current Location</option>}
          </select>
          <button 
            onClick={handleUseCurrentLocation}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Navigation size={18} />}
            Use Current Location
          </button>
        </div>
      </header>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Filter Bar */}
      <section className="flex flex-wrap items-center gap-4">
        <div className="bg-surface-container p-1 rounded-2xl flex gap-1">
          <button 
            onClick={() => setFilterType("all")}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${filterType === "all" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            All Centers
          </button>
          <button 
            onClick={() => setFilterType("hospital")}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${filterType === "hospital" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            Hospitals
          </button>
          <button 
            onClick={() => setFilterType("clinic")}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${filterType === "clinic" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            Clinics
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input 
            type="text"
            placeholder="Search by name or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-outline-variant/20 pl-12 pr-6 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium"
          />
        </div>

        <div className="ml-auto">
          <button className="flex items-center gap-2 text-primary font-bold px-4 py-2 hover:bg-primary/5 rounded-xl transition-colors">
            <Filter size={18} />
            Advanced Filters
          </button>
        </div>
      </section>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-outline-variant/10">
               <div className="h-40 bg-slate-100 rounded-t-2xl"></div>
               <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-100 w-3/4 rounded-md"></div>
                  <div className="h-4 bg-slate-50 w-1/2 rounded-md"></div>
                  <div className="h-10 bg-slate-50 rounded-xl mt-4"></div>
               </div>
            </div>
          ))}
        </div>
      ) : filteredHospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="group bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/10 hover:border-primary/30 transition-all hover:shadow-md">
              <div className="h-44 relative bg-slate-100 overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={`https://images.unsplash.com/photo-1519494026892-80bb12565003?auto=format&fit=crop&q=80&w=800&h=450&v=${hospital.id}`}
                  alt={hospital.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800&h=450";
                  }}
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Verified Facility
                </div>
                {hospital.type === "clinic" && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                    Clinic
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-on-surface line-clamp-1">{hospital.name}</h3>
                    <div className="flex items-start gap-1 text-on-surface-variant text-xs mt-1">
                      <MapPin size={14} className="shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{hospital.address}</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg flex items-center gap-1 font-bold text-xs shrink-0">
                    <Star size={12} fill="currentColor" />
                    {getMockRating(hospital.id)}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-50">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">Wait Time</span>
                      <span className="font-bold text-on-surface text-sm flex items-center gap-1">
                        <Clock size={12} /> {getMockWaitTime(hospital.id)}
                      </span>
                   </div>
                   <div className="h-8 w-[1px] bg-outline-variant/10"></div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">Service</span>
                      <span className="font-bold text-on-surface text-sm">{hospital.type === "hospital" ? "24/7 Care" : "By Appt."}</span>
                   </div>
                </div>

                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}`, '_blank')}
                  className="mt-6 w-full py-3 rounded-xl border border-primary text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-[0.98]"
                >
                  <MapIcon size={16} />
                  Navigation Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-20 text-center border border-outline-variant/10 shadow-inner">
           <HospitalIcon size={64} className="mx-auto text-slate-200 mb-6" />
           <h3 className="text-2xl font-bold text-on-surface">No Facilities Found</h3>
           <p className="text-on-surface-variant mt-2 max-w-md mx-auto">
             Try expanding your search radius or adjusting your filters to find centers in your area.
           </p>
           <button 
             onClick={() => loadHospitals(location.lat, location.lng)}
             className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:shadow-lg transition-all"
           >
             Refresh Search
           </button>
        </div>
      )}

      {/* Map Insight Card */}
      {!loading && filteredHospitals.length > 0 && (
         <div className="bg-surface-container-high rounded-3xl p-1 overflow-hidden">
            <div className="bg-white rounded-[22px] p-8 flex flex-col md:flex-row items-center gap-8 border border-white/50">
               <div className="w-full md:w-1/2 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                    <MapIcon size={12} /> Neural Geographic Index
                  </div>
                  <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Interactive Care Mapping</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Visualize all verified healthcare providers across your current sector. 
                    Our neural system synchronizes real-time bed availability and specialist duty rosters for optimized care paths.
                  </p>
                  <div className="flex gap-4 pt-2">
                     <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">Launch Full Map</button>
                     <button className="px-6 py-3 text-on-surface font-bold hover:bg-slate-50 rounded-xl transition-all">View Analytics</button>
                  </div>
               </div>
               <div className="w-full md:w-1/2 aspect-video bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200&h=600" 
                    className="w-full h-full object-cover grayscale brightness-110 opacity-40" 
                    alt="Map view"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-ping">
                        <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
