import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import ModalConfirmarLocalizacao from "./ConfirmLocation";
import ChatBotFlutuante from "./chat";


L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
});

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

function MoveToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && isFinite(coords.lat) && isFinite(coords.lng)) {
      let zoom = map.getZoom()
      if (zoom < 10) zoom = 13;
  map.flyTo([coords.lat, coords.lng], zoom, { duration: 1.5 });
}
  }, [coords, map]);
  return null;
}

export default function MapView({ onAreaClick, setCoordsAndData, setCoords, coords }) {
  const [pendingCoords, setPendingCoords] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState(null);

  const handleConfirmLocation = (confirmedCoords) => {
    setShowModal(false)
    setCoords(confirmedCoords.coords)
    setCoordsAndData(confirmedCoords);
  };

  useEffect(() => {
    if (!coords?.lat || !coords?.lng) return;
    /* setLoadingAddress(true); */
    setAddress(null);

    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
        );
        const data = await res.json();
        setAddress(data.display_name || "Endereço desconhecido");
      } catch (error) {
        console.error("Erro ao buscar endereço:", error);
        setAddress("Não foi possível determinar o endereço");
      } 
      /* finally {
        setLoadingAddress(false);
      } */
    };

    fetchAddress();
  }, [coords]);

  return (
    <div className="relative w-full h-[calc(100vh-6rem)]">
      

      {/* Mapa */}
      <MapContainer
        center={[0, 0]}
        zoom={2}
        maxZoom={18}
        minZoom={3}
        className="h-full w-full rounded-xl shadow-lg overflow-hidden z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Clicou no mapa → abre modal */}
        <LocationMarker
          onSelect={(latlng) => {
            setCoords(latlng);
            setPendingCoords(latlng);
            if (onAreaClick) onAreaClick(latlng);
            setCoordsAndData(null);
          }}
        />

        {coords && (
          <>
            <Marker position={coords}>
              <Popup className="text-sm font-medium" >
                    <span>Endereço: {address ? address : "Endereço desconhecido"}</span><br />
                📍 <span className="text-blue-600">Lat:</span> {coords.lat.toFixed(3)} <br />
                📍 <span className="text-blue-600">Lng:</span> {coords.lng.toFixed(3)}
              </Popup>
            </Marker>
            <MoveToLocation coords={coords} />
          </>
        )}
      </MapContainer>

      {/* Coordenadas exibidas na parte inferior */}
      {/* {coords && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-3 animate-fadeIn">
          <span>🌍 Latitude: <b>{coords.lat.toFixed(3)}</b></span>
          <span>Longitude: <b>{coords.lng.toFixed(3)}</b></span>
        </div>
      )}
 */}

      {coords && (
        <button onClick={() => setShowModal(true)} className="absolute bottom-6 left-10 -translate-x-2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-3 animate-fadeIn">
          Confirmar Localização
        </button>
      )}

      {/* ✅ Modal de confirmação */}
      <ModalConfirmarLocalizacao
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmLocation}
        coords={pendingCoords}
      />

      <div className="absolute bottom-6 left-200 -translate-x-2 px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-3 animate-fadeIn">
        <ChatBotFlutuante Loc={coords} />
      </div>
    </div>
  );
}
