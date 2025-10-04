// Serviço simplificado de pesquisa - apenas coordenadas diretas
class HybridSearchService {
  // Função simplificada - aceita apenas coordenadas
  static async searchLocation(query) {
    console.log(`🔍 Processando: "${query}"`);
    
    // Verificar se é coordenadas diretas (lat, lng)
    const coordMatch = query.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        console.log('✅ Coordenadas válidas encontradas');
        return {
          success: true,
          source: 'Direct Coordinates',
          results: [{
            name: `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            lat: lat,
            lng: lng,
            source: 'Direct Input'
          }]
        };
      }
    }
    
    // Se não for coordenadas, retornar erro
    return {
      success: false,
      error: 'Digite coordenadas no formato: lat, lng (ex: 38.7223, -9.1393)',
      results: []
    };
  }
  
  // Testar conectividade (simplificado)
  static async testServices() {
    return {
      directCoordinates: true,
      message: 'Sistema simplificado - apenas coordenadas diretas'
    };
  }
}

export default HybridSearchService;
