import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
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

export default function MapView({ onAreaClick, setCoords, coords }) {


  const [localizacao, setLocalizacao] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setErro("Geolocalização não é suportada neste navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLocalizacao({ latitude, longitude, accuracy });
      },
      (err) => {
        if (err.code === 1) setErro("Permissão negada pelo usuário.");
        else if (err.code === 2) setErro("Localização indisponível.");
        else setErro("Tempo de espera excedido.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  function MapUpdater({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng]); // 13 = nível de zoom padrão urbano
    }
  }, [coords, map]);
  return null;
}

  return (
    <MapContainer
      center={localizacao ? [localizacao.latitude, localizacao.longitude] : [0, 0]}
  zoom={5}

  className="h-[calc(100vh-8rem)] w-full z-0"
    >
      <TileLayer
        attribution='&copy; OSM'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater coords={coords} />
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
