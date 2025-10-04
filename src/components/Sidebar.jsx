import { FaTimes, FaThermometerHalf, FaTint, FaWind, FaEye, FaMapMarkerAlt, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import WeatherChart from "./WeatherChart";

export default function Sidebar({ coords, onClose, weatherData, isLoading, error }) {
  if (!coords) return null;

  return (
    <aside className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-50">
      {/* Cabeçalho */}
      <div className="gradient-primary text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Dados Meteorológicos</h2>
            <p className="text-blue-200">Informações em tempo real</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Informações da Localização */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-3">
            <FaMapMarkerAlt className="text-blue-500 mr-2" />
            <h3 className="font-semibold text-gray-800">Localização</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Latitude:</span>
              <span className="text-gray-800">{coords.lat.toFixed(4)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Longitude:</span>
              <span className="text-gray-800">{coords.lng.toFixed(4)}°</span>
            </div>
          </div>
        </div>

        {/* Dados Meteorológicos Atuais */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Condições Atuais</h3>
              <p className="text-sm text-gray-600">
                {isLoading ? 'Carregando dados ML...' : `Última atualização: ${new Date().toLocaleTimeString('pt-BR')}`}
              </p>
            </div>
            <div className="text-4xl">
              {isLoading ? <FaSpinner className="animate-spin text-blue-500" /> : '🌤️'}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-2xl mr-3" />
              <span className="text-gray-600">Carregando dados da IA...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 bg-red-50 rounded-lg">
              <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
              <div>
                <p className="text-red-700 font-medium">Erro ao carregar dados</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FaThermometerHalf className="text-red-500 text-xl" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {weatherData?.temperature || '24'}°C
                  </p>
                  <p className="text-sm text-gray-600">Temperatura</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaTint className="text-blue-500 text-xl" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {weatherData?.humidity || '72'}%
                  </p>
                  <p className="text-sm text-gray-600">Umidade</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dados Detalhados */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {weatherData ? 'Dados da IA/ML' : 'Informações Detalhadas'}
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaWind className="text-gray-500" />
              <span className="font-medium text-gray-700">Velocidade do Vento</span>
            </div>
            <span className="font-bold text-gray-800">
              {weatherData?.windSpeed || '15'} km/h
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaTint className="text-gray-500" />
              <span className="font-medium text-gray-700">Precipitação</span>
            </div>
            <span className="font-bold text-gray-800">
              {weatherData?.precipitation || '2.5'} mm
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaThermometerHalf className="text-gray-500" />
              <span className="font-medium text-gray-700">Sensação Térmica</span>
            </div>
            <span className="font-bold text-gray-800">
              {weatherData?.feelsLike || '26'}°C
            </span>
          </div>

          {/* Dados específicos da NASA ML */}
          {weatherData?.mlPredictions && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 font-semibold">🚀 NASA ML Predictions</span>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Confiança:</strong> {weatherData.mlPredictions.confidence}%</p>
                <p><strong>Modelo:</strong> {weatherData.mlPredictions.model}</p>
                <p><strong>Última atualização:</strong> {weatherData.mlPredictions.lastUpdate}</p>
                {weatherData.tempMax && (
                  <p><strong>Temp. Máxima:</strong> {weatherData.tempMax}°C</p>
                )}
                {weatherData.tempMin && (
                  <p><strong>Temp. Mínima:</strong> {weatherData.tempMin}°C</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Seção de Gráficos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {weatherData ? 'Análise da IA/ML' : 'Tendências do Tempo'}
          </h3>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <WeatherChart weatherData={weatherData} />
          </div>
        </div>

        {/* Nota sobre Dados */}
        <div className={`border rounded-lg p-4 ${
          weatherData?.isMockData 
            ? 'bg-red-50 border-red-200' 
            : weatherData 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-sm ${
            weatherData?.isMockData 
              ? 'text-red-800' 
              : weatherData 
                ? 'text-green-800' 
                : 'text-yellow-800'
          }`}>
            <strong>
              {weatherData?.isMockData 
                ? '⚠️ Dados de Exemplo (API Indisponível)' 
                : weatherData 
                  ? '✅ Dados da IA/ML' 
                  : '⚠️ Dados de Exemplo'
              }
            </strong>
            {weatherData?.isMockData 
              ? ' - API NASA ML não disponível, usando dados simulados' 
              : weatherData 
                ? ' - Dados carregados da API de Machine Learning' 
                : ' - Conectando com API ML...'
            }
          </p>
        </div>
      </div>
    </aside>
  );
}
