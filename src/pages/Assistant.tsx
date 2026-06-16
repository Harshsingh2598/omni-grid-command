import React, { useState, useEffect, useRef } from 'react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'assistant', text: 'Initialize AI Agent Network... Secure Link established. How can I assist you with Omni-Grid Command metrics today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: inputValue } as Message];
    setMessages(newMessages);
    setInputValue('');

    // Generate responsive agent recommendation simulation
    setTimeout(() => {
      let reply = "Processing data vectors... Optimal solution requires routing additional grid energy to District Downtown Core to offset traffic congestion indicators.";
      if (inputValue.toLowerCase().includes('traffic')) {
        reply = "TRAFFIC AGENT: Rerouting recommendation initialized. Diverting lane metrics off Highway 101 to relieve Residential sector congestion.";
      } else if (inputValue.toLowerCase().includes('pollution') || inputValue.toLowerCase().includes('aqi')) {
        reply = "POLLUTION AGENT: High PM2.5 detected in Industrial Zone B. Recommending activation of industrial air filtration networks.";
      } else if (inputValue.toLowerCase().includes('energy') || inputValue.toLowerCase().includes('power')) {
        reply = "ENERGY AGENT: Demand spike forecasted. Suggesting battery storage release to mitigate generator overload.";
      } else if (inputValue.toLowerCase().includes('emergency') || inputValue.toLowerCase().includes('risk')) {
        reply = "EMERGENCY AGENT: System risk is SAFE. Nearest response units located at Station 4 (1.2km) are on standby.";
      }
      setMessages([...newMessages, { sender: 'assistant', text: reply }]);
    }, 1000);
  };

  return (
    <div className="cyber-panel panel-corners ai-widget stagger-in" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ color: 'var(--cyan)', fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Outfit' }}>
        AI City Assistant Chat
      </h3>
      
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.sender}`}>
            <span style={{ fontSize: '0.75rem', display: 'block', opacity: 0.6, marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              {m.sender.toUpperCase()}
            </span>
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-wrapper">
        <input 
          type="text" 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          placeholder="Ask Traffic, Pollution, Energy, or Emergency agent..." 
          className="chat-input"
        />
        <button type="submit" className="btn-send">SEND</button>
      </form>
    </div>
  );
};

export default Assistant;
