import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WeatherChart from './WeatherChart';

//Leaflet Icon Configuration
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

//Dynamic Imports for Leaflet Components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

//TemperatureDisplay Component
const TemperatureDisplay = ({ weatherChartData }) => {
  if (!weatherChartData || !weatherChartData.hourly) return null;

  const today = new Date().toISOString().split('T')[0];
  const { time, temperature_2m, relativehumidity_2m } = weatherChartData.hourly;

  const todayData = time.map((t, i) => 
    t.startsWith(today) ? {
      temp: temperature_2m[i],
      humidity: relativehumidity_2m[i]
    } : null
  ).filter(data => data !== null);

  if (todayData.length === 0) return null;

  const avgTemp = (todayData.reduce((sum, data) => sum + data.temp, 0) / todayData.length).toFixed(1);
  const avgHumidity = Math.round(todayData.reduce((sum, data) => sum + data.humidity, 0) / todayData.length);

  return (
    <div className="temperature-display">
      <h4>Today's Average Trend</h4>
      <div className="d-flex justify-content-between mt-3">
        <div className="text-center">
          <div className="fs-3 text-danger">{avgTemp}°C</div>
          <div className="text-muted">Temperature</div>
        </div>
        <div className="text-center">
          <div className="fs-3 text-primary">{avgHumidity}%</div>
          <div className="text-muted">Humidity</div>
        </div>
      </div>
    </div>
  );
};

//Main Component: SingaporeWeatherMap
const SingaporeWeatherMap = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherChartData, setWeatherChartData] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef(null);
  const markerRefs = useRef({});

  useEffect(() => {
    // Fetches 2-hour weather forecast data from Singapore government API
    axios.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast')
      .then(response => setWeatherData(response.data));
  }, []);

useEffect(() => {
  // Fetches 7-day forecast data from Open-Meteo API
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 7); // 7-day forecast

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=temperature_2m,relativehumidity_2m&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&timezone=Asia%2FSingapore`
      );
      setWeatherChartData(response.data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  const handleMarkerClick = (area) => {
    // Finds forecast for clicked area and updates selectedArea state
    const forecast = weatherData.items[0].forecasts.find(f => f.area === area.name);
    setSelectedArea({
      ...area,
      forecast: forecast?.forecast || 'No data',
      updated: weatherData.items[0].update_timestamp
    });
  };

  if (!weatherData) return <div className="loading">Loading weather data...</div>;

  return (
    <div className="fullscreen-container">
       {/* Header */}
      <header className="map-header bg-white p-3 shadow-sm">
        <h3 className="m-0">Singapore 2-Hour Weather Forecast</h3>
      </header>

      {/* Search Bar */}
      <div className="search-bar position-absolute top-70 start-20 z-1100 bg-white p-2 rounded shadow-sm">
        <input
          type="text"
          className="form-control"
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
       {/* Map Container */}
      <div className="map-wrapper">
        <MapContainer
          center={[1.3521, 103.8198]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(map) => {
            mapRef.current = map;
            setMapLoaded(true);
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
           {/* Markers for each area */}
          {weatherData.area_metadata.map(area => (
            <Marker
              key={area.name}
              position={[area.label_location.latitude, area.label_location.longitude]}
              eventHandlers={{ click: () => handleMarkerClick(area) }}
            >

            {/* Popup with detailed weather information */}
            <Popup className="weather-popup" maxWidth={800}>
              <div className="container-fluid p-3">
                <div className="row g-3">
                  <div className="col-md-5">
                    <div className="weather-details-column p-3">
                      <h3>{area.name}</h3>
                      {selectedArea?.name === area.name && (
                        <>
                        <div className={`badge ${selectedArea.forecast.toLowerCase().includes('rain') ? 'bg-primary' : 'bg-success'} mb-2 fs-6 p-1`}>
                            {selectedArea.forecast}
                          </div>
                          <div className="weather-meta">
                            <p><strong>Updated:</strong> {new Date(selectedArea.updated).toLocaleTimeString()}</p>
                            <p><strong>Location:</strong> {area.label_location.latitude.toFixed(4)}, {area.label_location.longitude.toFixed(4)}</p>
                            <TemperatureDisplay weatherChartData={weatherChartData} />
                            {/* Mini map showing the area */}
                            <div className="mini-map-container mt-3">
                              <MapContainer
                                center={[area.label_location.latitude, area.label_location.longitude]}
                                zoom={13}
                                style={{ height: '150px', width: '100%' }}
                                scrollWheelZoom={false}
                                dragging={false}
                                doubleClickZoom={false}
                                zoomControl={false}
                                attributionControl={false}
                              >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[area.label_location.latitude, area.label_location.longitude]} />
                              </MapContainer>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-7">
                    {/* Weather chart column */}
                    <div className="chart-column p-3">
                      <h4>Weekly Temperature / Humidity Trend</h4>
                      {weatherChartData ? (
                        <WeatherChart weatherChartData={weatherChartData} />
                      ) : (
                        <p>No weather data available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default SingaporeWeatherMap;
