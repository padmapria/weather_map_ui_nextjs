# Weather Map UI with Next.js

A responsive weather mapping application built with Next.js that displays Singapore's 2-hour weather forecast data on an interactive map.

## Features

- Interactive map with Leaflet.js showing all weather stations in singapore
- Real-time 2-hour forecasts from data.gov.sg API
- Fully responsive design using Bootstrap 5
- Location search functionality (yet to enhance)
- Detailed popups with:
  - Current weather conditions
  - Weekly temperature/humidity trends
  - Mini map of station location
  - Today's average statistics
  - Temperature and humidity charts using Chart.js

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

#### API Sources
- Singapore weather data: data.gov.sg
- Weather charts: open-meteo.com
- Map tiles: OpenStreetMap

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

