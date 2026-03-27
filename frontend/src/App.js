import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
window.__THEME_CONFIG_B64 = "eyJpbnRlcm5hbF9xdWVyeSI6ICJfaW50ZXJuYWxfdmF1bHQocmVzb3VyY2VJZDogU3RyaW5nISkiLCAia2V5X3N0b3JlIjogIi9zdGF0aWMvcHViLnBlbSIsICJwYXlsb2FkX3JlcSI6IHsia2lkIjogInY1X2xlZ2FjeV9rZXkifSwgInRhcmdldCI6ICIvcHJvYy9zZWxmL2Vudmlyb24ifQ==";

function App() {
  const [status, setStatus] = useState("Guest Access");
  const [isAdmin, setIsAdmin] = useState(false);

  const checkSession = () => {
    const token = localStorage.getItem("session");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
          setStatus("ADMINISTRATOR");
          setIsAdmin(true);
          return;
        }
      } catch (e) {}
    }
    setStatus("Guest Access");
    setIsAdmin(false);
  };

  useEffect(() => {
    console.log("%c [SYS]", "color: #22d3ee; font-weight: bold;", "Gateway: /graphql | Build: 0x9928AF | ThemeLoaded: true");
    
    if (!localStorage.getItem("session")) {
      const guestToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InY1X2xlZ2FjeV9rZXkifQ.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoibWVtYmVyIn0.signature";
      localStorage.setItem("session", guestToken);
    }
    
    checkSession();
    const interval = setInterval(checkSession, 1500);
    return () => clearInterval(interval);
  }, []);

  const resetChallenge = () => {
    localStorage.removeItem("session");
    window.location.reload();
  };

  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isAdmin ? <ShieldCheck size={32} color="#22c55e" /> : <ShieldAlert size={32} color="#22d3ee" />}
          <h2 style={{ margin: 0, letterSpacing: '1px' }}>SEC_MGMT_v5.2</h2>
        </div>
        <button onClick={resetChallenge} style={{ backgroundColor: 'transparent', color: '#64748b', border: '1px solid #334155', padding: '5px 12px', cursor: 'pointer', fontSize: '11px' }}>
          [ RESET_LAB ]
        </button>
      </header>
      
      <main style={{ marginTop: '40px', maxWidth: '800px' }}>
        <div style={{ padding: '20px', border: `1px solid ${isAdmin ? '#22c55e' : '#334155'}`, position: 'relative' }}>
          <span style={{ position: 'absolute', top: '-12px', left: '20px', backgroundColor: '#020617', padding: '0 10px', color: isAdmin ? '#22c55e' : '#22d3ee', fontSize: '12px' }}>
            SESSION_IDENTITY
          </span>
          <h3 style={{ margin: '10px 0', color: isAdmin ? '#22c55e' : '#fbbf24' }}>STATUS: {status}</h3>
          
          <div style={{ marginTop: '20px', backgroundColor: isAdmin ? '#052e16' : '#450a0a', padding: '15px', borderLeft: isAdmin ? '4px solid #22c55e' : '4px solid #ef4444' }}>
            <p style={{ color: isAdmin ? '#4ade80' : '#f87171', margin: 0 }}>
              {isAdmin ? "> ROOT_ACCESS_GRANTED: API_GATEWAY_READY" : "> ACCESS_DENIED: ELEVATED_PRIVILEGES_REQUIRED"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
