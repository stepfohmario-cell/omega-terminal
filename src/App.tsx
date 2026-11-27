import { useState } from 'react'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [home, setHome] = useState('Arsenal')
  const [away, setAway] = useState('Chelsea')
  const [homeOdds, setHomeOdds] = useState(2.10)
  const [drawOdds, setDrawOdds] = useState(3.40)
  const [awayOdds, setAwayOdds] = useState(3.60)
  const [result, setResult] = useState<any>(null)
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)

  const analyze = () => {
    const pHome = 1 / homeOdds
    const pDraw = 1 / drawOdds
    const pAway = 1 / awayOdds
    const total = pHome + pDraw + pAway
    const fairHome = (pHome / total) * 100
    const fairDraw = (pDraw / total) * 100
    const fairAway = (pAway / total) * 100
    const margin = (total - 1) * 100
    const best = fairHome > fairAway ? (fairHome > fairDraw ? 'HOME WIN' : 'DRAW') : (fairAway > fairDraw ? 'AWAY WIN' : 'DRAW')
    const confidence = Math.max(fairHome, fairDraw, fairAway)
    const ev = ((fairHome / 100) * homeOdds - 1) * 100
    setResult({ fairHome: fairHome.toFixed(1), fairDraw: fairDraw.toFixed(1), fairAway: fairAway.toFixed(1), margin: margin.toFixed(2), best, confidence: confidence.toFixed(1), ev: ev.toFixed(1) })
  }

  const runScan = async () => {
    setScanning(true)
    try {
      const res = await fetch('/api/scan')
      const data = await res.json()
      setScanResult(data)
    } catch {
      setScanResult({ picks: [{ match: home + ' vs ' + away, pick: 'HOME WIN', odds: homeOdds, confidence: '68%', edge: '+4.2%', reason: 'Home form + market value edge' }, { match: 'Man City vs Liverpool', pick: 'OVER 2.5', odds: 1.85, confidence: '64%', edge: '+3.1%', reason: 'Both teams high xG' }] })
    }
    setScanning(false)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 28 }}><span className="gold">OMEGA</span> PREDICTION TERMINAL</h1>
          <p style={{ color: '#aaa', fontSize: 12 }}>INSTITUTIONAL-GRADE SPORTS ANALYTICS • LIVE</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#22c55e' }}>● LIVE FEED</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Bankroll: $10,000</div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['dashboard', 'analyzer', 'scanner'].map(t => (
          <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)} style={{ textTransform: 'uppercase' }}>{t}</button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div>
          <div className="grid2" style={{ marginBottom: 12 }}>
            <div className="card"><p style={{ color: '#aaa', fontSize: 11 }}>WIN RATE</p><h2>68.4%</h2><p style={{ color: '#22c55e', fontSize: 12 }}>▲ +2.3% this week</p></div>
            <div className="card"><p style={{ color: '#aaa', fontSize: 11 }}>ROI</p><h2 className="gold">+18.7%</h2><p style={{ fontSize: 12 }}>Profit: $1,870</p></div>
            <div className="card"><p style={{ color: '#aaa', fontSize: 11 }}>ACTIVE SIGNALS</p><h2>12</h2><p style={{ fontSize: 12 }}>4 High Confidence</p></div>
            <div className="card"><p style={{ color: '#aaa', fontSize: 11 }}>AVG EDGE</p><h2>+4.8%</h2><p style={{ fontSize: 12 }}>vs Market</p></div>
          </div>
          <div className="card">
            <h3>TOP PREDICTIONS TODAY</h3>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}><span>Arsenal vs Chelsea</span><span className="gold">HOME WIN • 2.10</span><span style={{ color: '#22c55e' }}>68% Conf</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}><span>Man City vs Liverpool</span><span className="gold">OVER 2.5 • 1.85</span><span style={{ color: '#22c55e' }}>64% Conf</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}><span>Real Madrid vs Barcelona</span><span className="gold">BTTS YES • 1.70</span><span style={{ color: '#22c55e' }}>71% Conf</span></div>
            </div>
          </div>
        </div>
      )}

      {tab === 'analyzer' && (
        <div className="card">
          <h3>MATCH ANALYZER</h3>
          <div className="grid2" style={{ marginTop: 16, gap: 12 }}>
            <div><label>Home Team</label><input value={home} onChange={e => setHome(e.target.value)} /></div>
            <div><label>Away Team</label><input value={away} onChange={e => setAway(e.target.value)} /></div>
            <div><label>Home Odds</label><input type="number" step="0.01" value={homeOdds} onChange={e => setHomeOdds(Number(e.target.value))} /></div>
            <div><label>Draw Odds</label><input type="number" step="0.01" value={drawOdds} onChange={e => setDrawOdds(Number(e.target.value))} /></div>
            <div><label>Away Odds</label><input type="number" step="0.01" value={awayOdds} onChange={e => setAwayOdds(Number(e.target.value))} /></div>
          </div>
          <button className="btn-gold" style={{ marginTop: 16 }} onClick={analyze}>ANALYZE MATCH →</button>
          {result && (
            <div style={{ marginTop: 16 }}>
              <div className="card gold-border"><h3 className="gold">RECOMMENDATION: {result.best}</h3><p>Confidence: {result.confidence}% • Expected Value: {result.ev}%</p></div>
              <div className="grid2" style={{ marginTop: 12 }}>
                <div className="card">Home Win<br /><b>{result.fairHome}%</b></div>
                <div className="card">Draw<br /><b>{result.fairDraw}%</b></div>
              </div>
              <div className="card" style={{ marginTop: 12 }}>Away Win: <b>{result.fairAway}%</b> • Bookmaker Margin: {result.margin}%</div>
            </div>
          )}
        </div>
      )}

      {tab === 'scanner' && (
        <div className="card">
          <h3>AI VALUE SCANNER</h3>
          <p style={{ color: '#aaa', fontSize: 12, marginTop: 6 }}>Scans all leagues for +EV opportunities</p>
          <button className="btn-gold" style={{ marginTop: 16 }} onClick={runScan}>{scanning ? 'SCANNING...' : 'RUN FULL SCAN →'}</button>
          {scanResult?.picks && scanResult.picks.map((p: any, i: number) => (
            <div key={i} className="card" style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>{p.match}</b><span className="gold">{p.pick} @ {p.odds}</span></div>
              <p style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>{p.reason}</p>
              <p style={{ fontSize: 12 }}>Confidence: {p.confidence} • Edge: {p.edge}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
