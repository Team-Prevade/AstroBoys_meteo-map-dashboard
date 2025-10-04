import NasaLogo from '../assets/logo/NASA_logo.width-580.png';
import SearchBar from "./tools/Searchbar";
import { FaGlobe, FaMapMarkedAlt, FaCloudRain } from "react-icons/fa";

export default function Header({ onLocationSelect }) {
  return (
    <header className="gradient-primary shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo e Título */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={NasaLogo} 
              alt="Logo NASA" 
              className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              MeteoMap
            </h1>
            <p className="text-sm text-blue-200 font-medium">
              NASA Space Apps Challenge 2025
            </p>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex-1 max-w-2xl mx-8">
          <SearchBar onLocationSelect={onLocationSelect} />
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 hover-lift">
            <FaGlobe className="text-white" />
            <span className="text-sm font-medium text-white">Global</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 hover-lift">
            <FaMapMarkedAlt className="text-white" />
            <span className="text-sm font-medium text-white">Mapa</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 hover-lift">
            <FaCloudRain className="text-white" />
            <span className="text-sm font-medium text-white">Tempo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
