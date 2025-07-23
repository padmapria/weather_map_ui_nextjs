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

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
      `}</style>

      <style jsx>{`
        .fullscreen-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
        }
        
        .header {
          padding: 15px 20px;
          background: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          z-index: 100;
        }
        
        .header h1 {
          margin: 0 0 5px 0;
          font-size: 1.5rem;
          color: #333;
        }
        
        .subtitle {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }
        
        .map-container {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        
        /* Ensure the map fills its container */
        :global(.map-wrapper) {
          height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  );
}