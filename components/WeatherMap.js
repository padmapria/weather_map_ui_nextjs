import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import WeatherChart from './WeatherChart';
// First dynamically import Leaflet to ensure window is available
const Leaflet = dynamic(
  () => {
    const L = require('leaflet');
    // Fix Leaflet marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
    return L;
  },
  { ssr: false }
);

// dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const WeatherMap = () => {
  const [weatherChartData, setWeatherChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=temperature_2m,relativehumidity_2m&timezone=Asia%2FSingapore&start_date=2025-07-07&end_date=2025-07-14')
      .then(response => {
        setWeatherChartData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="weather-container">
      <div className="map-container">
        {/* Your existing map implementation */}
      </div>
      
      <div className="chart-container">
        <h2>Hourly Weather Data (July 7-27, 2025)</h2>
        {loading ? (
          <p>Loading chart data...</p>
        ) : weatherChartData ? (
          <WeatherChart weatherChartData={weatherChartData} />
        ) : (
          <p>No weather data available</p>
        )}
        
      </div>

      <style jsx>{`
        .weather-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .map-container, .chart-container {
          width: 100%;
        }
        .chart-container {
          height: 400px;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default WeatherMap;