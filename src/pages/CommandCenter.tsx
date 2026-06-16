import React, { useEffect, useRef, useState } from 'react';
import ChartCard from '@/components/ChartCard';

const hexToRgba = (hex: string, alpha: number) => {
  try {
    const cleaned = hex.trim().replace('#', '');
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    return `rgba(0, 245, 255, ${alpha})`;
  }
};

const CommandCenter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Interactive Simulator parameters
  const [trafficLoad, setTrafficLoad] = useState<number>(110);
  const [pm25, setPm25] = useState<number>(38);
  const [gridLoad, setGridLoad] = useState<number>(320);
  const [incidentsCount, setIncidentsCount] = useState<number>(2);

  const [riskLevel, setRiskLevel] = useState<string>('SAFE');
  const [threatColor, setThreatColor] = useState<string>('var(--lime)');
  const [confidence, setConfidence] = useState<number>(95);

  const [logs, setLogs] = useState<string[]>([
    'Omni-Grid modeling session loaded.',
    'Telemetry connected: Core grid nodes operational.',
    'Prediction confidence rating: 95% verified.'
  ]);

  // Interactive Drone Fleet State
  const [drones, setDrones] = useState([
    { id: 'DRONE_ALPHA', status: 'IDLE', battery: 94, mission: 'Standby Unit' },
    { id: 'DRONE_BETA', status: 'IDLE', battery: 100, mission: 'Standby Unit' },
    { id: 'DRONE_GAMMA', status: 'RECHARGING', battery: 32, mission: 'Recharge Bay' }
  ]);

  // Interactive Incident Response State
  const [activeIncidents, setActiveIncidents] = useState([
    { id: 'INC_01', type: 'GRID_SURGE', location: 'Sector 4 Core', severity: 'HIGH', resolved: false, drone: '' },
    { id: 'INC_02', type: 'TRAFFIC_COLLISION', location: 'Hwy 101 Exit B', severity: 'MODERATE', resolved: false, drone: '' }
  ]);

  // Dispatch drone to active incident
  const handleDispatch = (droneId: string, incidentId: string) => {
    // Update drone mission
    setDrones(prev => prev.map(d => {
      if (d.id === droneId) {
        return { ...d, status: 'ACTIVE', mission: `Responding to ${incidentId}` };
      }
      return d;
    }));

    // Link drone to incident
    setActiveIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, drone: droneId };
      }
      return inc;
    }));

    setLogs(prev => [...prev, `DISPATCH: ${droneId} deployed to ${incidentId} coordinates.`].slice(-5));
  };

  // Resolve incident
  const handleResolve = (incidentId: string) => {
    let linkedDrone = '';
    
    setActiveIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        linkedDrone = inc.drone;
        return { ...inc, resolved: true };
      }
      return inc;
    }));

    // Reset drone status
    if (linkedDrone) {
      setDrones(prev => prev.map(d => {
        if (d.id === linkedDrone) {
          return { ...d, status: 'IDLE', mission: 'Standby Unit' };
        }
        return d;
      }));
    }

    setIncidentsCount(prev => Math.max(0, prev - 1));
    setLogs(prev => [...prev, `RESOLVED: Incident ${incidentId} cleared. Standby alert dismissed.`].slice(-5));
  };

  // Recalculate states based on controls
  useEffect(() => {
    let score = 0;
    if (trafficLoad > 180) score += 2;
    if (pm25 > 80) score += 2;
    if (gridLoad > 400) score += 2;
    score += incidentsCount;

    let level = 'SAFE';
    let color = 'var(--lime)';
    if (score >= 6) {
      level = 'CRITICAL';
      color = 'var(--pink)';
    } else if (score >= 3) {
      level = 'WARNING';
      color = 'var(--orange)';
    }

    setRiskLevel(level);
    setThreatColor(color);

    const baseConfidence = 97 - (score * 1.8);
    setConfidence(Math.max(75, Math.min(99, Math.round(baseConfidence))));

    setLogs(prev => {
      const next = [
        ...prev,
        `SIMULATOR: Sensor update. Traffic: ${trafficLoad} v/m | AQI: ${pm25} | Grid: ${gridLoad}MW | Incidents: ${incidentsCount}. State: ${level}.`
      ];
      if (next.length > 5) next.shift();
      return next;
    });

  }, [trafficLoad, pm25, gridLoad, incidentsCount]);

  // HTML5 Canvas advanced 3D perspective wireframe map
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width = container.clientWidth || 800;
      h = canvas.height = 360;
    };
    resize();

    const observer = new ResizeObserver(() => resize());
    observer.observe(container);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const cyan = getComputedStyle(document.body).getPropertyValue('--cyan').trim() || '#00f5ff';
      const pink = getComputedStyle(document.body).getPropertyValue('--pink').trim() || '#ff2bd6';

      // Perspective Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + (i - w / 2) * 0.45, h);
        ctx.stroke();
      }
      for (let i = 0; i < h; i += 35) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }

      // Drawing 3D Wireframe buildings with glowing gradients
      const buildings = [
        { x: 0.12, y: 0.22, w: 0.08, h: 0.25, depth: 25, color: 'rgba(0, 245, 255, 0.08)' },
        { x: 0.26, y: 0.15, w: 0.09, h: 0.38, depth: 35, color: 'rgba(0, 245, 255, 0.08)' },
        { x: 0.5, y: 0.4, w: 0.12, h: 0.42, depth: 50, color: riskLevel === 'CRITICAL' ? hexToRgba(pink, 0.15) : hexToRgba(cyan, 0.08) },
        { x: 0.74, y: 0.55, w: 0.1, h: 0.25, depth: 20, color: pm25 > 80 ? 'rgba(255, 122, 24, 0.15)' : hexToRgba(cyan, 0.08) }
      ];

      buildings.forEach(b => {
        const bx = b.x * w;
        const by = b.y * h;
        const bw = b.w * w;
        const bh = b.h * h;

        ctx.fillStyle = b.color;
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.strokeRect(bx, by, bw, bh);

        // Perspective Roof
        ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx - b.depth, by - b.depth);
        ctx.lineTo(bx + bw - b.depth, by - b.depth);
        ctx.lineTo(bx + bw, by);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      const rx = w * 0.56;
      const ry = h * 0.6;

      // Concentric expanding sonar ripples downtown
      const pulseSpeed = Date.now() * 0.0012;
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const rRadius = ((pulseSpeed + i * 1.5) % 4.5) * 60;
        const alpha = Math.max(0, 1 - rRadius / 270);
        ctx.strokeStyle = riskLevel === 'CRITICAL' ? hexToRgba(pink, alpha * 0.15) : hexToRgba(cyan, alpha * 0.15);
        ctx.beginPath();
        ctx.arc(rx, ry, rRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Highway traffic node streams along Bezier paths
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(0, h * 0.8);
      ctx.bezierCurveTo(w * 0.3, h * 0.6, w * 0.6, h * 0.9, w, h * 0.7);
      ctx.stroke();

      const getBezierPoint = (t: number, p0: any, p1: any, p2: any, p3: any) => {
        const cx = 3 * (p1.x - p0.x);
        const bx = 3 * (p2.x - p1.x) - cx;
        const ax = p3.x - p0.x - cx - bx;
        const cy = 3 * (p1.y - p0.y);
        const by = 3 * (p2.y - p1.y) - cy;
        const ay = p3.y - p0.y - cy - by;
        const x = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
        const y = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;
        return { x, y };
      };

      const p0 = { x: 0, y: h * 0.8 };
      const p1 = { x: w * 0.3, y: h * 0.6 };
      const p2 = { x: w * 0.6, y: h * 0.9 };
      const p3 = { x: w, y: h * 0.7 };

      const trafficTime = (Date.now() * 0.0003) % 1.0;
      for (let offset = 0; offset < 3; offset++) {
        const t = (trafficTime + offset * 0.33) % 1.0;
        const pt = getBezierPoint(t, p0, p1, p2, p3);
        ctx.fillStyle = riskLevel === 'CRITICAL' ? pink : cyan;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw floating telemetry text overlays
      ctx.font = '9px monospace';
      ctx.fillStyle = hexToRgba(cyan, 0.4);
      ctx.fillText(`SYS_COORD // LAT: 37.7749 // LNG: -122.4194`, w * 0.03, h * 0.86);
      ctx.fillText(`SECTOR_GRID_LINK // ACTIVE`, w * 0.03, h * 0.9);
      ctx.fillText(`TELEMETRY_FLOW_RATE // 120bps`, w * 0.03, h * 0.94);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [riskLevel, pm25, threatColor]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Active Alerts scrolling ticker banner */}
      <div className="alert-ticker-container stagger-in">
        <div className="alert-ticker-label">
          <span>🚨</span> CORE WARNING LOGS:
        </div>
        <div className="alert-ticker-text-wrapper">
          <div className="alert-ticker-text">
            [CRITICAL ALERT] GRID POWER SURGE DETECTED IN SECTOR 4 CORE // RESPONDERS STANDBY // [WARNING] AQI DENSITY REACHED 118PM IN INDUSTRIAL RESIDENTIAL ZONE B // [TRAFFIC] ACCIDENT ACCUMULATION EXIT B HWY 101 NORTH
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Calculated HUD stats cards */}
          <section className="cyber-stats stagger-in">
            <div className="cyber-panel stat-card" style={{ borderTop: '3px solid var(--cyan)' }}>
              <div className="cyber-panel-decor-corner" />
              <div className="stat-header">Simulated Traffic</div>
              <div className="stat-value" style={{ color: 'var(--cyan)', textShadow: '0 0 15px rgba(0,245,255,0.2)' }}>{trafficLoad} <span style={{ fontSize: '1rem' }}>v/m</span></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: Normal flow</span>
            </div>

            <div className="cyber-panel stat-card" style={{ borderTop: pm25 > 80 ? '3px solid var(--pink)' : '3px solid var(--lime)' }}>
              <div className="cyber-panel-decor-corner" />
              <div className="stat-header">AQI Dust density</div>
              <div className="stat-value" style={{ color: pm25 > 80 ? 'var(--pink)' : 'var(--lime)', textShadow: pm25 > 80 ? '0 0 15px rgba(255,43,214,0.2)' : '0 0 15px rgba(57,255,20,0.2)' }}>{pm25} <span style={{ fontSize: '1rem' }}>PM2.5</span></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: {pm25 > 80 ? 'UNHEALTHY' : 'OPTIMAL'}</span>
            </div>

            <div className="cyber-panel stat-card" style={{ borderTop: gridLoad > 400 ? '3px solid var(--orange)' : '3px solid var(--cyan)' }}>
              <div className="cyber-panel-decor-corner" />
              <div className="stat-header">Grid power demand</div>
              <div className="stat-value" style={{ color: 'var(--orange)', textShadow: '0 0 15px rgba(255,122,24,0.2)' }}>{gridLoad} <span style={{ fontSize: '1rem' }}>MW</span></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: Calibrated load</span>
            </div>

            <div className="cyber-panel stat-card" style={{ borderTop: `3px solid ${threatColor}` }}>
              <div className="cyber-panel-decor-corner" />
              <div className="stat-header">Calculated Risk threat</div>
              <div className="stat-value" style={{ color: threatColor, textShadow: `0 0 15px ${threatColor}33` }}>{riskLevel}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alarms Count: {incidentsCount}</span>
            </div>

            <div className="cyber-panel stat-card" style={{ borderTop: '3px solid var(--purple)' }}>
              <div className="cyber-panel-decor-corner" />
              <div className="stat-header">Active Response Units</div>
              <div className="stat-value" style={{ color: 'var(--purple)', textShadow: '0 0 15px rgba(138,43,255,0.2)' }}>
                {drones.filter(d => d.status === 'ACTIVE').length} / {drones.length} <span style={{ fontSize: '1rem' }}>Active</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: Fleet operational</span>
            </div>

            <div className="cyber-panel stat-card" style={{ borderTop: '3px solid var(--yellow)' }}>
              <div className="cyber-panel-decor-corner" />
              <div className="stat-header">Climate Core Temp</div>
              <div className="stat-value" style={{ color: 'var(--yellow)', textShadow: '0 0 15px rgba(254,238,0,0.2)' }}>
                31°C <span style={{ fontSize: '1rem' }}>Mostly Clear</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Humidity: 62% // Stable</span>
            </div>
          </section>

          {/* Wireframe map canvas */}
          <section ref={containerRef} className="radar-map-wrapper stagger-in">
            <div style={{ position: 'absolute', top: '15px', left: '20px', zIndex: 10 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}>
                <span>🌐</span> Digital Twin Sensor Coordinate Mapping
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulating street blocks envelope wireframes</span>
            </div>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }} />
          </section>

          {/* New Interactive Incident Dispatcher Console */}
          <section className="cyber-panel stagger-in">
            <div className="cyber-panel-decor-corner" />
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.2rem', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>
              INTERACTIVE INCIDENT DISPATCHER CONSOLE
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {activeIncidents.map((inc) => (
                <div key={inc.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  padding: '1rem',
                  borderRadius: '10px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: inc.resolved ? 'var(--lime)' : 'var(--pink)', fontSize: '0.75rem' }}>●</span>
                      <strong style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{inc.type}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Location: {inc.location} | Severity: <span style={{ color: inc.severity === 'HIGH' ? 'var(--pink)' : 'var(--orange)' }}>{inc.severity}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {inc.resolved ? (
                      <span style={{ color: 'var(--lime)', fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>RESOLVED // CLEARED</span>
                    ) : (
                      <>
                        {!inc.drone ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {drones.filter(d => d.status === 'IDLE').slice(0, 1).map(d => (
                              <button 
                                key={d.id} 
                                className="btn-cyber" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                                onClick={() => handleDispatch(d.id, inc.id)}
                              >
                                DISPATCH {d.id.split('_')[1]}
                              </button>
                            ))}
                            {drones.filter(d => d.status === 'IDLE').length === 0 && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>NO DRONES STANDBY</span>
                            )}
                          </div>
                        ) : (
                          <button 
                            className="btn-cyber pink" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                            onClick={() => handleResolve(inc.id)}
                          >
                            RESOLVE INCIDENT
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* System logs feed */}
          <section className="cyber-panel stagger-in">
            <div className="cyber-panel-decor-corner" />
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>OMNI-GRID ACTIVE LOG ENGINE</h4>
            <div className="terminal-logs">
              {logs.map((log, index) => (
                <div key={index} className="terminal-line">{log}</div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Sandbox sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Simulation control panel */}
          <section className="cyber-panel stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="cyber-panel-decor-corner" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', borderBottom: '1px solid var(--border)', paddingBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>
              🎛️ Sandbox controller
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Traffic Flow Density</span>
                <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{trafficLoad} v/m</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="250" 
                value={trafficLoad} 
                onChange={e => setTrafficLoad(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--cyan)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>PM2.5 dust index</span>
                <span style={{ color: pm25 > 80 ? 'var(--pink)' : 'var(--lime)', fontWeight: 700 }}>{pm25} µg/m³</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="150" 
                value={pm25} 
                onChange={e => setPm25(Number(e.target.value))} 
                style={{ width: '100%', accentColor: pm25 > 80 ? 'var(--pink)' : 'var(--lime)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Energy Demand Load</span>
                <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{gridLoad} MW</span>
              </div>
              <input 
                type="range" 
                min="200" 
                max="500" 
                value={gridLoad} 
                onChange={e => setGridLoad(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--orange)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Alarms count</span>
                <span style={{ color: threatColor, fontWeight: 700 }}>{incidentsCount}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5" 
                value={incidentsCount} 
                onChange={e => setIncidentsCount(Number(e.target.value))} 
                style={{ width: '100%', accentColor: threatColor }}
              />
            </div>
          </section>

          {/* Prediction Accuracy Indicator */}
          <section className="cyber-panel stagger-in" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div className="cyber-panel-decor-corner" />
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--cyan)', textShadow: '0 0 15px rgba(0,245,255,0.2)', fontFamily: 'var(--font-mono)' }}>{confidence}%</div>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginTop: '6px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>AI Estimation Accuracy</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Calculated dynamically based on simulator noise bounds.</p>
          </section>

          {/* New Drone Fleet Status Card */}
          <section className="cyber-panel stagger-in">
            <div className="cyber-panel-decor-corner" />
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px' }}>
              DRONE FLEET MONITOR
            </h4>
            
            <div className="drone-grid">
              {drones.map((drone) => (
                <div key={drone.id} className="drone-card">
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: '#fff' }}>
                    {drone.id.split('_')[1]}
                  </div>
                  <div className={`drone-status-pill ${drone.status.toLowerCase()}`}>
                    {drone.status}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                      <span>PWR</span>
                      <span style={{ color: drone.battery > 50 ? 'var(--lime)' : 'var(--pink)' }}>{drone.battery}%</span>
                    </div>
                    <div className="cyber-gauge-track" style={{ height: '3px' }}>
                      <div className="cyber-gauge-fill" style={{
                        width: `${drone.battery}%`,
                        background: drone.battery > 50 ? 'var(--lime)' : 'var(--pink)'
                      }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                    {drone.mission}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sparkline chart */}
          <div className="stagger-in">
            <ChartCard title="Overall Risk Index Trends" color="var(--pink)" type="line" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default CommandCenter;
