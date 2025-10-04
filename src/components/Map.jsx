import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
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
    <MapContainer
      center={[0, 0]}
  zoom={2}
  className="h-[calc(100vh-8rem)] w-full z-0"
    >
      <TileLayer
        attribution='&copy; OSM'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        onSelect={(latlng) => {
          setCoords(latlng);
          onAreaClick(latlng);
        }}
      />
      {coords && (
        <Marker position={coords}>
          <Popup>
            Lat: {Number.parseInt(coords.lat)} | Lng: {Number.parseInt(coords.lng)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
