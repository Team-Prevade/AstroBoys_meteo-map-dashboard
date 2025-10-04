import { useState, useEffect } from "react";
import Header from "./components/Header";
import MapView from "./components/Map";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import WeatherService from "./services/weatherService";
import HybridSearchService from "./services/hybridSearchService";

export default function App() {
  const [coords, setCoords] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // Função para buscar dados meteorológicos da API ML
  const fetchWeatherData = async (coordinates) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    
    try {
      const result = await WeatherService.getWeatherData(coordinates.lat, coordinates.lng);
      
      if (result.success) {
        setWeatherData(result.data);
        console.log('Dados meteorológicos carregados:', result.data);
      } else {
        setWeatherError(result.error);
        console.error('Erro ao carregar dados meteorológicos:', result.error);
      }
    } catch (error) {
      setWeatherError('Erro de conexão com a API');
      console.error('Erro ao buscar dados meteorológicos:', error);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const handleLocationSelect = (selectedCoords) => {
    setCoords(selectedCoords);
    // Buscar dados meteorológicos da API ML
    fetchWeatherData(selectedCoords);
  };

  // Testar serviços híbridos ao carregar o app
  useEffect(() => {
    const testServices = async () => {
      try {
        console.log('🚀 Testando serviços híbridos...');
        
        // 1. Testar serviços de pesquisa
        console.log('\n=== TESTE: Serviços de Pesquisa ===');
        const searchServices = await HybridSearchService.testServices();
        console.log('Resultados:', searchServices);
        
        // 2. Testar API NASA ML
        console.log('\n=== TESTE: API NASA ML ===');
        const weatherResult = await WeatherService.getWeatherData(38.7223, -9.1393);
        
        if (weatherResult.success) {
          console.log('✅ API NASA ML funcionando!');
          console.log('📊 Dados de teste:', weatherResult.data);
        } else {
          console.log('❌ API NASA ML não disponível:', weatherResult.error);
        }
        
        // Resumo
        console.log('\n=== RESUMO DOS SERVIÇOS ===');
        console.log('🔍 Pesquisa:', searchServices.googleMaps ? 'Google Maps ✅' : 'Nominatim ✅');
        console.log('🌤️ Tempo:', weatherResult.success ? 'NASA ML ✅' : 'NASA ML ❌');
      } catch (error) {
        console.error('❌ Erro durante testes:', error);
        console.error('Stack trace:', error.stack);
      }
    };
    
    testServices();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header onLocationSelect={handleLocationSelect} />
      <div className="flex-1 relative">
        <MapView onAreaClick={setCoords} />
        <Sidebar 
          coords={coords} 
          weatherData={weatherData}
          isLoading={isLoadingWeather}
          error={weatherError}
          onClose={() => setCoords(null)} 
        />
      </div>
      <Footer />
    </div>
  );
}
