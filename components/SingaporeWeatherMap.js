import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WeatherChart from './WeatherChart';
import { useRef } from 'react';


// Fix Leaflet marker icons
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const SingaporeWeatherMap = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherChartData, setWeatherChartData] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(true);
  
  //For search data
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef(null);


  useEffect(() => {
    axios.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast')
      .then(response => {
        setWeatherData(response.data);
      });
  }, []);

  useEffect(() => {
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=temperature_2m,relativehumidity_2m&timezone=Asia%2FSingapore&start_date=2025-07-07&end_date=2025-07-14')
      .then(response => {
        setWeatherChartData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleMarkerClick = (area) => {
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
                const match = weatherData.area_metadata.find(area =>
                area.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (match && mapRef.current) {
                const { latitude, longitude } = match.label_location;
                mapRef.current.flyTo([latitude, longitude], 14, { duration: 1.5 });
                handleMarkerClick(match);
                }
            }
            }}
        />
        </div>


      <div className="map-wrapper">
        <MapContainer 
          center={[1.3521, 103.8198]} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
           whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          {weatherData.area_metadata.map(area => (
            <Marker
              key={area.name}
              position={[area.label_location.latitude, area.label_location.longitude]}
              eventHandlers={{ click: () => handleMarkerClick(area) }}
            >
              <Popup className="weather-popup" maxWidth={800}>
                <div className="popup-content">
                  <div className="popup-grid">
                    <div className="weather-details-column">
                      <h3>{area.name}</h3>
                      <div className="weather-info">
                        <span className={`forecast-badge ${selectedArea?.forecast?.toLowerCase().includes('rain') ? 'rain' : ''}`}>
                          {selectedArea?.name === area.name ? selectedArea.forecast : 'Click for details'}
                        </span>
                        {selectedArea?.name === area.name && (
                          <div className="weather-meta">
                            <p><strong>Updated:</strong> {new Date(selectedArea.updated).toLocaleTimeString()}</p>
                            <p><strong>Location:</strong> {area.label_location.latitude.toFixed(4)}, {area.label_location.longitude.toFixed(4)}</p>
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
                      <h4>Hourly Weather</h4>
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

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }

        .fullscreen-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
        }

        .map-header {
          position: relative;
          z-index: 1000;
          background: rgba(255,255,255,0.9);
          padding: 12px 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .map-header h1 {
          margin: 0;
          font-size: 1.2rem;
          color: #333;
        }

        .map-wrapper {
          flex: 1;
          position: relative;
        }

        .loading {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255,255,255,0.8);
          z-index: 1000;
          font-size: 1.2rem;
        }

        .weather-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          border: 1px solid #ddd;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          min-width: 300px;
          width: auto !important;
        }

        .weather-popup .leaflet-popup-content {
          margin: 0;
          width: 100% !important;
          min-height: 350px;
        }

        .popup-content {
          padding: 15px;
          height: 100%;
        }

        .popup-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
        }

        @media (min-width: 640px) {
          .weather-popup .leaflet-popup-content-wrapper {
            min-width: 650px;
          }

          .popup-grid {
            flex-direction: row;
          }
        }

        .weather-details-column {
          flex: 1;
          min-width: 200px;
        }

        .chart-column {
          flex: 2;
          min-width: 300px;
        }

        .popup-content h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: #333;
          font-weight: 600;
        }

        .forecast-badge {
          display: inline-block;
          padding: 8px 14px;
          background: #4CAF50;
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .forecast-badge.rain {
          background: #2196F3;
        }

        .weather-meta {
          margin-top: 15px;
        }

        .weather-meta p {
          margin: 6px 0;
          font-size: 14px;
          color: #555;
          line-height: 1.4;
        }

        .weather-meta strong {
          color: #333;
          font-weight: 600;
        }

        .chart-column h4 {
          margin: 0 0 10px 0;
          font-size: 15px;
          color: #555;
          text-align: center;
        }

        .mini-map-container {
          margin-top: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .search-bar {
            position: absolute;
            top: 70px;
            left: 20px;
            z-index: 1100;
            background: white;
            padding: 8px 12px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            .search-bar input {
            padding: 6px 10px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 200px;
            }


      `}</style>
    </div>
  );
};

export default SingaporeWeatherMap;
