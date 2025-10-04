const normalizeQuery = (q) =>
  q
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

const VITE_MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;

export const searchAddress = async ({ address }) => {
  const raw = address;
  if (!raw.trim()) return;
  const q = normalizeQuery(raw);
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      q
    )}&key=${VITE_MAPS_API_KEY}&no_annotations=1&language=pt-BR`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha na requisição');
    const data = await response.json();
    if (data.status && data.status.code !== 200) {
      throw new Error(data.status.message || 'Erro da API');
    }

    const rr = searchAddress(raw);
    if (!rr) return;

    console.log('Resultados da busca:', rr);

    const mapped = (data.results || []).map((r) => ({
      formatted_address: r.formatted,
      location: { lat: r.geometry?.lat, lng: r.geometry?.lng },
      type: r.components?._type || r.components?.category || 'desconhecido',
    }));
    return mapped;
  } catch (err) {
    console.error('Erro na busca:', err);
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const query = `${lat},${lng}`;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      query
    )}&key=${VITE_MAPS_API_KEY}&no_annotations=1&language=pt-BR`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha na requisição');

    const data = await response.json();
    if (data.status && data.status.code !== 200) {
      throw new Error(data.status.message || 'Erro da API');
    }

    // Mapeia os resultados de forma similar à sua função existente
    const mapped = (data.results || []).map((r) => ({
      formatted_address: r.formatted,
      location: { lat: r.geometry?.lat, lng: r.geometry?.lng },
      type: r.components?._type || r.components?.category || 'desconhecido',
    }));

    return mapped;
  } catch (err) {
    console.error('Erro na busca reversa:', err);
    return [
      { error: 'Não foi possível obter o endereço para essas coordenadas.' },
    ];
  }
};
