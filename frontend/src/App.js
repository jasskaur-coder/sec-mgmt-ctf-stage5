import React, { useEffect, useState } from 'react';
import { ShieldAlert, RotateCcw, ShieldCheck } from 'lucide-react';

// 🚨 THE CTF HINT: Attaching to 'window' ensures Webpack doesn't delete it during build.
// Participants will find this by inspecting the Source tab or typing 'window' in the console.
window._DEV_NOTES = {
  internal_query: "_internal_vault(resourceId: String!)",
  legacy_auth: "RS256_MIGRATION_PENDING",
  key_store: "/static/pub.pem",
  backup_file: "system_secrets.txt" 
};

function App() {
  const [status, setStatus] = useState("Guest Access");
  const [isAdmin, setIsAdmin] = useState(false);

  const checkSession = () => {
    const token = localStorage.getItem("session");
    if (token) {
      try {
        // We decode the payload to update UI state
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
    // Console logs are now cryptic "System Notices"
    console.log("%c [SYS]", "color: #22d3ee; font-weight: bold;", "Gateway: /graphql | Build: 0x9928AF");
    // console.log("TODO: Remove window._DEV_NOTES before deploying to production!");
    
    if (!localStorage.getItem("session")) {
      // Starting token (Standard RS256 Guest Token)
      const guestToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoibWVtYmVyIn0.signature";
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

      <footer style={{ marginTop: '100px', color: '#334155', fontSize: '12px' }}>
        <p>INTERNAL_DEV_NODE | CLUSTER_01 | SECURITY_LEVEL: HIGH</p>
      </footer>
    </div>
  );
}

export default App;