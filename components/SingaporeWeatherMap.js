import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WeatherChart from './WeatherChart';

if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Temperature display component (updated)
const TemperatureDisplay = ({ weatherChartData }) => {
  if (!weatherChartData || !weatherChartData.hourly) return null;

  const today = new Date().toISOString().split('T')[0];
  const { time, temperature_2m, relativehumidity_2m } = weatherChartData.hourly;

  // Filter today's data
  const todayData = time.map((t, i) => 
    t.startsWith(today) ? {
      temp: temperature_2m[i],
      humidity: relativehumidity_2m[i]
    } : null
  ).filter(data => data !== null);

  if (todayData.length === 0) return null;

  // Calculate averages
  const avgTemp = (todayData.reduce((sum, data) => sum + data.temp, 0) / todayData.length).toFixed(1);
  const avgHumidity = (todayData.reduce((sum, data) => sum + data.humidity, 0) / todayData.length);
  const roundedHumidity = Math.round(avgHumidity);

  return (
    <div className="temperature-display">
      <h2>Today's Average Trend</h2>
      <br/>
      <div className="temp-value">
        <span className="temp-figure">{avgTemp}°C</span>
        <span className="temp-label"> Temperature</span>
        <br/>
        <br/>
        <span className="temp-figure">{roundedHumidity}%</span>
        <span className="temp-label"> Humidity</span>
      </div>
    </div>
  );
};

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

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
    axios.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast')
      .then(response => {
        setWeatherData(response.data);
      });
  }, []);

  useEffect(() => {
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=temperature_2m,relativehumidity_2m&timezone=Asia%2FSingapore&start_date=2025-07-22&end_date=2025-07-29')
      .then(response => {
        setWeatherChartData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleMarkerClick = (area) => {
    //alert(`handleMarkerClick called for: ${area.name}`);
    const forecast = weatherData.items[0].forecasts.find(f => f.area === area.name);
    console.log('Forecast object:', forecast);
    setSelectedArea({
      ...area,
      forecast: forecast?.forecast || 'No data',
      updated: weatherData.items[0].update_timestamp
    });
  };

  const handleSearch = () => {
    //alert(`Search triggered for: ${searchTerm}`);
    const match = weatherData.area_metadata.find(area =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    //alert(match ? `Match found: ${match.name}` : 'No match found');
    console.log('Match object:', match);
   
    if (match.name) {
      // Set selected area and open popup
      //handleMarkerClick(match);

    } else {
      alert("Location not found or map not ready.");
    }
  };

  if (!weatherData) return <div className="loading">Loading weather data...</div>;

  return (
    <div className="fullscreen-container">
      <header className="map-header">
        <h3>Singapore 2-Hour Weather Forecast</h3>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[1.3521, 103.8198]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
            setMapLoaded(true);
            console.log('Map loaded.');
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />

          {weatherData.area_metadata.map(area => (
            <Marker
              key={area.name}
              position={[area.label_location.latitude, area.label_location.longitude]}
              ref={(ref) => {
                if (ref) markerRefs.current[area.name] = ref;
              }}
              eventHandlers={{ click: () => handleMarkerClick(area) }}
            >
              <Popup className="weather-popup" maxWidth={800}>
                <div className="popup-content">
                  <div className="popup-grid">
                    <div className="weather-details-column">
                      <h3>{area.name}</h3>
                      <div className="weather-info">
                        <span className={`forecast-badge ${selectedArea?.forecast?.toLowerCase().includes('rain') ? 'rain' : ''}`}>
                          {selectedArea?.name === area.name
                            ? selectedArea.forecast
                            : 'Click for details'}
                        </span>


                        {selectedArea?.name === area.name && (
                          <div className="weather-meta">
                            <p><strong>Updated:</strong> {new Date(selectedArea.updated).toLocaleTimeString()}</p>
                            <p><strong>Location:</strong> {area.label_location.latitude.toFixed(4)}, {area.label_location.longitude.toFixed(4)}</p>
                            <TemperatureDisplay weatherChartData={weatherChartData} />
                            <div className="mini-map-container">
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
                        )}
                      </div>
                    </div>

                    <div className="chart-column">
                      <h4>Temperature / Humidity Trend</h4>
                      {loading ? (
                        <p>Loading chart data...</p>
                      ) : weatherChartData ? (
                        <WeatherChart weatherChartData={weatherChartData} />
                      ) : (
                        <p>No weather data available</p>
                      )}
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
