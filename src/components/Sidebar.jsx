import { X } from "lucide-react";

export default function Sidebar({ coords, onClose }) {
  if (!coords) return null;

  return (
    <aside className="fixed right-0 top-0 h-full w-80 md:w-96 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out animate-slideIn">
  
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Detalhes da Área</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>

  
      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Latitude:</span>{" "}
          {coords.lat.toFixed(3)}
        </p>
        <p>
          <span className="font-semibold">Longitude:</span>{" "}
          {coords.lng.toFixed(3)}
        </p>
      </div>

  
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Dados Meteorológicos
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li>🌡️ Temperatura média: <b>24°C</b></li>
          <li>⬆️ Max: <b>30°C</b> | ⬇️ Min: <b>18°C</b></li>
          <li>💧 Umidade: <b>72%</b></li>
          <li>🌬️ Vento: <b>40 km/h</b></li>
        </ul>
        <p className="text-xs text-gray-400 mt-2">
          *Exemplo – os dados reais serão exibidos aqui futuramente.
        </p>
      </div>

      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Gráficos</h3>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white h-44 rounded-2xl flex items-center justify-center shadow-md">
          <p className="text-sm opacity-80">(gráfico aqui futuramente)</p>
        </div>
      </div>
    </aside>
  );
}
