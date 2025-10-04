import NasaLogo from '../assets/logo/NASA_logo.width-580.png';
import SearchBar from "./tools/Searchbar"
export default function Header() {
  return (
    <header className="flex gap-60  items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      <div className="flex items-center space-x-3">
        <img src={NasaLogo} alt="NASA Logo" className="w-10 h-10"/>
        <h1 className="text-xl font-bold">NASA Apps Challenge — MeteoMap</h1>
      </div>
      <div className={"flex w-screen"}>
        <SearchBar />
      </div>
    </header>
  );
}
