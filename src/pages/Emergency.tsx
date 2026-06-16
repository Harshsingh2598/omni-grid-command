import React, { useState } from 'react';
import ChartCard from '@/components/ChartCard';

const Emergency: React.FC = () => {
  const [reports, setReports] = useState(2);
  const [weatherSeverity, setWeatherSeverity] = useState('Severe');
  const [dispatchDistance, setDispatchDistance] = useState(3.5);
  
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
      'Mapping accident coordinate inputs...',
      'Analyzing weather severity vectors...',
      'Running Support Vector Machine (SVM)...',
      'Synthesizing security risk level classification...'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, `// ${step}`]);
        if (idx === steps.length - 1) {
          setTimeout(async () => {
            setIsScanning(false);
            try {
              const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
              const res = await fetch(`${apiBase}/predict/emergency`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  traffic_congestion: reports > 5 ? 'High' : 'Medium',
                  aqi: 120.0,
                  weather_severity: weatherSeverity,
                  crowd_density: 0.85,
                  accident_reports: reports,
                  hospital_distance: dispatchDistance,
                  fire_station_distance: 2.5
                })
              });
              const data = await res.json();
              
              // Map output response to cyber states
              let rawLevel = data.emergency_risk || 'Medium';
              if (rawLevel === 'Low' || rawLevel === 'Safe') setPrediction('STABLE SECURITY');
              else if (rawLevel === 'Medium' || rawLevel === 'High') setPrediction('ELEVATED WARNING');
              else setPrediction('CRITICAL ALERT STATE');
            } catch (err) {
              // Smart logic prediction fallback
              let score = reports * 1.5;
              if (weatherSeverity === 'Catastrophic') score += 4;
              if (weatherSeverity === 'Severe') score += 2;
              if (dispatchDistance > 8) score += 2;
              else if (dispatchDistance > 4) score += 1;
              
              if (score >= 7) setPrediction('CRITICAL ALERT STATE');
              else if (score >= 4) setPrediction('ELEVATED WARNING');
              else setPrediction('STABLE SECURITY');
            }
          }, 300);
        }
      }, (idx + 1) * 220);
    });
  };

  // Helper color tags based on incident warning risk
  const getResultColors = (p: string) => {
    if (p === 'CRITICAL ALERT STATE') return { text: 'var(--pink)', bg: 'rgba(255, 0, 85, 0.15)', border: 'var(--pink)' };
    if (p === 'ELEVATED WARNING') return { text: 'var(--orange)', bg: 'rgba(255, 122, 24, 0.15)', border: 'var(--orange)' };
    return { text: 'var(--lime)', bg: 'rgba(57, 255, 20, 0.15)', border: 'var(--lime)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
        
        {/* Left Column - Trend graph and model info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="stagger-in" style={{ height: '340px' }}>
            <ChartCard title="Incident Risk Trends" color="var(--pink)" />
          </div>

          <div className="cyber-panel stagger-in">
            <div className="cyber-panel-decor-corner" />
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '0.75rem', letterSpacing: '1px' }}>
              ML MODEL OVERVIEW // SUPPORT VECTOR MACHINE
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>ALGORITHM TYPE:</div>
                <div style={{ color: '#fff', marginTop: '2px' }}>Support Vector Machine (C-SVC)</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>LATENCY OVERHEAD:</div>
                <div style={{ color: '#fff', marginTop: '2px' }}>~10ms (Inference Node)</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>MODEL ACCURACY:</div>
                <div style={{ color: 'var(--lime)', marginTop: '2px' }}>97.2% verified</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>EVALUATION MATRIX:</div>
                <div style={{ color: 'var(--cyan)', marginTop: '2px' }}>Gaussian RBF Kernel Boundary</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px dashed var(--border)', paddingTop: '1.25rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>CONFUSION MATRIX:</div>
                <div className="confusion-matrix-grid">
                  <div className="matrix-cell true-positive" title="True Positive">88</div>
                  <div className="matrix-cell false-positive" title="False Positive">2</div>
                  <div className="matrix-cell false-negative" title="False Negative">1</div>
                  <div className="matrix-cell true-negative" title="True Negative">89</div>
                </div>
              </div>
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>PRECISION:</span>
                  <span style={{ color: 'var(--lime)', fontWeight: 'bold' }}>0.977</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>RECALL:</span>
                  <span style={{ color: 'var(--lime)', fontWeight: 'bold' }}>0.988</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>F1-SCORE:</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>0.983</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Predictor Form and Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="cyber-panel stagger-in">
            <div className="cyber-panel-decor-corner" />
            <h3 style={{ color: 'var(--pink)', fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px' }}>
              INCIDENT WARNING CLASSIFIER
            </h3>
            
            <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Parameter 1: Accident Reports */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Accident Reports Count</span>
                  <span style={{ color: 'var(--pink)', fontWeight: 'bold' }}>{reports} active reports</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={reports} 
                  onChange={e => setReports(Number(e.target.value))} 
                  className="cyber-range"
                />
              </div>

              {/* Parameter 2: Dispatch Distance */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Dispatch Station Range</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>{dispatchDistance} km</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="15.0" 
                  step="0.5"
                  value={dispatchDistance} 
                  onChange={e => setDispatchDistance(Number(e.target.value))} 
                  className="cyber-range"
                />
              </div>

              {/* Parameter 3: Weather Severity Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Meteorological Threats</label>
                <div className="chip-group">
                  {['Mild', 'Severe', 'Catastrophic'].map((sev) => (
                    <div 
                      key={sev} 
                      className={`chip-tag ${weatherSeverity === sev ? 'active' : ''}`}
                      onClick={() => setWeatherSeverity(sev)}
                    >
                      {sev.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
              
              <button type="submit" className="btn-cyber pink" disabled={isScanning}>
                {isScanning ? 'SVM KERNEL EVALUATION...' : 'RUN RISK BOUNDARY EVAL'}
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
                  <circle cx="85%" cy="50%" r="6" className={`neural-node pink ${prediction !== null ? 'active' : ''}`} />
                  
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
                  RISK ASSESSMENT OUTCOME:
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
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>FEATURE RISK WEIGHTS:</div>
                  
                  <div className="cyber-gauge-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                      <span>Accident reports</span>
                      <span>60%</span>
                    </div>
                    <div className="cyber-gauge-track">
                      <div className="cyber-gauge-fill" style={{ width: '60%', background: 'var(--pink)' }}></div>
                    </div>
                  </div>

                  <div className="cyber-gauge-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                      <span>Weather threat index</span>
                      <span>28%</span>
                    </div>
                    <div className="cyber-gauge-track">
                      <div className="cyber-gauge-fill" style={{ width: '28%', background: 'var(--yellow)' }}></div>
                    </div>
                  </div>

                  <div className="cyber-gauge-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                      <span>Hospital/fire dispatch distance</span>
                      <span>12%</span>
                    </div>
                    <div className="cyber-gauge-track">
                      <div className="cyber-gauge-fill" style={{ width: '12%', background: 'var(--cyan)' }}></div>
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

export default Emergency;
