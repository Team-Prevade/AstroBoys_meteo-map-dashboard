const WEATHER_ICON_BY_CONDITION = {
  'clear-day': '☀️',
  'clear-night': '🌙',
  'partly-cloudy-day': '⛅',
  'partly-cloudy-night': '☁️🌙',
  cloudy: '☁️',
  rain: '🌧️',
  snow: '❄️',
  sleet: '🌨️',
};

/**
 * Ícone meteorológico representado por um emoji.
 */
export const WeatherIcon = ({ condition }) => {
  const icon = WEATHER_ICON_BY_CONDITION[condition] ?? '☁️';
  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center text-xl"
      role="img"
      aria-label={condition || 'cloudy'}
    >
      {icon}
    </span>
  );
};

const DIRECTION_ROTATION = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

/**
 * Ícone de direção do vento com rotação dinâmica.
 */
export const WindDirectionIcon = ({ direction }) => {
  const rotation = DIRECTION_ROTATION[direction] ?? 0;
  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center text-base text-white"
      style={{ transform: `rotate(${rotation}deg)` }}
      role="img"
      aria-label={`vento ${direction ?? 'N'}`}
    >
      ↑
    </span>
  );
};
