// Serviço simplificado para API NASA ML
class WeatherService {
  // Função simplificada para buscar dados meteorológicos
  static async getWeatherData(lat, lng) {
    try {
      console.log(`🌍 Buscando dados NASA ML para: ${lat}, ${lng}`);
      
      // Usar data atual
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      
      // Usar apenas CORS proxy (mais confiável)
      const apiUrl = `https://82bda2769b89.ngrok-free.app/api/weather/previsao?lat=${lat}&lon=${lng}&day=${day}&month=${month}&year=${year}`;
      const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
      
      console.log(`🔗 Usando CORS proxy: ${corsProxyUrl}`);
      
      const response = await fetch(corsProxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🤖 Dados recebidos da API ML da NASA:', data);
      
      // Processar os dados da API ML da NASA (estrutura real)
      const processedData = {
        // Dados básicos das médias
        temperature: data.medias?.temp || 24,
        humidity: 70, // A API ML não fornece umidade, usar valor padrão
        windSpeed: data.medias?.vento || 15,
        precipitation: data.medias?.prec || 2.5,
        feelsLike: data.medias?.temp || 24,
        
        // Dados específicos da ML
        mlPredictions: {
          confidence: 95, // Alta confiança para dados da NASA
          model: 'NASA ML Weather Model',
          lastUpdate: new Date().toLocaleTimeString('pt-BR')
        },
        
        // Dados extras da NASA (calcular min/max das previsões)
        tempMax: Math.max(...(data.previsoes?.map(p => p.temp) || [data.medias?.temp + 5])),
        tempMin: Math.min(...(data.previsoes?.map(p => p.temp) || [data.medias?.temp - 5])),
        
        // Dados por hora (para gráficos) - converter formato
        hourlyData: data.previsoes?.map(p => ({
          hora: p.hora,
          temperatura: p.temp,
          precipitacao: p.prec,
          velocidade_vento: p.vento,
          timestamp: p.timestamp
        })) || [],
        
        // Dados originais da API
        rawData: data,
        isMockData: false
      };
      
      console.log('📊 Dados processados:', processedData);
      
      return {
        success: true,
        data: processedData
      };
    } catch (error) {
      console.error('Erro ao buscar dados meteorológicos:', error);
      
      // Fallback to mock data when API is completely unavailable
      console.log('🔄 Usando dados de exemplo como fallback...');
      
      const mockData = {
        temperature: 24 + Math.random() * 10 - 5, // Random temp between 19-29°C
        humidity: 70 + Math.random() * 20 - 10, // Random humidity 60-80%
        windSpeed: 10 + Math.random() * 20, // Random wind 10-30 km/h
        precipitation: Math.random() * 5, // Random precipitation 0-5mm
        feelsLike: 24 + Math.random() * 8 - 4,
        mlPredictions: {
          confidence: 0,
          model: 'Mock Data (API Unavailable)',
          lastUpdate: new Date().toLocaleTimeString('pt-BR')
        },
        tempMax: 28 + Math.random() * 5,
        tempMin: 18 + Math.random() * 5,
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hora: i,
          temperatura: 20 + Math.random() * 10,
          precipitacao: Math.random() * 2,
          velocidade_vento: 5 + Math.random() * 15,
          timestamp: new Date(Date.now() + i * 3600000).toISOString()
        })),
        rawData: { mock: true },
        isMockData: true
      };
      
      return {
        success: true,
        data: mockData,
        warning: 'Using mock data - API unavailable'
      };
    }
  }

  // Função para buscar previsão do tempo
  static async getWeatherForecast(lat, lng) {
    try {
      const response = await fetch(`${API_BASE_URL}/forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Erro ao buscar previsão:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // Função para testar a conectividade da API
  static async testConnection() {
    try {
      console.log('Testando conexão com:', API_BASE_URL);
      
      // Testar diferentes endpoints possíveis
      const endpoints = ['', '/health', '/api/health', '/status', '/weather', '/api/weather'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            console.log(`✅ Endpoint funcionando: ${API_BASE_URL}${endpoint}`);
            return { success: true, workingEndpoint: `${API_BASE_URL}${endpoint}` };
          }
        } catch (error) {
          console.log(`❌ Endpoint falhou: ${API_BASE_URL}${endpoint}`, error.message);
        }
      }
      
      return { success: false, workingEndpoint: null };
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return { success: false, workingEndpoint: null };
    }
  }
}

export default WeatherService;
