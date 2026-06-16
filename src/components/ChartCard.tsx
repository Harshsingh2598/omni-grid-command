import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartCard: React.FC<{ title: string; color?: string; type?: 'line' | 'area' | 'bar' }> = ({ 
  title, 
  color = '#4285f4', 
  type = 'area' 
}) => {
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    setDataPoints(Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 30));

    const interval = setInterval(() => {
      setDataPoints(prev => [...prev.slice(1), Math.floor(Math.random() * 50) + 30]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const series = [{ name: title, data: dataPoints }];

  const options: any = {
    chart: {
      type: type,
      height: '100%',
      sparkline: { enabled: false },
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 600 }
      }
    },
    stroke: { curve: 'smooth', width: 2.5, colors: [color] },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.8,
        opacityFrom: 0.35,
        opacityTo: 0.01,
        colorStops: [
          { offset: 0, color: color, opacity: 0.35 },
          { offset: 100, color: color, opacity: 0 }
        ]
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#9aa0a6', fontFamily: 'var(--font-sans)', fontSize: '11px' }
      }
    },
    colors: [color],
    tooltip: { theme: 'dark' }
  };

  return (
    <div className="cyber-panel" style={{ height: '100%' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
        {title} Live Monitor
      </h3>
      <div style={{ height: '200px' }}>
        {dataPoints.length > 0 && (
          <ReactApexChart options={options} series={series} type={type} height={190} />
        )}
      </div>
    </div>
  );
};

export default ChartCard;
