import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WeatherChart = ({ weatherChartData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!weatherChartData || !chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Create labels showing date only once per day
    const labels = weatherChartData.hourly.time.map((time, index) => {
      const date = new Date(time);
      const currentDate = date.getDate();
      
      // Check if this is the first hour of the day (00:00)
      if (date.getHours() === 0) {
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }
      return ''; // Empty string for other hours
    });

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: weatherChartData.hourly.temperature_2m,
            borderColor: 'rgba(255, 99, 132, 0.8)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            yAxisID: 'y',
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Humidity (%)',
            data: weatherChartData.hourly.relativehumidity_2m,
            borderColor: 'rgba(54, 162, 235, 0.8)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            yAxisID: 'y1',
            tension: 0.4,
            pointRadius: 0
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
        plugins: {
          tooltip: {
            callbacks: {
              title: (context) => {
                const date = new Date(weatherChartData.hourly.time[context[0].dataIndex]);
                return date.toLocaleString([], {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
              }
            }
          },
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              autoSkip: false,
              // Only show labels that aren't empty strings
              callback: function(value, index) {
                return this.getLabelForValue(index) || null;
              }
            },
            grid: {
              display: false
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Temperature (°C)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
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
            },
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [weatherChartData]);

  return (
    <div style={{ position: 'relative', height: '450px', width: '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default WeatherChart;