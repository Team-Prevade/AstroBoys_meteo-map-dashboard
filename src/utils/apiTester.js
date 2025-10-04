// Utilitário para testar a API ML do teu amigo
const API_BASE_URL = 'https://82bda2769b89.ngrok-free.app';

class APITester {
  // Testar se o endpoint base responde
  static async testBaseEndpoint() {
    try {
      console.log('🔍 Testando endpoint base:', API_BASE_URL);
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json, text/plain, */*'
        }
      });
      
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log('Response:', text);
      
      return {
        success: response.ok,
        status: response.status,
        data: text
      };
    } catch (error) {
      console.error('❌ Erro ao testar endpoint base:', error);
      return { success: false, error: error.message };
    }
  }

  // Testar diferentes endpoints possíveis
  static async testAllEndpoints() {
    const endpoints = [
      '', // endpoint base
      '/api',
      '/weather',
      '/api/weather',
      '/predict',
      '/api/predict',
      '/forecast',
      '/api/forecast',
      '/health',
      '/status',
      '/docs',
      '/swagger',
      '/api/docs'
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testando: ${API_BASE_URL}${endpoint}`);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json, text/plain, */*'
          }
        });
        
        const text = await response.text();
        
        results.push({
          endpoint: `${API_BASE_URL}${endpoint}`,
          status: response.status,
          success: response.ok,
          contentType: response.headers.get('content-type'),
          data: text.substring(0, 200) + (text.length > 200 ? '...' : '')
        });
        
        console.log(`✅ ${endpoint}: ${response.status} - ${response.headers.get('content-type')}`);
        
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.message}`);
        results.push({
          endpoint: `${API_BASE_URL}${endpoint}`,
          status: 'ERROR',
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  // Testar com POST se GET não funcionar
  static async testWithPost(lat, lng) {
    const endpoints = [
      '/weather',
      '/api/weather',
      '/predict',
      '/api/predict',
      '/forecast',
      '/api/forecast'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testando POST: ${API_BASE_URL}${endpoint}`);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            latitude: lat,
            longitude: lng,
            lat: lat,
            lng: lng,
            coordinates: { lat, lng },
            location: { lat, lng }
          })
        });
        
        const data = await response.text();
        console.log(`✅ POST ${endpoint}: ${response.status}`);
        console.log('Response:', data);
        
        if (response.ok) {
          return {
            success: true,
            endpoint: `${API_BASE_URL}${endpoint}`,
            data: data
          };
        }
        
      } catch (error) {
        console.log(`❌ POST ${endpoint}: ${error.message}`);
      }
    }

    return { success: false };
  }
}

export default APITester;
