import React, { useState, useEffect, useRef } from "react";

export default function Searchbar( { setCoords } ) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const timer = useRef(null);

  // Função de busca automática (com debounce)
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=5`,
          {
            headers: {
              "Accept-Language": "pt-BR",
              "User-Agent": "LearnApp/1.0 (erasmo@example.com)", // importante para API pública
            },
          }
        );
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Erro ao buscar:", err);
      } finally {
        setLoading(false);
      }
    }, 400); 
  }, [query]);

  return (
    <div className="relative w-64">
      <input
        type="text"
        placeholder="Pesquisar local..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
        className="px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none w-full"
      />


      {loading && (
        <p className="absolute bg-gray-900 text-gray-400 text-sm mt-1 p-2 rounded-md w-full">
          Buscando...
        </p>
      )}

      {!loading && results.length > 0 && (
        <ul className="absolute bg-gray-900 text-white mt-1 rounded-md w-full max-h-56 overflow-y-auto shadow-lg z-10">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => {
                setSelected(r);
                setCoords({ lat: Number.parseFloat(r.lat), lng: Number.parseFloat(r.lon) })
                setQuery(r.display_name);
                setQuery("");
                setResults([]);
              }}
              className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
