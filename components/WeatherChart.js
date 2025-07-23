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

    const labels = weatherChartData.hourly.time.map(time => {
      const date = new Date(time);
      return date.getHours() === 0 ? `${date.getDate()}/${date.getMonth()+1}` : '';
    });

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
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
          legend: {
            position: 'top',
          },
          tooltip: {
            bodyFont: {
          size: 14 // Increase tooltip font size
        },
        titleFont: {
          size: 16 // Increase tooltip title font size
        },
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
          }
        },
        layout: {
          padding: {
            right: 20 // Add padding to the right of the chart
          }
        },
        scales: {
          x: {
            ticks: {
              callback: function(val, index) {
                return this.getLabelForValue(index) || null;
              },
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              display: false
            }
          },
          y: {
            title: { display: true, text: 'Temperature (°C)' },
            grid: {
              drawBorder: false
            }
          },
          y1: {
            position: 'right',
            title: { display: true, text: 'Humidity (%)' },
            min: 0,
            max: 100,
            grid: {
              drawBorder: false
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
    <div className="chart-container" style={{ 
      height: '400px', 
      width: '100%',
      paddingRight: '20px' // Additional padding for the container
    }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default WeatherChart;