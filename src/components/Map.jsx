import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function MapView({ onAreaClick }) {
  const [coords, setCoords] = useState(null);

  return (
    <div className="relative w-full h-[calc(100vh-6rem)]">
     
      <MapContainer
        center={[0, 0]}
        zoom={2}
        className="h-full w-full rounded-xl shadow-lg overflow-hidden z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          onSelect={(latlng) => {
            setCoords(latlng);
            if (onAreaClick) onAreaClick(latlng);
          }}
        />

        {coords && (
          <Marker position={coords}>
            <Popup className="text-sm font-medium">
              📍 <span className="text-blue-600">Lat:</span>{" "}
              {coords.lat.toFixed(3)} <br />
              📍 <span className="text-blue-600">Lng:</span>{" "}
              {coords.lng.toFixed(3)}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {coords && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-3 animate-fadeIn">
          <span>
            🌍 Latitude: <b>{coords.lat.toFixed(3)}</b>
          </span>
          <span>
            Longitude: <b>{coords.lng.toFixed(3)}</b>
          </span>
        </div>
      )}
    </div>
  );
}
