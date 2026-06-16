import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommandCenter from '@/pages/CommandCenter';
import Traffic from '@/pages/Traffic';
import Pollution from '@/pages/Pollution';
import Energy from '@/pages/Energy';
import Emergency from '@/pages/Emergency';
import Assistant from '@/pages/Assistant';

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

// Web Audio API Synthesizer for premium sci-fi sound effects
export const playSound = (type: 'boot' | 'success' | 'hover' | 'click' | 'alarm') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    if (type === 'hover') {
      // Short, high-frequency subtle chirp
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000, now);
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.05);
      
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      // Short metallic click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      // Dual-tone harmonic chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(523.25, now + 0.1);
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.35); // C6
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.setValueAtTime(659.25, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.35); // E6
      
      gain1.gain.setValueAtTime(0.05, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      
      gain2.gain.setValueAtTime(0.03, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      
      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } else if (type === 'boot') {
      // Cinematic rising sweep synth drone
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(220, now + 1.2);
      
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(40, now);
      subOsc.frequency.linearRampToValueAtTime(110, now + 1.2);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 1.2);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      
      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      subOsc.start(now);
      osc.stop(now + 1.5);
      subOsc.stop(now + 1.5);
    } else if (type === 'alarm') {
      // Sci-fi alert warning sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.15);
      osc.frequency.linearRampToValueAtTime(400, now + 0.3);
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    console.warn('Web Audio playback failed:', e);
  }
};

const App: React.FC = () => {
  const [isBooted, setIsBooted] = useState<boolean>(false);
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [time, setTime] = useState<string>('');
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('omni-grid-theme') || 'classic');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('omni-grid-theme', theme);
    document.body.className = theme === 'classic' ? '' : `theme-${theme}`;
  }, [theme]);

  // Update clock time every second
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Persistent interactive neural background canvas
  useEffect(() => {
    if (!isBooted) return;
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const nodesCount = Math.floor((w * h) / 18000);
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = Array.from({ length: Math.min(60, Math.max(25, nodesCount)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const cyan = getComputedStyle(document.body).getPropertyValue('--cyan').trim() || '#00f5ff';

      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 0 || n1.x > w) n1.vx *= -1;
        if (n1.y < 0 || n1.y > h) n1.vy *= -1;

        const dxMouse = mouse.x - n1.x;
        const dyMouse = mouse.y - n1.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < 220) {
          const force = (220 - distMouse) / 220;
          n1.x += (dxMouse / distMouse) * force * 1.5;
          n1.y += (dyMouse / distMouse) * force * 1.5;
          
          ctx.strokeStyle = hexToRgba(cyan, force * 0.12);
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.fillStyle = hexToRgba(cyan, 0.22);
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.08;
            ctx.strokeStyle = hexToRgba(cyan, alpha);
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isBooted]);

  // Background animated particle field for Intro Screen
  useEffect(() => {
    if (isBooted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; r: number; dx: number; dy: number; color: string }[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      color: `rgba(0, 245, 255, ${Math.random() * 0.25 + 0.15})`
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      const cyan = getComputedStyle(document.body).getPropertyValue('--cyan').trim() || '#00f5ff';
      const bg = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#040815';

      const gradient = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, w/2);
      gradient.addColorStop(0, hexToRgba(cyan, 0.04));
      gradient.addColorStop(1, bg);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = 0.5;
      particles.forEach((p1, idx) => {
        p1.x += p1.dx;
        p1.y += p1.dy;
        if (p1.x < 0 || p1.x > w) p1.dx *= -1;
        if (p1.y < 0 || p1.y > h) p1.dy *= -1;

        ctx.fillStyle = hexToRgba(cyan, Math.random() * 0.25 + 0.15);
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.strokeStyle = hexToRgba(cyan, (1 - dist/120) * 0.12);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isBooted]);

  // Handle progressive boot count
  useEffect(() => {
    if (isBooted) return;
    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          playSound('success');
          return 100;
        }
        
        const logsPool = [
          'Connecting to telemetry feeds...',
          'Loading neural risk models...',
          'Calibrating atmospheric sensors...',
          'Setting safety overrides...',
          'Initializing multi-agent handshake...'
        ];
        if (Math.random() > 0.7) {
          const rLog = logsPool[Math.floor(Math.random() * logsPool.length)];
          setLogs(l => [...l, `[OK] ${rLog}`].slice(-4));
        }

        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isBooted]);

  const handleEnter = () => {
    try {
      playSound('boot');
    } catch (e) {}

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance("Welcome, Director. System is fully loaded.");
        speech.rate = 1.05;
        window.speechSynthesis.speak(speech);
      }
    } catch (err) {
      // Bypasses browser autoplay policy blocks
    }
    setIsBooted(true);
  };

  if (!isBooted) {
    return (
      <div className="new-boot-screen">
        <canvas ref={canvasRef} className="boot-canvas" />
        
        <div className="boot-content-wrapper">
          <div className="boot-ui-box">
            <div className="stitch-logo-big animate-logo"></div>
            <h1 className="boot-logo-text">OMNI-GRID COMMAND</h1>
            <span style={{ fontSize: '0.8rem', letterSpacing: '3px', color: 'var(--cyan)', fontWeight: 600 }}>SYSTEM CALIBRATION</span>

            {/* Glowing Radial Progress ring */}
            <div className="progress-ring-container">
              <svg width="120" height="120">
                <circle className="ring-bg" cx="60" cy="60" r="50" />
                <circle 
                  className="ring-progress" 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  style={{ strokeDashoffset: 314 - (314 * bootProgress) / 100 }} 
                />
              </svg>
              <div className="progress-value">{bootProgress}%</div>
            </div>

            <div className="boot-console-logs">
              {logs.map((log, i) => (
                <div key={i} style={{ opacity: (i + 1) / logs.length }}>{log}</div>
              ))}
            </div>

            {bootProgress >= 100 && (
              <button 
                className="enter-command-btn" 
                onClick={handleEnter}
                onMouseEnter={() => playSound('hover')}
              >
                ACCESS COMMAND PROTOCOLS
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        
        {/* Interactive background grid canvas */}
        <canvas ref={bgCanvasRef} className="bg-canvas" />

        {/* Sidebar navigation panel */}
        <Sidebar />

        {/* Workspace panel */}
        <div className="workspace">
          
          {/* Top HUD system bar */}
          <header className="workspace-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="hud-indicator-dot" style={{ color: 'var(--lime)', fontSize: '0.8rem' }}>●</span>
                <span style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>SECURE TELEMETRY</span>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', height: '16px' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Status: <strong style={{ color: '#fff' }}>ACTIVE MONITORING</strong>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px' }}>GRID_THEME //</span>
                
                {/* Custom premium dropdown select */}
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    width: '145px',
                    height: '28px',
                    padding: '0 0.75rem',
                    fontSize: '0.72rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'rgba(5, 10, 24, 0.75)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    transition: 'all 0.3s',
                    boxShadow: isDropdownOpen ? '0 0 12px var(--border-glow)' : 'none',
                    borderColor: isDropdownOpen ? 'var(--cyan)' : 'var(--border)'
                  }}
                  onMouseEnter={() => { try { playSound('hover'); } catch (err) {} }}
                >
                  <span>{theme.replace('classic', 'CYBER CLASSIC').replace('emerald', 'EMERALD GRID').replace('amber', 'AMBER WASTELAND').replace('sunset', 'SUNSET VIOLET').replace('ice', 'SYNTHESIZER ICE').toUpperCase()}</span>
                  <span style={{ transition: 'transform 0.3s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '0.6rem', color: 'var(--cyan)' }}>▼</span>
                </div>

                {isDropdownOpen && (
                  <>
                    <div 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '32px',
                      right: 0,
                      width: '145px',
                      background: 'rgba(5, 10, 24, 0.95)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 245, 255, 0.1)',
                      zIndex: 999,
                      overflow: 'hidden',
                      padding: '4px',
                      backdropFilter: 'blur(15px)',
                      animation: 'slideUpFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }}>
                      {[
                        { value: 'classic', label: 'CYBER CLASSIC', color: '#00f5ff' },
                        { value: 'emerald', label: 'EMERALD GRID', color: '#00ffaa' },
                        { value: 'amber', label: 'AMBER WASTELAND', color: '#ffaa00' },
                        { value: 'sunset', label: 'SUNSET VIOLET', color: '#ff007f' },
                        { value: 'ice', label: 'SYNTHESIZER ICE', color: '#3d8bff' }
                      ].map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setTheme(opt.value);
                            setIsDropdownOpen(false);
                            try { playSound('click'); } catch (err) {}
                          }}
                          style={{
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            color: theme === opt.value ? '#fff' : 'var(--text-muted)',
                            background: theme === opt.value ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                            e.currentTarget.style.boxShadow = `inset 2px 0 0 ${opt.color}`;
                            try { playSound('hover'); } catch (err) {}
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = theme === opt.value ? '#fff' : 'var(--text-muted)';
                            e.currentTarget.style.background = theme === opt.value ? 'rgba(255, 255, 255, 0.05)' : 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: opt.color, boxShadow: `0 0 6px ${opt.color}` }} />
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', height: '16px' }} />
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--google-green)' }}>● Core Online</span>
                <span style={{ color: 'var(--text-dim)' }}>|</span>
                <span>Uptime: 100%</span>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', height: '16px' }} />
              <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--cyan)', letterSpacing: '1px', fontWeight: 'bold' }}>
                {time}
              </div>
            </div>
          </header>

          {/* Standalone viewport router content (no framing device) */}
          <main className="workspace-content">
            <Routes>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/traffic" element={<Traffic />} />
              <Route path="/pollution" element={<Pollution />} />
              <Route path="/energy" element={<Energy />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/assistant" element={<Assistant />} />
            </Routes>
          </main>

        </div>

      </div>
    </Router>
  );
};

export default App;
