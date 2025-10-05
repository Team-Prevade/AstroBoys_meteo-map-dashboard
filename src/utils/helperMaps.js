const normalizeQuery = (value = '') => {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const GEOAPIFY_API_KEY =
  import.meta.env.VITE_GEOAPIFY_API_KEY ??
  import.meta.env.VITE_GEOAPIFY_KEY ??
  import.meta.env.VITE_MAPS_API_KEY;

const GEOAPIFY_SEARCH_URL = 'https://api.geoapify.com/v1/geocode/search';
const GEOAPIFY_REVERSE_URL = 'https://api.geoapify.com/v1/geocode/reverse';

const ensureApiKey = () => {
  if (!GEOAPIFY_API_KEY) {
    throw new Error(
      'Configure a variável VITE_GEOAPIFY_API_KEY (ou VITE_GEOAPIFY_KEY) com a key da Geoapify.'
    );
  }
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.set(key, String(value));
  });
  return searchParams.toString();
};

const normalizeGeoapifyLanguage = (language) => {
  if (typeof language !== 'string') return undefined;
  const lower = language.trim().toLowerCase();
  if (!lower) return undefined;
  if (lower === 'pt-br' || lower === 'pt_br') return 'pt';
  if (lower.length > 2 && lower.includes('-')) return lower.split('-')[0];
  if (lower.length >= 2) return lower.slice(0, 2);
  return undefined;
};

const mapGeoapifyResults = (entries = []) =>
  entries
    .map((entry) => {
      const props = entry?.properties ?? entry ?? {};
      const coords = Array.isArray(entry?.geometry?.coordinates)
        ? entry.geometry.coordinates
        : [];

      const lat = Number(
        props.lat ?? props.latitude ?? coords[1] ?? props.center_lat
      );
      const lng = Number(
        props.lon ??
          props.lng ??
          props.longitude ??
          coords[0] ??
          props.center_lon
      );

      return {
        formatted_address:
          props.formatted ??
          props.address_line1 ??
          props.address_line2 ??
          props.result_label ??
          null,
        location: {
          lat: Number.isFinite(lat) ? lat : null,
          lng: Number.isFinite(lng) ? lng : null,
        },
        type:
          props.result_type ??
          props.category ??
          props.layer ??
          props.place_type ??
          'desconhecido',
        confidence:
          props.rank?.confidence ??
          props.confidence ??
          props.rank_confidence ??
          null,
        raw: entry ?? null,
      };
    })
    .filter(
      (item) =>
        Number.isFinite(item.location.lat) && Number.isFinite(item.location.lng)
    );

export const searchAddress = async ({
  address,
  language = 'pt-BR',
  limit = 5,
} = {}) => {
  if (typeof address !== 'string') {
    throw new Error('O parâmetro "address" precisa ser uma string.');
  }

  const raw = address.trim();
  if (!raw) return [];

  ensureApiKey();

  const q = normalizeQuery(raw);

  try {
    const queryString = buildQueryString({
      text: q,
      apiKey: GEOAPIFY_API_KEY,
      limit,
      lang: normalizeGeoapifyLanguage(language),
    });

    const response = await fetch(`${GEOAPIFY_SEARCH_URL}?${queryString}`);
    if (!response.ok) throw new Error('Falha ao consultar o serviço de mapas.');

    const data = await response.json();
    const entries = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.features)
      ? data.features
      : [];

    return mapGeoapifyResults(entries);
  } catch (err) {
    console.error('Erro na busca de endereço:', err);
    throw err instanceof Error ? err : new Error(String(err));
  }
};

export const reverseGeocode = async (lat, lng, { language = 'pt-BR' } = {}) => {
  const numericLat = Number(lat);
  const numericLng = Number(lng);

  if (!Number.isFinite(numericLat) || !Number.isFinite(numericLng)) {
    throw new Error('Coordenadas inválidas para busca reversa.');
  }

  ensureApiKey();

  try {
    const queryString = buildQueryString({
      lat: numericLat,
      lon: numericLng,
      apiKey: GEOAPIFY_API_KEY,
      lang: normalizeGeoapifyLanguage(language),
    });

    const response = await fetch(`${GEOAPIFY_REVERSE_URL}?${queryString}`);
    if (!response.ok) {
      throw new Error('Falha ao consultar o serviço de mapas.');
    }

    const data = await response.json();
    const entries = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.features)
      ? data.features
      : [];

    return mapGeoapifyResults(entries);
  } catch (err) {
    console.error('Erro na busca reversa:', err);
    throw err instanceof Error ? err : new Error(String(err));
  }
};
