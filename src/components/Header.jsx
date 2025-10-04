import NasaLogo from "../assets/logo/NASA_logo.width-580.png";
import SearchBar from "./tools/Searchbar";

export default function Header() {
  return (
    <header className=" top-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4">
        
      
        <div className="flex items-center space-x-3 text-center md:text-left">
          <img 
            src={NasaLogo} 
            alt="NASA Logo" 
            className="w-12 h-12 md:w-14 md:h-14 object-contain" 
          />
          <h1 className="text-lg md:text-2xl font-extrabold leading-tight tracking-tight">
            <span className="text-blue-400">NASA</span> Space Apps Challenge
            <span className="block text-sm md:text-base font-medium text-gray-400">
              MeteoMap
            </span>
          </h1>
        </div>

        
        <div className="w-full md:w-auto">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
