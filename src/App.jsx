import { useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import MapView from './components/Map';
import Sidebar from './components/Sidebar';

export default function App() {
  const [coords, setCoords] = useState(null);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 relative">
        <MapView onAreaClick={setCoords} />
        <Sidebar coords={coords} onClose={() => setCoords(null)} />
      </div>
      <Footer />
    </div>
  );
}
