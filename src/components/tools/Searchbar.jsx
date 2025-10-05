import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { searchAddress } from '../../utils/helperMaps';

export default function Searchbar({ setData }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim() === '') {
      setError('Digite algo antes de pesquisar!');
    } else {
      setError('');
      try {
        const results = await searchAddress({
          address: query,
          language: 'pt-BR',
          limit: 5,
        });

        if (results.length === 0) {
          setError('Nenhum resultado encontrado para essa pesquisa.');
        } else {
          console.log('Resultados da Geoapify:', results);
          setData(results);
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao buscar o endereço. Tente novamente.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-lg bg-gray-800 rounded-full shadow-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
      >
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Pesquisar local..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
        >
          Buscar
        </button>
      </form>

      {error && (
        <p className="text-red-500 mt-2 text-sm animate-pulse">{error}</p>
      )}
    </div>
  );
}
