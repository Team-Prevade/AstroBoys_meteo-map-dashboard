"use client";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Bot } from "lucide-react";
export default function ChatBotFlutuanteGemini( {Loc} ) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyA500DyLwtY8f_t0FnGYrrXdbJXz6BHgD0",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages, open]);

  const enviarMensagem = async () => {
    if (!input.trim()) return;

    const usuarioMensagem = { sender: "user", text: input };
    setMessages((prev) => [...prev, usuarioMensagem]);
    setInput("");
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Você é especialista em metrologia. Sua localização actual é essa: ${Loc} Responda a seguinte pergunta de forma clara: ${input}`,
      });

      const botMensagem = {
        sender: "bot",
        text: response?.text || "Não consegui gerar a resposta.",
      };

      setMessages((prev) => [...prev, botMensagem]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Erro ao comunicar com o Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") enviarMensagem();
  };

  return (
    <>
      {/* Botão flutuante */}
      {!open && (
  <motion.button
    onClick={() => setOpen(true)}
    className="fixed bottom-5 right-5 bg-gray-900 from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
    animate={{ y: [0, -6, 0] }} // sobe 6px e volta
    transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
  >
    <Bot />
  </motion.button>
)}

      {/* Chat flutuante */}
      {open && (
        <div className="fixed bottom-5 right-5 w-80 h-[400px] flex flex-col border border-gray-200 rounded-2xl shadow-2xl bg-white">
          {/* Cabeçalho */}
          <div className="bg-gray-900 from-blue-500 to-blue-600 text-white p-3 flex justify-between items-center rounded-t-2xl shadow-md">
            <span className="font-semibold">Chat Metrologia</span>
            <button
              onClick={() => setOpen(false)}
              className="font-bold text-lg hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl max-w-[75%] break-words ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end text-gray-800"
                    : "bg-white self-start text-gray-900 shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 italic text-sm">Escrevendo...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-gray-200 bg-white rounded-b-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta sobre metrologia..."
              className="flex-1 border border-gray-300 rounded-2xl p-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={enviarMensagem}
              className="bg-gray-900 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition-colors"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
