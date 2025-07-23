# Weather Map UI with Next.js

A responsive weather mapping application built with Next.js that displays Singapore's 2-hour weather forecast data on an interactive map.

## Features

- Interactive Leaflet map showing weather stations across Singapore
- Real-time 2-hour weather forecast data
- Detailed weather popups with current conditions, temperature/humidity trends, and mini location map
- Fully responsive design using Bootstrap 5
- Location search functionality

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

## Screenshots

### Desktop View
![dataloading](/sample_screenshots/desktop-view.png)

![popup](/sample_screenshots/mobile-view.png)