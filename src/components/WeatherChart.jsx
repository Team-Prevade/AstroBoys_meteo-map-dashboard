import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeatherChart({ weatherData }) {
  // Dados de exemplo para o gráfico (fallback)
  const fallbackData = [
    { time: '00:00', temperature: 18, humidity: 75, precipitation: 0 },
    { time: '03:00', temperature: 16, humidity: 80, precipitation: 0.5 },
    { time: '06:00', temperature: 15, humidity: 85, precipitation: 1.2 },
    { time: '09:00', temperature: 20, humidity: 70, precipitation: 0.8 },
    { time: '12:00', temperature: 24, humidity: 65, precipitation: 0.2 },
    { time: '15:00', temperature: 26, humidity: 60, precipitation: 0 },
    { time: '18:00', temperature: 23, humidity: 70, precipitation: 0.1 },
    { time: '21:00', temperature: 19, humidity: 75, precipitation: 0.3 }
  ];

  // Processar dados da API ML da NASA
  let data = fallbackData;
  
  if (weatherData?.hourlyData && weatherData.hourlyData.length > 0) {
    // Converter dados da API ML para formato do gráfico
    data = weatherData.hourlyData.map((hour, index) => ({
      time: `${String(index * 3).padStart(2, '0')}:00`, // Aproximar horas
      temperature: hour.temperatura || 20,
      humidity: 70, // A API ML não fornece umidade por hora
      precipitation: hour.precipitacao || 0,
      windSpeed: hour.velocidade_vento || 0
    }));
    
    console.log('📈 Dados do gráfico da NASA ML:', data);
  } else if (weatherData?.rawData?.previsoes) {
    // Tentar usar dados brutos se hourlyData não estiver disponível
    data = weatherData.rawData.previsoes.map((hour, index) => ({
      time: `${String(index * 3).padStart(2, '0')}:00`,
      temperature: hour.temperatura || 20,
      humidity: 70,
      precipitation: hour.precipitacao || 0,
      windSpeed: hour.velocidade_vento || 0
    }));
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#EF4444" 
            strokeWidth={3}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            name="Temperatura (°C)"
          />
          <Line 
            type="monotone" 
            dataKey="humidity" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            name="Umidade (%)"
          />
          <Line 
            type="monotone" 
            dataKey="precipitation" 
            stroke="#10B981" 
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="Precipitação (mm)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
