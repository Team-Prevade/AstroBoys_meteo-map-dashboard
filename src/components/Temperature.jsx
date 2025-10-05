import { useEffect, useMemo, useState } from 'react';

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { WeatherIcon } from './WeatherIcones.jsx';

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

const date = { day: 5, month: 10, year: 2025 };
const address = { lat: -8.839, lon: 13.289 };

const FORECAST_ENDPOINT = `${URL_BACKEND}/weather/previsao?lat=${address.lat}&lon=${address.lon}&day=${date.day}&month=${date.month}&year=${date.year}`;

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  Accept: 'application/json',
};

const extractHour = (entry, fallbackIndex) => {
  if (typeof entry?.hora === 'number' && Number.isFinite(entry.hora)) {
    return entry.hora;
  }
  if (entry?.timestamp) {
    const date = new Date(entry.timestamp);
    if (!Number.isNaN(date.getTime())) {
      return date.getUTCHours();
    }
  }
  if (typeof entry?.hour === 'number' && Number.isFinite(entry.hour)) {
    return entry.hour;
  }
  return (fallbackIndex * 2) % 24;
};

const inferWeatherCondition = ({ temperature, precipitation, wind, hour }) => {
  const safeHour = Number.isFinite(hour) ? hour : 12;
  const isNight = safeHour < 6 || safeHour >= 18;

  if (Number.isFinite(precipitation) && precipitation >= 1) {
    return 'rain';
  }

  if (Number.isFinite(temperature) && temperature <= 0) {
    return 'snow';
  }

  if (Number.isFinite(precipitation) && precipitation >= 0.3) {
    return isNight ? 'partly-cloudy-night' : 'partly-cloudy-day';
  }

  if (Number.isFinite(wind) && wind >= 6) {
    return isNight ? 'partly-cloudy-night' : 'partly-cloudy-day';
  }

  if (Number.isFinite(temperature) && temperature >= 30) {
    return isNight ? 'clear-night' : 'clear-day';
  }

  if (Number.isFinite(temperature) && temperature >= 24) {
    return isNight ? 'partly-cloudy-night' : 'partly-cloudy-day';
  }

  if (Number.isFinite(temperature) && temperature <= 16) {
    return isNight ? 'clear-night' : 'cloudy';
  }

  return isNight ? 'clear-night' : 'cloudy';
};

const formatHourLabel = (entry, fallbackIndex) => {
  if (typeof entry?.hora === 'number' && Number.isFinite(entry.hora)) {
    return `${entry.hora.toString().padStart(2, '0')}:00`;
  }
  if (typeof entry?.time === 'string') return entry.time;
  if (entry?.timestamp) {
    const date = new Date(entry.timestamp);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }
  return `${(fallbackIndex * 2).toString().padStart(2, '0')}:00`;
};

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const deriveChartData = (inputData) => {
  const source = Array.isArray(inputData?.previsoes)
    ? inputData.previsoes
    : Array.isArray(inputData)
    ? inputData
    : [];

  return source
    .map((entry, index) => {
      const temperature = toNumber(
        entry.temp ?? entry.temperature ?? entry.tempC
      );
      const feelsLike = toNumber(
        entry.feelsLike ??
          entry.sensacaoTermica ??
          entry.aparente ??
          temperature,
        temperature
      );
      const precipitation = toNumber(
        entry.prec ?? entry.precipitacao ?? entry.rain
      );
      const wind = toNumber(entry.vento ?? entry.windSpeed ?? entry.gustSpeed);

      const label = formatHourLabel(entry, index);
      const timestamp = entry.timestamp ?? null;
      const hour = extractHour(entry, index);
      const condition =
        entry.condition ??
        inferWeatherCondition({
          temperature,
          precipitation,
          wind,
          hour,
        });

      if (!Number.isFinite(temperature)) return null;

      // papupupé da saída
      // console.log({
      //   id: timestamp ?? `${label}-${index}`,
      //   hourLabel: label,
      //   hour,
      //   temperature,
      //   feelsLike,
      //   precipitation,
      //   wind,
      //   timestamp,
      //   condition,
      // });

      return {
        id: timestamp ?? `${label}-${index}`,
        hourLabel: label,
        hour,
        temperature,
        feelsLike,
        precipitation,
        wind,
        timestamp,
        condition,
      };
    })
    .filter(Boolean);
};

const deriveSummary = (inputData, chartRows) => {
  if (inputData?.medias) {
    return {
      temp: toNumber(inputData.medias.temp, null),
      prec: toNumber(inputData.medias.prec, null),
      vento: toNumber(inputData.medias.vento, null),
    };
  }

  if (!chartRows.length) return { temp: null, prec: null, vento: null };

  const accum = chartRows.reduce(
    (acc, row) => {
      acc.temp += row.temperature;
      acc.prec += row.precipitation;
      acc.vento += row.wind;
      return acc;
    },
    { temp: 0, prec: 0, vento: 0 }
  );

  return {
    temp: accum.temp / chartRows.length,
    prec: accum.prec / chartRows.length,
    vento: accum.vento / chartRows.length,
  };
};

const buildDateLabel = (rows) => {
  if (!rows.length) return 'Sem dados disponíveis';
  const timestamp = rows.find((row) => row.timestamp)?.timestamp;
  if (!timestamp) return 'Previsão horária';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Previsão horária';
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return formatter.format(date);
};

const computeDomain = (values, padding = 2) => {
  if (!values.length) return [0, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [min - padding, max + padding];
  return [Math.floor(min - padding), Math.ceil(max + padding)];
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const temperature = payload.find((item) => item.dataKey === 'temperature');
  const feelsLike = payload.find((item) => item.dataKey === 'feelsLike');
  const precipitation = payload.find(
    (item) => item.dataKey === 'precipitation'
  );
  const wind = payload.find((item) => item.dataKey === 'wind');

  return (
    <div className="rounded-md bg-[#273054] p-3 text-xs text-white shadow-lg">
      <div className="mb-2 text-sm font-medium text-white">{label}</div>
      {temperature && (
        <div className="flex justify-between gap-8">
          <span className="text-white/70">Temperatura</span>
          <span className="font-semibold">
            {temperature.value?.toFixed?.(1)}°C
          </span>
        </div>
      )}
      {feelsLike && (
        <div className="flex justify-between gap-8">
          <span className="text-white/70">Sensação</span>
          <span className="font-semibold">
            {feelsLike.value?.toFixed?.(1)}°C
          </span>
        </div>
      )}
      {wind && (
        <div className="flex justify-between gap-8">
          <span className="text-white/70">Vento</span>
          <span className="font-semibold">{wind.value?.toFixed?.(1)} km/h</span>
        </div>
      )}
      {precipitation && (
        <div className="flex justify-between gap-8">
          <span className="text-white/70">Precipitação</span>
          <span className="font-semibold">
            {precipitation.value?.toFixed?.(1)} mm
          </span>
        </div>
      )}
    </div>
  );
};

const TemperatureChart = ({ data, variant = 'default' }) => {
  const isCompact = variant === 'compact';
  const [apiData, setApiData] = useState(null);
  const [fetchState, setFetchState] = useState({ loading: false, error: null });

  useEffect(() => {
    if (data) return; // When data is provided via props, skip fetching.

    let cancelled = false;
    const fetchForecast = async () => {
      try {
        setFetchState({ loading: true, error: null });
        const response = await fetch(FORECAST_ENDPOINT, {
          headers: NGROK_HEADERS,
        });
        if (!response.ok) {
          throw new Error(`Falha ao obter previsão (${response.status})`);
        }
        let json;
        try {
          json = await response.json();
        } catch {
          throw new Error('A resposta não está no formato JSON esperado.');
        }
        if (!cancelled) {
          setApiData(json);
          setFetchState({ loading: false, error: null });
          console.log('Dados da previsão carregados com sucesso.', json);
        }
      } catch (error) {
        if (!cancelled) {
          setApiData(null);
          setFetchState({
            loading: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
          });
        }
      }
    };

    fetchForecast();

    return () => {
      cancelled = true;
    };
  }, [data]);

  const infoSource = data ?? apiData;
  const dataset = useMemo(
    () => infoSource ?? { previsoes: [], medias: null },
    [infoSource]
  );

  const chartRows = useMemo(() => deriveChartData(dataset), [dataset]);
  const summary = useMemo(
    () => deriveSummary(dataset, chartRows),
    [dataset, chartRows]
  );
  const dateLabel = useMemo(() => buildDateLabel(chartRows), [chartRows]);

  const temperatureValues = chartRows.map((row) => row.temperature);
  const feelsLikeValues = chartRows.map((row) => row.feelsLike);
  const precipitationValues = chartRows.map((row) => row.precipitation);
  const windValues = chartRows.map((row) => row.wind);

  const tempDomain = computeDomain([...temperatureValues, ...feelsLikeValues]);
  const precipWindMax = Math.max(1, ...precipitationValues, ...windValues);

  const hasConditions = chartRows.some((row) => row.condition);

  const metrics = [
    {
      label: 'Temperatura média',
      value: summary.temp,
      suffix: '°C',
    },
    {
      label: 'Precipitação média',
      value: summary.prec,
      suffix: 'mm',
    },
    {
      label: 'Vento médio',
      value: summary.vento,
      suffix: 'km/h',
    },
  ];

  const containerClasses = `mb-5 rounded-lg bg-[#1e2746] text-white ${
    isCompact ? 'p-3' : 'p-4'
  }`;
  const headerClasses = `${
    isCompact ? 'mb-3' : 'mb-4'
  } flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between`;

  return (
    <div className={containerClasses}>
      <div className={headerClasses}>
        <div>
          <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-medium`}>
            Previsão de temperatura
          </h3>
          <p
            className={`${
              isCompact ? 'text-xs' : 'text-sm'
            } capitalize text-white/70`}
          >
            {dateLabel}
          </p>
        </div>
        <div
          className={`flex flex-wrap items-center ${
            isCompact ? 'gap-2 text-[11px]' : 'gap-3 text-xs'
          } text-white/60`}
        >
          {infoSource?.inputs?.lat && infoSource?.inputs?.lon && (
            <span>
              Lat: {Number(infoSource.inputs.lat).toFixed(3)} | Lon:{' '}
              {Number(infoSource.inputs.lon).toFixed(3)}
            </span>
          )}
          {chartRows.length > 0 && <span>{chartRows.length} horas</span>}
          {!data && (
            <span className="whitespace-nowrap">
              {fetchState.loading
                ? 'Buscando dados da API...'
                : fetchState.error
                ? `Erro: ${fetchState.error}`
                : 'Dados em tempo real'}
            </span>
          )}
        </div>
      </div>

      <div
        className={
          isCompact
            ? 'mb-3 grid grid-cols-2 gap-2 text-xs'
            : 'mb-4 grid gap-3 text-sm sm:grid-cols-3'
        }
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-md bg-white/5 text-center backdrop-blur-sm ${
              isCompact ? 'p-2' : 'p-3'
            }`}
          >
            <p
              className={`${
                isCompact ? 'text-[11px]' : 'text-xs'
              } uppercase tracking-wide text-white/60`}
            >
              {metric.label}
            </p>
            <p
              className={`${
                isCompact ? 'mt-1 text-base' : 'mt-1 text-lg'
              } font-semibold text-white`}
            >
              {metric.value != null ? metric.value.toFixed(1) : '--'}
              <span
                className={`${
                  isCompact ? 'ml-1 text-xs' : 'ml-1 text-sm'
                } text-white/60`}
              >
                {metric.suffix}
              </span>
            </p>
          </div>
        ))}
      </div>

      {chartRows.length > 0 && (
        <div className="no-scrollbar mb-3 overflow-x-auto">
          <div
            className={`flex min-w-max ${
              isCompact ? 'gap-3 px-2' : 'gap-4 px-4'
            }`}
          >
            {chartRows.map((item) => (
              <div
                key={`slot-${item.id}`}
                className={`flex flex-col items-center text-center ${
                  isCompact ? 'w-12 gap-1' : 'w-14 gap-2'
                }`}
              >
                <span
                  className={`${
                    isCompact ? 'text-[11px]' : 'text-xs'
                  } text-[#aaaaaa]`}
                >
                  {item.hourLabel}
                </span>
                {hasConditions ? (
                  item.condition ? (
                    <WeatherIcon
                      condition={item.condition}
                      size={isCompact ? 'compact' : 'default'}
                    />
                  ) : (
                    <span
                      className={`${
                        isCompact ? 'text-[11px]' : 'text-xs'
                      } text-white/50`}
                    >
                      --
                    </span>
                  )
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={isCompact ? 'h-[180px]' : 'h-[220px]'}>
        {chartRows.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartRows}
              margin={{
                top: isCompact ? 6 : 10,
                right: isCompact ? 20 : 30,
                left: isCompact ? 20 : 30,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8E50" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#FF8E50" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334166" />
              <XAxis
                dataKey="hourLabel"
                tick={{ fill: '#aaaaaa', fontSize: isCompact ? 11 : 12 }}
                axisLine={{ stroke: '#334166' }}
              />
              <YAxis
                yAxisId="temp"
                domain={tempDomain}
                tick={{ fill: '#aaaaaa', fontSize: isCompact ? 11 : 12 }}
                axisLine={{ stroke: '#334166' }}
                label={{
                  value: 'Temperatura (°C)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#aaaaaa',
                  dx: isCompact ? -6 : -10,
                }}
              />
              <YAxis
                yAxisId="precip"
                orientation="right"
                domain={[0, Math.ceil(precipWindMax + 0.5)]}
                tick={{ fill: '#aaaaaa', fontSize: isCompact ? 11 : 12 }}
                axisLine={{ stroke: '#334166' }}
                label={{
                  value: 'Precipitação / Vento',
                  angle: 90,
                  position: 'insideRight',
                  fill: '#aaaaaa',
                  dx: isCompact ? 6 : 10,
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#334166' }}
              />
              <Bar
                yAxisId="precip"
                dataKey="precipitation"
                fill="#4FB3FC"
                radius={[4, 4, 0, 0]}
                barSize={10}
              />
              <Area
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="#FF8E50"
                fill="url(#tempGradient)"
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
              <Line
                yAxisId="precip"
                type="monotone"
                dataKey="wind"
                stroke="#FFD700"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div
            className={
              isCompact
                ? 'flex h-full items-center justify-center text-xs text-white/60'
                : 'flex h-full items-center justify-center text-sm text-white/60'
            }
          >
            Nenhuma previsão disponível para exibir.
          </div>
        )}
      </div>

      <div
        className={`flex flex-wrap ${
          isCompact ? 'mt-2 gap-3 text-xs' : 'mt-3 gap-4 text-sm'
        }`}
      >
        <div className="flex items-center">
          <span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#FF8E50]" />
          <span>Temperatura (°C)</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 inline-block h-[2px] w-6 bg-[#FFD700]" />
          <span>Vento (km/h)</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 inline-block h-3 w-3 rounded bg-[#4FB3FC]" />
          <span>Precipitação (mm)</span>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;
