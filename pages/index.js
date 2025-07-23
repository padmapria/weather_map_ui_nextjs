import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the map with SSR disabled
const SingaporeWeatherMap = dynamic(
  () => import('@/components/SingaporeWeatherMap'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="fullscreen-container">
      <Head>
        <title>Singapore Weather Map</title>
        <meta name="description" content="Singapore 2-hour weather forecast with historical trends" />
      </Head>
      
      <main className="map-container">
        <SingaporeWeatherMap />
      </main>

    </div>
  );
}