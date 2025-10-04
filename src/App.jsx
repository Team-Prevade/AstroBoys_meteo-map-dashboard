import { useState } from "react";
import Header from "./components/Header";
import MapView from "./components/Map";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

export default function App() {
  const [coords, setCoords] = useState(null);

  return (
    <div className="flex flex-col h-screen">
      <Header setCoords={setCoords}/>
      <div className="flex-1 relative">
        <MapView onAreaClick={setCoords} coords={coords} setCoords={setCoords} />
        <Sidebar coords={coords} onClose={() => setCoords(null)} />
      </div>
      <Footer />
    </div>
  );
}
