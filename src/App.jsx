import { useState } from "react";
import Header from "./components/Header";
import MapView from "./components/Map";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

export default function App() {
  const [coords, setCoords] = useState(null);
  const [coordsAndData, setCoordsAndData] = useState(null);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1">
        <MapView onAreaClick={setCoords}  setCoordsAndData={setCoordsAndData}/>
        <Sidebar coordsAndData={coordsAndData} onClose={() => setCoordsAndData(null)} />
      </div>
      <Footer />
    </div>
  );
}
