export default function Sidebar({ coords, onClose }) {
  if (!coords) return null;

  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-5 overflow-y-auto z-50">
      <button
        onClick={onClose}
        className="mb-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ✖ Fechar
      </button>

      <h2 className="text-xl font-semibold mb-4">Detalhes da Área</h2>
      <p><b>Latitude:</b> {coords.lat.toFixed(3)}</p>
      <p><b>Longitude:</b> {coords.lng.toFixed(3)}</p>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Dados Meteorológicos</h3>
        <ul className="space-y-1">
          <li>Temperatura média: 24°C</li>
          <li>Min: 18°C  Max: 30°C</li>
          <li>midade: 72%</li>
          <li>Velocidade do vento 40km/s</li>

        </ul>
        <p>Apenas Exemplo depois vamos passar os dados corretamente aqui</p>
      </div>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Gráficos</h3>
        <div className="bg-gray-900 text-white h-40 rounded-2xl flex items-center justify-center">
             <p >
          (gráfico aqui futuramente)
        </p>
        </div>
       
      </div>
    </aside>
  );
}
