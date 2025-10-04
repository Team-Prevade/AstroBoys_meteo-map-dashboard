
import { useState } from "react";

export default function Searchbar() {
  const [query, setQuery] = useState("");  
  const [error, setError] = useState("");   

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (query.trim() === "") {
      setError("Digite algo antes de pesquisar!");
    } else {
      setError("");
      console.log("🔎 Pesquisando:", query);
      
      
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col items-start">
        <input
          type="text"
          placeholder="Pesquisar local..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}  
          className="px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none w-64"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Pesquisar
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
}

import { FaSearch} from "react-icons/fa";
import {useState} from "react";

export default function Searchbar({buscar}){
  const [query, setQuery] = useState(""); 

  const handleSubmit = (e) =>{
    e.preventDefault();
    if(buscar) buscar(query);// chama a funcao que vai buscar o local
  };
  
    return(
        <div className="flex justify-center w-full">
          <form onSubmit={handleSubmit} className="flex items-center bg-gray-700 rounded-md p-2">
            <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pesquisar local..."
        className="px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none w-64"
      />
      <button type="submit">
        <FaSearch className="text-white ml-2 " />
      </button>
          </form>
        
        </div>
    )
}
 
