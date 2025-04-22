import {DailyForecast} from '../../features/weekleForecast/weekleForecast';

interface WeklyForecastProps {
  forecast: Record<string, DailyForecast> | null;
}

export default WeklyForecastProps;
