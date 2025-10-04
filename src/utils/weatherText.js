export function gerarMensagemClimatica({ temperatura, prec, vento }) {
  let mensagens = [];

  // 🌡️ Temperatura
  if (temperatura >= 30) {
    mensagens.push("Está bem quente hoje! Lembre-se de se hidratar 💧.");
  } else if (temperatura >= 24) {
    mensagens.push("O clima está agradável, perfeito para um passeio ao ar livre ☀️.");
  } else if (temperatura >= 18) {
    mensagens.push("O tempo está fresco, ideal para uma caminhada leve 🌤️.");
  } else if (temperatura >= 12) {
    mensagens.push("Está um pouco frio, talvez uma blusa caia bem 🧥.");
  } else {
    mensagens.push("Bastante frio hoje! Melhor ficar quentinho em casa ☕.");
  }

  // 💧 Precipitação
  if (prec > 5) {
    mensagens.push("A chuva será forte, leve guarda-chuva e evite sair se puder ☔.");
  } else if (prec > 1) {
    mensagens.push("Pode chover um pouco, talvez um guarda-chuva seja útil 🌧️.");
  } else {
    mensagens.push("Sem chuva prevista — ótimo para atividades ao ar livre 🌞.");
  }

  // 🌬️ Vento
  if (vento > 40) {
    mensagens.push("O vento estará forte, cuidado com objetos soltos 🌪️.");
  } else if (vento > 20) {
    mensagens.push("Haverá vento moderado, mas nada que atrapalhe o dia 🍃.");
  } else {
    mensagens.push("O vento está calmo, um dia tranquilo para sair 🌿.");
  }

  // 🔄 Junta tudo em um parágrafo fluido
  return mensagens.join(" ");
}
