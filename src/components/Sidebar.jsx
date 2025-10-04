import { useEffect, useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gerarMensagemClimatica } from "../utils/weatherText";

export default function Sidebar({ coordsAndData, onClose }) {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [dados, setDados] = useState(null);

  useEffect(() => {
    if (!coordsAndData) return;

    const fetchData = async () => {
      setLoading(true);
      setErro(null);
      setDados(null);

      try {
        const { coords, date } = coordsAndData;
        const [year, month, day] = date.split("-");

        const url = `https://delois-sandlike-widely.ngrok-free.dev/api/weather/previsao?lat=${coords.lat}&lon=${coords.lng}&day=${day}&month=${month}&year=${year}`;

        const response = await fetch(url, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Erro HTTP ${response.status}: ${text.slice(0, 80)}...`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Resposta inesperada:", text);
          throw new Error("A resposta do servidor não está em formato JSON.");
        }

        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar dados meteorológicos:", error);
        setErro(
          "Não foi possível carregar os dados meteorológicos. Verifique a conexão ou tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coordsAndData]);

  if (!coordsAndData) return null;

  const medias = dados?.medias;

  // 🗣️ Gera mensagem climática assim que as médias existirem
  const mensagemClima = medias
    ? gerarMensagemClimatica({
        temperatura: medias.temp ?? 0,
        prec: medias.prec ?? 0,
        vento: medias.vento ?? 0,
      })
    : null;

  return (
    <aside className="fixed right-0 top-[88px] h-[79.5vh] w-80 md:w-96 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out animate-slideIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Detalhes da Área</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Coordenadas e data */}
      <div className="text-gray-700 mb-6">
        <p>
          <span className="font-semibold">Latitude:</span>{" "}
          {coordsAndData.coords.lat.toFixed(3)}
        </p>
        <p>
          <span className="font-semibold">Longitude:</span>{" "}
          {coordsAndData.coords.lng.toFixed(3)}
        </p>
        <p>
          <span className="font-semibold">Data:</span> {coordsAndData.date}
        </p>
      </div>

      {/* Conteúdo dinâmico */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64 text-gray-600"
          >
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-3" />
            <p className="text-sm animate-pulse">
              Carregando dados meteorológicos...
            </p>
          </motion.div>
        ) : erro ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64 text-red-600 text-center"
          >
            <AlertCircle className="h-10 w-10 mb-3" />
            <p className="font-medium mb-3">{erro}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Tentar novamente
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 🔊 Mensagem gerada automaticamente */}
            {mensagemClima && (
              <motion.div
                key="mensagem"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm"
              >
                <p className="text-gray-700 text-sm leading-relaxed">
                  {mensagemClima}
                </p>
              </motion.div>
            )}

            <div className="mt-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Dados Meteorológicos
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  🌡️ Temperatura média:{" "}
                  <b>{medias?.temp?.toFixed(1) ?? "--"}°C</b>
                </li>
                <li>
                  💧 Precipitação média:{" "}
                  <b>{medias?.prec?.toFixed(2) ?? "--"} mm</b>
                </li>
                <li>
                  🌬️ Vento médio: <b>{medias?.vento?.toFixed(1) ?? "--"} km/h</b>
                </li>
              </ul>

              <p className="text-xs text-gray-400 mt-2">
                *Dados obtidos da API meteorológica (LARC/NASA via proxy ngrok).
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Gráficos (em breve)
              </h3>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white h-44 rounded-2xl flex items-center justify-center shadow-md">
                <p className="text-sm opacity-80">Gráficos futuros aqui</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
