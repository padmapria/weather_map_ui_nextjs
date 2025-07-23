import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WeatherChart = ({ weatherChartData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!weatherChartData || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = weatherChartData.hourly.time.map(time => 
      new Date(time).toLocaleTimeString([], { hour: '2-digit' })
    );
    
    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: weatherChartData.hourly.temperature_2m,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y',
            tension: 0.1
          },
          {
            label: 'Humidity (%)',
            data: weatherChartData.hourly.relativehumidity_2m,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            yAxisID: 'y1',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Temperature (°C)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Humidity (%)'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [weatherChartData]);

  return (
    <div style={{ position: 'relative', height: '300px', width: '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default WeatherChart;