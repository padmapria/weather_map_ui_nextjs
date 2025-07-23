# Weather Map UI with Next.js

A responsive weather mapping application built with Next.js that displays Singapore's real time 2-hour weather forecast data on an interactive map powered by government APIs.

## Features

- Interactive map with Leaflet.js showing all weather stations in singapore
- Real-time 2-hour forecasts from data.gov.sg API
- Responsive Bootstrap 5 design 
- Location search functionality (yet to enhance)
- Detailed popups with:
  - Custom current weather-condition markers (color-coded by forecast)
  - Today's average statistics of both temperature and humidity
  - Mini map of station location
  - Weekly trends prediction chart for the next 7 days showing the humidity prediction (blue color) and temperature prediction (red color)
  - <img width="3731" height="1949" alt="image" src="https://github.com/user-attachments/assets/0173d241-4c31-4c4a-b343-3eab7d32e6cb" />


## APIs

#### For 2hrs trend
```
'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast'
```
#### For weekly trend
```
`https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=temperature_2m,relativehumidity_2m&timezone=Asia%2FSingapore`
```
#### API Sources
- Singapore weather data: data.gov.sg
- Weather charts: open-meteo.com
- Map tiles: OpenStreetMap


## Technologies Used

- Next.js (React framework)
- React-Leaflet (Interactive maps)
- Chart.js (Data visualization)
- Bootstrap 5 (Responsive UI)
- Axios (HTTP requests)

## Responsive Design

This project uses Bootstrap 5 to ensure perfect display on all devices:
- Mobile-first fluid grid system
- Responsive breakpoints (xs, sm, md, lg, xl)
- Adaptive components
- Responsive utility classes

## Setup Instructions

### Clone the repository:
```bash
git clone https://github.com/padmapria/weather_map_ui_nextjs.git
cd weather_map_ui_nextjs
```

### install the dependencies
```
npm run install
```


### Run the application:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in the browser to see the result.


## Screenshots - Desktop View
![dataloading](sample_screenshots/data_loading.png)
<br/>
<br/>
#### popup screen
<img width="3731" height="1949" alt="image" src="https://github.com/user-attachments/assets/0173d241-4c31-4c4a-b343-3eab7d32e6cb" />

---
### Potential Enhancements
- Enhanced Search Functionality to open the popup
- Logging and Exception Handling: Integrate comprehensive logging throughout the codebase and Improve exception handling to enhance code reliability and stability.
---

