import { motion } from "framer-motion";
import { useState } from "react";

export default function ModalConfirmarLocalizacao({ isOpen, onClose, onConfirm, coords }) {
  const [step, setStep] = useState("confirm-location");
  const [date, setDate] = useState("");

  if (!isOpen) return null;

  const handleConfirmLocation = () => {
    setStep("confirm-date");
  };

  const handleFinalConfirm = () => {
    if (!date) return alert("Por favor, selecione uma data antes de confirmar.");
    onConfirm({ coords, date });
    setStep("confirm-location");
    setDate("");
    onClose();
  };

  const handleClose = () => {
    setStep("confirm-location");
    setDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 text-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md"
      >
        {step === "confirm-location" ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">📍 Confirmar Localização</h2>
            <p className="text-gray-300 text-center mb-6">
              Deseja confirmar esta localização?
            </p>

            <div className="flex justify-center gap-6 mb-6 text-sm">
              <div className="bg-gray-800 px-4 py-2 rounded-lg">
                <b>Latitude:</b> {coords?.lat.toFixed(4)}
              </div>
              <div className="bg-gray-800 px-4 py-2 rounded-lg">
                <b>Longitude:</b> {coords?.lng.toFixed(4)}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLocation}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all"
              >
                Confirmar
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">🗓️ Confirmar Data</h2>
            <p className="text-gray-300 text-center mb-4">
              Escolha uma data para associar a esta localização.
            </p>

            <div className="flex justify-center mb-6">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleFinalConfirm}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all"
              >
                Confirmar Data
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
