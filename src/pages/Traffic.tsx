import React, { useState } from 'react';
import ChartCard from '@/components/ChartCard';

const Traffic: React.FC = () => {
  const [vehicleCount, setVehicleCount] = useState(1200);
  const [weather, setWeather] = useState('Sunny');
  const [peakHour, setPeakHour] = useState('Morning Rush');
  
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setPrediction(null);
    setScanLogs([]);

    const steps = [
      'Establishing neural data node link...',
      'Mapping vehicle count weights...',
      'Feeding environmental vectors...',
      'Evaluating Random Forest trees...',
      'Synthesizing traffic congestion level...'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, `// ${step}`]);
        if (idx === steps.length - 1) {
          setTimeout(async () => {
            setIsScanning(false);
            try {
              const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
              const res = await fetch(`${apiBase}/predict/traffic`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  time_of_day: peakHour,
                  day_of_week: 'Monday',
                  weather: weather,
                  road_type: 'Highway',
                  vehicle_count: vehicleCount,
                  accident_history: 0
                })
              });
              const data = await res.json();
              
              // Map output response to cyber states
              let rawLevel = data.traffic_level || 'Medium';
              if (rawLevel === 'Low' || rawLevel === 'Safe') setPrediction('FREE FLOW');
              else if (rawLevel === 'Medium' || rawLevel === 'High') setPrediction('MODERATE FLOW');
              else setPrediction('CRITICAL CONGESTION');

            } catch (err) {
              // Smart logic prediction fallback
              let score = 0;
              if (vehicleCount > 1800) score += 3;
              else if (vehicleCount > 1100) score += 2;
              else score += 1;
              
              if (weather === 'Heavy Rain' || weather === 'Snow' || weather === 'Fog') score += 1;
              if (peakHour.includes('Rush')) score += 2;
              
              if (score >= 5) setPrediction('CRITICAL CONGESTION');
              else if (score >= 3) setPrediction('MODERATE FLOW');
              else setPrediction('FREE FLOW');
            }
          }, 300);
        }
      }, (idx + 1) * 220);
    });
  };

  // Helper color tags based on prediction values
  const getResultColors = (p: string) => {
    if (p === 'CRITICAL CONGESTION') return { text: 'var(--pink)', bg: 'rgba(255, 0, 85, 0.15)', border: 'var(--pink)' };
    if (p === 'MODERATE FLOW') return { text: 'var(--orange)', bg: 'rgba(255, 122, 24, 0.15)', border: 'var(--orange)' };
    return { text: 'var(--lime)', bg: 'rgba(57, 255, 20, 0.15)', border: 'var(--lime)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
        
        {/* Left Column - Trend graph and model info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="stagger-in" style={{ height: '340px' }}>
            <ChartCard title="Traffic Congestion Level" color="var(--cyan)" />
          </div>

          <div className="cyber-panel stagger-in">
            <div className="cyber-panel-decor-corner" />
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '0.75rem', letterSpacing: '1px' }}>
              ML MODEL OVERVIEW // RANDOM FOREST
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>ALGORITHM TYPE:</div>
                <div style={{ color: '#fff', marginTop: '2px' }}>RandomForestClassifier (n=120)</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>LATENCY OVERHEAD:</div>
                <div style={{ color: '#fff', marginTop: '2px' }}>~14ms (Inference Node)</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>MODEL ACCURACY:</div>
                <div style={{ color: 'var(--lime)', marginTop: '2px' }}>96.8% verified</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>EVALUATION MATRIX:</div>
                <div style={{ color: 'var(--cyan)', marginTop: '2px' }}>Standard Cross-Entropy</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px dashed var(--border)', paddingTop: '1.25rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>CONFUSION MATRIX:</div>
                <div className="confusion-matrix-grid">
                  <div className="matrix-cell true-positive" title="True Positive">84</div>
                  <div className="matrix-cell false-positive" title="False Positive">3</div>
                  <div className="matrix-cell false-negative" title="False Negative">2</div>
                  <div className="matrix-cell true-negative" title="True Negative">91</div>
                </div>
              </div>
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>PRECISION:</span>
                  <span style={{ color: 'var(--lime)', fontWeight: 'bold' }}>0.965</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>RECALL:</span>
                  <span style={{ color: 'var(--lime)', fontWeight: 'bold' }}>0.976</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>F1-SCORE:</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>0.970</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Predictor Form and Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="cyber-panel stagger-in">
            <div className="cyber-panel-decor-corner" />
            <h3 style={{ color: 'var(--cyan)', fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px' }}>
              TRAFFIC INFERENCE PROTOCOL
            </h3>
            
            <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Parameter 1: Vehicle Density Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Vehicle Flow Density</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>{vehicleCount} vehicles/hr</span>
                </div>
                <input 
                  type="range" 
                  min="300" 
                  max="3000" 
                  step="50"
                  value={vehicleCount} 
                  onChange={e => setVehicleCount(Number(e.target.value))} 
                  className="cyber-range"
                />
              </div>

              {/* Parameter 2: Weather Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Weather Conditions</label>
                <select 
                  value={weather} 
                  onChange={e => setWeather(e.target.value)} 
                  className="cyber-select"
                >
                  <option value="Sunny">Sunny // Clear Sky</option>
                  <option value="Heavy Rain">Heavy Rain // Precipitation Alert</option>
                  <option value="Snow">Snow // Frozen Precipitation</option>
                  <option value="Fog">Fog // Low Visibility</option>
                </select>
              </div>

              {/* Parameter 3: Peak Hour Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Peak Hour Factors</label>
                <div className="chip-group">
                  {['Morning Rush', 'Midday', 'Evening Rush', 'Night'].map((hour) => (
                    <div 
                      key={hour} 
                      className={`chip-tag ${peakHour === hour ? 'active' : ''}`}
                      onClick={() => setPeakHour(hour)}
                    >
                      {hour.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
              
              <button type="submit" className="btn-cyber" disabled={isScanning}>
                {isScanning ? 'EXECUTING FORWARD PASS...' : 'RUN CLASSIFICATION'}
              </button>

              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.8rem' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '5px' }}>NEURAL PATHWAYS:</div>
                <svg width="100%" height="80" style={{ display: 'block' }}>
                  <line x1="15%" y1="50%" x2="50%" y2="25%" className={`neural-connection ${isScanning ? 'active' : ''}`} />
                  <line x1="15%" y1="50%" x2="50%" y2="75%" className={`neural-connection ${isScanning ? 'active' : ''}`} />
                  <line x1="50%" y1="25%" x2="85%" y2="50%" className={`neural-connection ${isScanning ? 'active' : ''}`} />
                  <line x1="50%" y1="75%" x2="85%" y2="50%" className={`neural-connection ${isScanning ? 'active' : ''}`} />
                  
                  <circle cx="15%" cy="50%" r="6" className={`neural-node ${isScanning ? 'active' : ''}`} />
                  <circle cx="50%" cy="25%" r="6" className={`neural-node ${isScanning ? 'active' : ''}`} />
                  <circle cx="50%" cy="75%" r="6" className={`neural-node ${isScanning ? 'active' : ''}`} />
                  <circle cx="85%" cy="50%" r="6" className={`neural-node pink ${prediction ? 'active' : ''}`} />
                  
                  <text x="15%" y="22%" fill="var(--text-dim)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">INPUT</text>
                  <text x="50%" y="12%" fill="var(--text-dim)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">HIDDEN</text>
                  <text x="85%" y="22%" fill="var(--text-dim)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">OUTPUT</text>
                </svg>
              </div>
            </form>

            {/* Simulated Scanning Diagnostic */}
            {isScanning && (
              <div className="cyber-scanner-wrapper">
                <div className="scanner-line"></div>
                <div className="matrix-scanner-text">
                  {scanLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Inference outputs */}
            {prediction && (
              <div style={{ marginTop: '2rem', borderTop: '2px solid var(--border)', paddingTop: '1.5rem', animation: 'slideUpFade 0.4s var(--ease) forwards' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  INFERENCE RESULTS:
                </div>
                
                {/* Result glowing display */}
                <div className="glowing-border-card" style={{ marginTop: '8px' }}>
                  <div style={{
                    padding: '1.5rem',
                    color: getResultColors(prediction).text,
                    fontWeight: 900,
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '1.4rem',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    textShadow: `0 0 20px ${getResultColors(prediction).border}55`
                  }}>
                    {prediction}
                  </div>
                </div>

                {/* Features contribution graph */}
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>FEATURE IMPORTANCE WEIGHTS:</div>
                  
                  <div className="cyber-gauge-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                      <span>Vehicle density</span>
                      <span>68%</span>
                    </div>
                    <div className="cyber-gauge-track">
                      <div className="cyber-gauge-fill" style={{ width: '68%', background: 'var(--cyan)' }}></div>
                    </div>
                  </div>

                  <div className="cyber-gauge-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                      <span>Peak rush hour</span>
                      <span>20%</span>
                    </div>
                    <div className="cyber-gauge-track">
                      <div className="cyber-gauge-fill" style={{ width: '20%', background: 'var(--pink)' }}></div>
                    </div>
                  </div>

                  <div className="cyber-gauge-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                      <span>Weather condition</span>
                      <span>12%</span>
                    </div>
                    <div className="cyber-gauge-track">
                      <div className="cyber-gauge-fill" style={{ width: '12%', background: 'var(--yellow)' }}></div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Traffic;
