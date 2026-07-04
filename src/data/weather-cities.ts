export interface WeatherCity {
  ville: string
  lat: number
  lon: number
}

export const WEATHER_CITIES: WeatherCity[] = [
  { ville: 'Abidjan',      lat: 5.3097, lon: -4.0083 },
  { ville: 'Bouaké',       lat: 7.6900, lon: -5.0300 },
  { ville: 'Yamoussoukro', lat: 6.8276, lon: -5.2893 },
  { ville: 'San-Pédro',    lat: 4.7485, lon: -6.6363 },
  { ville: 'Daloa',        lat: 6.8770, lon: -6.4502 },
  { ville: 'Korhogo',      lat: 9.4580, lon: -5.6296 },
  { ville: 'Abengourou',   lat: 6.7297, lon: -3.4964 },
]
