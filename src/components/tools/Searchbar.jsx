import { FaSearch, FaMapMarkerAlt, FaSpinner, FaGoogle, FaGlobe } from "react-icons/fa";
import { useState, useEffect } from "react";
import HybridSearchService from "../../services/hybridSearchService";

export default function Searchbar({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSource, setSearchSource] = useState(null);

  // Função híbrida para buscar localizações
  const searchLocation = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await HybridSearchService.searchLocation(searchQuery);
      
      if (result.success) {
        setSuggestions(result.results);
        setSearchSource(result.source);
        setShowSuggestions(true);
        console.log(`🔍 Resultados de ${result.source}:`, result.results);
      } else {
        setSuggestions([]);
        console.error('Erro na pesquisa:', result.error);
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        searchLocation(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchLocation(query);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (onLocationSelect) {
      onLocationSelect({ lat: suggestion.lat, lng: suggestion.lng });
    }
    setQuery(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay para permitir clique nas sugestões
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white rounded-lg shadow-md border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
          {/* Ícone de Pesquisa */}
          <div className="pl-4 pr-2">
            <FaSearch className="text-gray-400" />
          </div>
          
          {/* Campo de Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Digite coordenadas: lat, lng (ex: 38.7223, -9.1393)"
            className="flex-1 px-3 py-3 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none text-sm"
          />
          
          {/* Botão de Loading */}
          {isLoading && (
            <div className="pr-4">
              <FaSpinner className="text-blue-500 animate-spin" />
            </div>
          )}
        </div>
        
        {/* Dropdown de Sugestões */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {/* Header com fonte */}
            {searchSource && (
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-600 flex items-center">
                {searchSource === 'Google Maps' ? (
                  <FaGoogle className="text-blue-500 mr-2" />
                ) : (
                  <FaGlobe className="text-green-500 mr-2" />
                )}
                Resultados via {searchSource}
              </div>
            )}
            
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <FaMapMarkerAlt className="text-blue-500 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {suggestion.name.split(',')[0]}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {suggestion.name}
                  </div>
                </div>
                <div className="text-xs text-gray-400 ml-2">
                  {suggestion.lat.toFixed(2)}°, {suggestion.lng.toFixed(2)}°
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}