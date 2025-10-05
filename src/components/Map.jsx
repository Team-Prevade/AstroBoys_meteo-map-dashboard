import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const parseBounds = (rawFeature) => {
  if (!rawFeature) return null;

  const bbox = rawFeature?.bbox ?? rawFeature?.properties?.bbox;
  if (Array.isArray(bbox) && bbox.length === 4) {
    const [minLon, minLat, maxLon, maxLat] = bbox.map(Number);
    if ([minLon, minLat, maxLon, maxLat].every(Number.isFinite)) {
      return [
        [minLat, minLon],
        [maxLat, maxLon],
      ];
    }
  }

  const coords = rawFeature?.geometry?.coordinates;
  if (!coords) return null;

  const flatten = (arr) =>
    arr.reduce((acc, item) => {
      if (Array.isArray(item[0])) return acc.concat(flatten(item));
      if (item.length >= 2) acc.push(item);
      return acc;
    }, []);

  const points = Array.isArray(coords) ? flatten(coords) : [];
  if (!points.length) return null;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  points.forEach(([lon, lat]) => {
    const nLat = Number(lat);
    const nLon = Number(lon);
    if (!Number.isFinite(nLat) || !Number.isFinite(nLon)) return;
    if (nLat < minLat) minLat = nLat;
    if (nLat > maxLat) maxLat = nLat;
    if (nLon < minLon) minLon = nLon;
    if (nLon > maxLon) maxLon = nLon;
  });

  if (
    Number.isFinite(minLat) &&
    Number.isFinite(maxLat) &&
    Number.isFinite(minLon) &&
    Number.isFinite(maxLon)
  ) {
    return [
      [minLat, minLon],
      [maxLat, maxLon],
    ];
  }

  return null;
};

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function MapView({ onAreaClick, data }) {
  const [coords, setCoords] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const lastSearchTargetRef = useRef(null);
  const pendingCenterRef = useRef(null);

  const searchTarget = useMemo(() => {
    if (!data) return null;
    const entries = Array.isArray(data) ? data : [data];
    const item = entries.find((entry) => {
      const lat = entry?.location?.lat;
      const lng = entry?.location?.lng;
      return Number.isFinite(lat) && Number.isFinite(lng);
    });

    if (!item) return null;

    return {
      lat: Number(item.location.lat),
      lng: Number(item.location.lng),
      bounds: parseBounds(item.raw),
    };
  }, [data]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!searchTarget) return;

    const lastTarget = lastSearchTargetRef.current;
    const lastBoundsKey = JSON.stringify(lastTarget?.bounds ?? null);
    const nextBoundsKey = JSON.stringify(searchTarget.bounds ?? null);
    const hasChanged =
      !lastTarget ||
      lastTarget.lat !== searchTarget.lat ||
      lastTarget.lng !== searchTarget.lng ||
      lastBoundsKey !== nextBoundsKey;

    if (!hasChanged) return;

    lastSearchTargetRef.current = searchTarget;
    pendingCenterRef.current = searchTarget;

    setCoords(searchTarget);
    if (onAreaClick) onAreaClick(searchTarget);

    if (mapInstance) {
      if (searchTarget.bounds) {
        mapInstance.fitBounds(searchTarget.bounds, {
          padding: [60, 60],
          maxZoom: 13,
          animate: true,
        });
      } else {
        const currentZoom = mapInstance.getZoom();
        const desiredZoom = Math.max(currentZoom || 0, 10);
        mapInstance.flyTo([searchTarget.lat, searchTarget.lng], desiredZoom, {
          duration: 1.25,
        });
      }
      pendingCenterRef.current = null;
    }
  }, [searchTarget, onAreaClick, mapInstance]);

  useEffect(() => {
    if (!mapInstance) return;

    const target = pendingCenterRef.current ?? coords;
    if (!target) return;

    if (pendingCenterRef.current?.bounds) {
      mapInstance.fitBounds(pendingCenterRef.current.bounds, {
        padding: [60, 60],
        maxZoom: 13,
        animate: true,
      });
      pendingCenterRef.current = null;
      return;
    }

    const currentZoom = mapInstance.getZoom();
    const desiredZoom = pendingCenterRef.current
      ? Math.max(currentZoom || 0, 10)
      : currentZoom || 10;

    if (pendingCenterRef.current) {
      mapInstance.flyTo([target.lat, target.lng], desiredZoom, {
        duration: 1.25,
      });
      pendingCenterRef.current = null;
    } else {
      mapInstance.setView([target.lat, target.lng], desiredZoom);
    }
  }, [mapInstance, coords]);

  const containerClasses = isExpanded
    ? 'fixed inset-0 z-[70] w-screen h-screen bg-[#0f172a]'
    : 'relative w-full h-[calc(100vh-6rem)]';

  const mapClasses = isExpanded
    ? 'h-full w-full rounded-none shadow-2xl'
    : 'h-full w-full rounded-xl shadow-lg';

  return (
    <div className={`${containerClasses} transition-all duration-300`}>
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-gray-900 shadow-lg backdrop-blur hover:bg-white"
        aria-label={isExpanded ? 'Reduzir mapa' : 'Ampliar mapa'}
      >
        {isExpanded ? '⤢ Reduzir' : '⛶ Ampliar'}
      </button>

      <MapContainer
        center={[0, 0]}
        zoom={2}
        key={isExpanded ? 'expanded' : 'default'}
        whenCreated={setMapInstance}
        className={`${mapClasses} overflow-hidden z-0`}
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
              📍 <span className="text-blue-600">Lat:</span>{' '}
              {coords.lat.toFixed(3)} <br />
              📍 <span className="text-blue-600">Lng:</span>{' '}
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
