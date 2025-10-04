import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function Searchbar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  // Faz busca na API do Nominatim
  useEffect(() => {
    if (query.trim().length < 3) {
      setResultados([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=10`
        );
        const data = await response.json();
        setResultados(data);
      } catch (error) {
        console.error("Erro ao buscar local:", error);
      } finally {
        setLoading(false);
      }
    }, 500); // pequeno delay para não buscar a cada letra

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative flex flex-col items-center w-full px-4">
      <div
        className="flex items-center w-full max-w-lg bg-gray-800 rounded-full shadow-md px-4 py-2 
                   focus-within:ring-2 focus-within:ring-blue-500 transition-all z-[9999]"
      >
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Pesquisar local..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Resultados da busca */}
      {isFocused && resultados.length > 0 && (
        <ul
          className="absolute top-full mt-2 w-full max-w-lg bg-gray-900 border border-gray-700 rounded-xl 
               shadow-lg z-[99999] overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
        >
          {resultados.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 text-gray-200 hover:bg-blue-600 hover:text-white cursor-pointer transition-all"
              onMouseDown={() => {
                setQuery(item.display_name);
                setResultados([]);
                if (onSelect)
                  onSelect({
                    name: item.display_name,
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon),
                  });
              }}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <ul
          className="absolute top-full mt-2 w-full max-w-lg bg-gray-900 border border-gray-700 rounded-xl 
                     shadow-lg z-[9999999999] overflow-hidden"
        >
          <p className="px-4 py-2 text-gray-200 hover:bg-blue-600 hover:text-white cursor-pointer transition-all">
            Buscando endereços...
          </p>
        </ul>
      )}
    </div>
  );
}
