// utils/googleMaps.js
const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

if (!API_KEY) {
  throw new Error(
    'Chave da API do Google Maps não encontrada. Defina VITE_MAPS_API_KEY no seu arquivo .env.'
  );
}

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
 * Função genérica para fazer chamadas à API de Geocoding do Google.
 * @param {Object} params - Parâmetros da requisição (ex: address, latlng).
 * @returns {Array|null} Resultados da API ou null em caso de falha.
 */
async function fetchGeocode(params) {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  );
  url.searchParams.append('key', API_KEY);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.warn(
        `Erro da API de Geocoding: ${data.status}`,
        data.error_message || ''
      );
      return null;
    }

    return data.results;
  } catch (error) {
    console.error('Falha ao buscar dados na API de Geocoding:', error);
    return null;
  }
}

/**
 * Busca coordenadas a partir de um endereço (Geocoding).
 * @param {string} address - Endereço em formato de texto.
 * @returns {Array} Lista de objetos com endereço formatado e coordenadas.
 */
export async function searchAddress(address) {
  if (!address) {
    throw new Error('A função searchAddress precisa de um endereço válido.');
  }

  const results = await fetchGeocode({ address: encodeURIComponent(address) });

  return results
    ? results.map((result) => ({
        formattedAddress: result.formatted_address,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
      }))
    : [];
}

/**
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @returns {string|null} Endereço formatado ou null se não encontrado.
 */
export async function reverseGeocode(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error(
      'A função reverseGeocode precisa de latitude e longitude numéricas.'
    );
  }

  const results = await fetchGeocode({ latlng: `${lat},${lng}` });

  return results?.[0]?.formatted_address || null;
}
