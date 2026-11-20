import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { 
  Plus, 
  Minus, 
  Navigation, 
  MapPin, 
  Wrench, 
  Droplet, 
  HeartPulse, 
  Laptop
} from 'lucide-react';

// Custom Map Controller to center map programmatically
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({
  professionals,
  selectedProfessional,
  onSelectProfessional,
  userLocation = { lat: 21.1215, lng: -101.6826 } // León, Guanajuato fallback
}) {
  const [zoomLevel, setZoomLevel] = useState(13);
  const [center, setCenter] = useState([userLocation.lat, userLocation.lng]);

  // Re-center once the browser resolves the user's real location
  // (userLocation starts at the fallback and updates asynchronously).
  useEffect(() => {
    setCenter([userLocation.lat, userLocation.lng]);
  }, [userLocation.lat, userLocation.lng]);

  const getCategoryIconComponent = (category) => {
    switch (category) {
      case 'coche': return Wrench;
      case 'hogar': return Droplet;
      case 'salud': return HeartPulse;
      case 'tecnologia': return Laptop;
      default: return MapPin;
    }
  };

  const createCustomIcon = (prof, isSelected) => {
    const IconComponent = getCategoryIconComponent(prof.category);
    const iconHtml = renderToString(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', borderRadius: '50%', background: isSelected ? '#1d4ed8' : '#ffffff', color: isSelected ? '#ffffff' : '#1d4ed8', border: '2px solid #2563eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <IconComponent style={{ width: '20px', height: '20px' }} />
      </div>
    );

    return L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon',
      iconSize: isSelected ? [48, 48] : [40, 40],
      iconAnchor: isSelected ? [24, 24] : [20, 20],
    });
  };

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[600px] bg-[#E8ECEF] rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
      
      <MapContainer 
        center={center} 
        zoom={zoomLevel} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        zoomControl={false}
      >
        <MapController center={center} zoom={zoomLevel} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location */}
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={L.divIcon({
            html: '<div style="width: 16px; height: 16px; background: #2563eb; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 0 4px rgba(37,99,235,0.3);"></div>',
            className: 'user-location-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })}
        >
          <Popup>Tú estás aquí</Popup>
        </Marker>

        {/* Professionals */}
        {professionals.map((prof) => {
          const isSelected = selectedProfessional?.id === prof.id;
          const latLng = [prof.lat ?? 21.1215, prof.lng ?? -101.6826];

          return (
            <Marker
              key={prof.id}
              position={latLng}
              icon={createCustomIcon(prof, isSelected)}
              eventHandlers={{
                click: () => onSelectProfessional(prof),
              }}
            >
              <Popup>
                <div className="font-bold text-slate-800">{prof.name}</div>
                <div className="text-sm text-slate-600">{prof.role}</div>
                <div className="text-blue-700 font-extrabold mt-1">${prof.baseVisitPrice}</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Control Buttons (Zoom & Location) */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200 p-1 flex flex-col">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
            className="p-2.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Acercar mapa"
          >
            <Plus className="w-5 h-5 font-bold" />
          </button>
          <div className="w-full h-px bg-slate-200 my-0.5" />
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 5))}
            className="p-2.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Alejar mapa"
          >
            <Minus className="w-5 h-5 font-bold" />
          </button>
        </div>
      </div>

      {/* Geolocation Button */}
      <div className="absolute bottom-4 right-4 z-[400]">
        <button
          onClick={() => {
            setCenter([userLocation.lat, userLocation.lng]);
            setZoomLevel(13);
          }}
          className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 group"
          title="Centrar en mi ubicación"
        >
          <Navigation className="w-5 h-5 text-blue-600 group-hover:rotate-45 transition-transform" />
        </button>
      </div>

      {/* Bottom Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-slate-200 flex items-center gap-3 text-xs font-semibold text-slate-700">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          {professionals.length} especialistas activos en León
        </span>
      </div>
    </div>
  );
}
