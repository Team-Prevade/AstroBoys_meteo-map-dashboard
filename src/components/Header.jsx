import NasaLogo from "../assets/logo/NASA_logo.width-580.png";
import SearchBar from "./tools/Searchbar";

export default function Header() {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-gray-900 text-white shadow-md gap-4">
     
      <div className="flex items-center space-x-3 text-center md:text-left">
        <img src={NasaLogo} alt="NASA Logo" className="w-10 h-10" />
        <h1 className="text-lg md:text-xl font-bold leading-tight">
          NASA Apps Challenge — MeteoMap
        </h1>
      </div>
      

      
      <div className="w-full md:w-auto">
        <SearchBar />
      </div>
    </header>
  );
}
