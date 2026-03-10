import { useState, useEffect } from "react";

// ── Fonts ──────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Rye&family=Cabin+Condensed:wght@400;700&family=Special+Elite&display=swap";
document.head.appendChild(fontLink);

// ── Global Styles ──────────────────────────────────────────────────────────
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --wood-dark:   #2b1a0e;
    --wood-mid:    #3d2510;
    --wood-light:  #5c3a1e;
    --leather:     #7a4a2a;
    --rust:        #a0522d;
    --amber:       #d4882a;
    --tan:         #c9a46e;
    --cream:       #f2e8d5;
    --parchment:   #ede0c4;
    --iron:        #4a4035;
    --smoke:       #8b7355;
    --red-barn:    #8b2020;
    --green-sage:  #4a5c40;
    --off-white:   #f5f0e8;
  }

  body {
    background-color: var(--wood-dark);
    background-image:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 60px,
        rgba(0,0,0,0.08) 60px,
        rgba(0,0,0,0.08) 62px
      ),
      repeating-linear-gradient(
        180deg,
        transparent,
        transparent 8px,
        rgba(255,255,255,0.015) 8px,
        rgba(255,255,255,0.015) 9px
      );
    color: var(--cream);
    font-family: 'Special Elite', cursive;
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--wood-dark); }
  ::-webkit-scrollbar-thumb { background: var(--leather); border-radius: 3px; }

  input, select, textarea {
    background: rgba(43,26,14,0.8);
    border: 2px solid var(--leather);
    color: var(--cream);
    padding: 10px 14px;
    border-radius: 4px;
    font-family: 'Special Elite', cursive;
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--amber);
    box-shadow: 0 0 0 2px rgba(212,136,42,0.2);
  }
  input::placeholder, textarea::placeholder { color: var(--smoke); }
  select option { background: var(--wood-dark); }

  button { cursor: pointer; font-family: 'Cabin Condensed', sans-serif; transition: all 0.2s; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes flicker {
    0%,100% { opacity: 1; } 50% { opacity: .85; }
  }
  .fade-up { animation: fadeUp 0.5s ease forwards; }

  .nail {
    width: 14px; height: 14px;
    background: radial-gradient(circle at 35% 35%, #888, #333);
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.15);
    flex-shrink: 0;
  }

  .wanted-border {
    border: 3px solid var(--tan);
    box-shadow:
      inset 0 0 0 2px var(--wood-dark),
      inset 0 0 0 4px var(--leather),
      0 4px 20px rgba(0,0,0,.5);
    border-radius: 6px;
  }

  .wood-plank {
    background:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 55px,
        rgba(0,0,0,0.06) 55px,
        rgba(0,0,0,0.06) 57px
      );
    background-color: var(--wood-mid);
  }

  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: 'Cabin Condensed', sans-serif;
  }
  .badge-green  { background: #1e3018; color: #7dbb6a; border: 1px solid #3a5c30; }
  .badge-red    { background: #301818; color: #c97a7a; border: 1px solid #5c3030; }
  .badge-amber  { background: #302010; color: var(--amber); border: 1px solid #5c4020; }
  .badge-blue   { background: #182030; color: #7aaac9; border: 1px solid #305060; }

  .star-divider::before, .star-divider::after {
    content: '— ★ ★ ★ —';
    color: var(--amber);
    font-family: 'Rye', cursive;
    font-size: 13px;
    letter-spacing: 4px;
  }

  /* Worn texture overlay on cards */
  .card-worn::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    border-radius: inherit;
    pointer-events: none;
  }
`;
const styleEl = document.createElement("style");
styleEl.textContent = globalCSS;
document.head.appendChild(styleEl);

// ── DATA ───────────────────────────────────────────────────────────────────
const SERVICES = [
  { id:1, name:"Classic Cut",       duration:30, price:35, icon:"✂️" },
  { id:2, name:"Cut & Beard",       duration:60, price:65, icon:"🪒" },
  { id:3, name:"Beard Trim",        duration:30, price:35, icon:"🧔" },
  { id:4, name:"Brow Shape",        duration:15, price:20, icon:"🙆" },
  { id:5, name:"Kid's Cut",         duration:25, price:28, icon:"👦" },
  { id:6, name:"Color & Bleach",    duration:90, price:120, icon:"💈" },
];

const MUSIC_GENRES = [
  { id:1, name:"Country & Western", icon:"🤠" },
  { id:2, name:"Outlaw Country",    icon:"🎸" },
  { id:3, name:"Bluegrass",         icon:"🪕" },
  { id:4, name:"Classic Rock",      icon:"🎵" },
  { id:5, name:"Blues",             icon:"🎷" },
  { id:6, name:"Old Sertanejo",     icon:"🎶" },
  { id:7, name:"Gospel / Soul",     icon:"🙏" },
  { id:8, name:"Easy Listening",    icon:"☁️" },
];

const INITIAL_APPOINTMENTS = [
  { id:1, client:"Lucas Mendes",  phone:"11987654321", service:"Cut & Beard",  date:"2025-06-12", time:"09:00", status:"confirmado", payment:"pix",    music:"Country & Western", price:65 },
  { id:2, client:"Rafael Costa",  phone:"11912345678", service:"Classic Cut",  date:"2025-06-12", time:"10:00", status:"aguardando", payment:"cartão", music:"Classic Rock",       price:35 },
  { id:3, client:"Diego Alves",   phone:"11955551234", service:"Beard Trim",   date:"2025-06-12", time:"11:00", status:"confirmado", payment:"dinheiro",music:"Blues",             price:35 },
  { id:4, client:"Marcos Lima",   phone:"11944449999", service:"Brow Shape",   date:"2025-06-13", time:"14:00", status:"cancelado", payment:"pix",     music:"Easy Listening",    price:20 },
];

const INITIAL_CLIENTS = [
  { id:1, name:"Lucas Mendes", phone:"11987654321", visits:8,  lastVisit:"2025-05-30", favoriteService:"Cut & Beard" },
  { id:2, name:"Rafael Costa", phone:"11912345678", visits:3,  lastVisit:"2025-05-20", favoriteService:"Classic Cut" },
  { id:3, name:"Diego Alves",  phone:"11955551234", visits:12, lastVisit:"2025-06-01", favoriteService:"Beard Trim" },
];

// ── HELPERS ────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", style={}, disabled=false }) {
  const base = {
    padding:"10px 22px", borderRadius:4, fontWeight:700, fontSize:14,
    letterSpacing:"1px", textTransform:"uppercase", border:"none",
    display:"inline-flex", alignItems:"center", gap:6,
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: {
      background:"linear-gradient(180deg, #d4882a 0%, #a05c18 100%)",
      color:"#fff",
      boxShadow:"0 3px 0 #5c3010, 0 4px 12px rgba(0,0,0,.4)",
      border:"1px solid #7a4a1a",
    },
    ghost: {
      background:"transparent",
      color: "var(--tan)",
      border:"2px solid var(--leather)",
      boxShadow:"none",
    },
    danger: {
      background:"transparent",
      color:"#c97a7a",
      border:"2px solid #8b2020",
    },
    dark: {
      background:"rgba(43,26,14,.9)",
      color:"var(--cream)",
      border:"2px solid var(--leather)",
    },
    green: {
      background:"transparent",
      color:"#7dbb6a",
      border:"2px solid #3a5c30",
    },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function Card({ children, style={}, className="" }) {
  return (
    <div className={`card-worn ${className}`} style={{
      background:"linear-gradient(160deg, #3d2a18 0%, #2b1a0e 100%)",
      border:"2px solid var(--leather)",
      borderRadius:6,
      padding:20,
      position:"relative",
      boxShadow:"0 4px 20px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(10,6,2,.88)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div className="fade-up wanted-border" style={{
        background:"linear-gradient(160deg, #3d2a18 0%, #2b1a0e 100%)",
        width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto",
        position:"relative",
      }}>
        {/* Nail corners */}
        {["top:8px;left:8px","top:8px;right:8px","bottom:8px;left:8px","bottom:8px;right:8px"].map((pos,i) => (
          <div key={i} className="nail" style={{ position:"absolute", ...Object.fromEntries(pos.split(";").map(p => p.split(":"))) }} />
        ))}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"18px 28px", borderBottom:"2px solid var(--leather)",
        }}>
          <span style={{ fontFamily:"'Rye',cursive", fontSize:20, color:"var(--amber)", letterSpacing:2 }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--smoke)", fontSize:26, lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:"20px 28px" }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:12, color:"var(--tan)", marginBottom:5, textTransform:"uppercase", letterSpacing:1.5, fontFamily:"'Cabin Condensed',sans-serif", fontWeight:700 }}>{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom:24 }}>
      <h2 style={{ fontFamily:"'Rye',cursive", fontSize:30, color:"var(--amber)", letterSpacing:3, textShadow:"2px 2px 0 rgba(0,0,0,.5)" }}>{children}</h2>
      <div style={{ height:2, background:"linear-gradient(90deg, var(--amber), var(--leather), transparent)", marginTop:6, maxWidth:320 }} />
    </div>
  );
}

function RopeDivider() {
  return (
    <div style={{ textAlign:"center", padding:"8px 0", color:"var(--tan)", fontSize:12, letterSpacing:6, fontFamily:"'Rye',cursive" }}>
      ~ ~ ~ ~ ~
    </div>
  );
}

// ── BARBER LOGIN SCREEN ────────────────────────────────────────────────────
// Default credentials (owner can change inside Settings)
const DEFAULT_BARBER = { email: "barbeiro@redbarn.com", password: "redbarn2024" };

function BarberLogin({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const [shaking, setShaking]   = useState(false);

  const saved = (() => {
    try { return JSON.parse(localStorage.getItem("rb_barber") || "null") || DEFAULT_BARBER; } catch { return DEFAULT_BARBER; }
  })();

  const attempt = () => {
    if (email.trim().toLowerCase() === saved.email.toLowerCase() && password === saved.password) {
      onLogin();
    } else {
      setError("Wrong credentials, partner. Try again. 🤠");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
      background:"linear-gradient(160deg,#1a0e06 0%,#2b1a0e 60%,#1a0e06 100%)",
    }}>
      <div
        className="fade-up"
        style={{
          width:"100%", maxWidth:420,
          animation: shaking ? "shake 0.4s ease" : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%{transform:translateX(-10px)}
            40%{transform:translateX(10px)}
            60%{transform:translateX(-8px)}
            80%{transform:translateX(8px)}
          }
        `}</style>

        {/* Wanted poster style login card */}
        <div className="wanted-border" style={{
          background:"linear-gradient(160deg,#3d2a18,#2b1a0e)",
          padding:"36px 32px",
          position:"relative",
          textAlign:"center",
        }}>
          {/* Nail corners */}
          {["top:8px;left:8px","top:8px;right:8px","bottom:8px;left:8px","bottom:8px;right:8px"].map((pos,i)=>(
            <div key={i} className="nail" style={{ position:"absolute",...Object.fromEntries(pos.split(";").map(p=>p.split(":"))) }} />
          ))}

          {/* Badge star */}
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"linear-gradient(135deg,var(--amber),#7a4a10)",
            border:"3px solid var(--tan)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:32, margin:"0 auto 20px",
            boxShadow:"0 0 24px rgba(212,136,42,.4), inset 0 2px 4px rgba(255,255,255,.1)",
          }}>🔒</div>

          <div style={{ fontFamily:"'Rye',cursive", fontSize:26, color:"var(--amber)", letterSpacing:3, textShadow:"2px 2px 0 rgba(0,0,0,.5)", marginBottom:4 }}>
            STAFF ONLY
          </div>
          <div style={{ fontFamily:"'Special Elite',cursive", color:"var(--smoke)", fontSize:13, marginBottom:28 }}>
            Authorized personnel only beyond this point
          </div>

          <div style={{ textAlign:"left" }}>
            <Field label="E-mail">
              <input
                type="email"
                value={email}
                onChange={e=>{ setEmail(e.target.value); setError(""); }}
                placeholder="barbeiro@redbarn.com"
                onKeyDown={e=>e.key==="Enter"&&attempt()}
              />
            </Field>
            <Field label="Password">
              <div style={{ position:"relative" }}>
                <input
                  type={showPass?"text":"password"}
                  value={password}
                  onChange={e=>{ setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  onKeyDown={e=>e.key==="Enter"&&attempt()}
                  style={{ paddingRight:44 }}
                />
                <button
                  onClick={()=>setShowPass(!showPass)}
                  style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--smoke)",fontSize:16 }}
                >{showPass?"🙈":"👁️"}</button>
              </div>
            </Field>
          </div>

          {error && (
            <div style={{
              background:"rgba(139,32,32,.2)", border:"1px solid var(--red-barn)",
              borderRadius:4, padding:"10px 14px", marginBottom:16,
              color:"#c97a7a", fontSize:13, fontFamily:"'Special Elite',cursive",
            }}>{error}</div>
          )}

          <Btn
            onClick={attempt}
            disabled={!email||!password}
            style={{ width:"100%", padding:"14px", fontSize:15, justifyContent:"center" }}
          >
            🤠 Enter the Ranch
          </Btn>

          <div style={{ marginTop:20, padding:"12px", background:"rgba(212,136,42,.07)", borderRadius:4, border:"1px solid rgba(212,136,42,.15)" }}>
            <div style={{ fontSize:11, color:"var(--smoke)", fontFamily:"'Cabin Condensed',sans-serif", letterSpacing:1 }}>
              DEFAULT CREDENTIALS (change in Settings after login)
            </div>
            <div style={{ fontSize:12, color:"var(--tan)", marginTop:4, fontFamily:"'Special Elite',cursive" }}>
              📧 barbeiro@redbarn.com<br/>🔑 redbarn2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HEADER ─────────────────────────────────────────────────────────────────
function Header({ view, setView, isBarber, onLogout, onGoLogin }) {
  const clientViews = ["home","agendar","meus horários"];
  const barberViews = ["dashboard","agenda","clientes","serviços","configurações"];
  const navViews    = isBarber ? barberViews : clientViews;

  return (
    <header style={{ background:"var(--wood-dark)", borderBottom:"3px solid var(--leather)", position:"sticky", top:0, zIndex:100 }}>
      <div style={{ height:4, background:"repeating-linear-gradient(90deg, var(--amber) 0, var(--amber) 12px, var(--red-barn) 12px, var(--red-barn) 24px)" }} />

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:70, gap:12, flexWrap:"wrap" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:32, filter:"drop-shadow(2px 2px 4px rgba(0,0,0,.6))" }}>🤠</div>
          <div>
            <div style={{ fontFamily:"'Rye',cursive", fontSize:22, color:"var(--amber)", letterSpacing:3, lineHeight:1, textShadow:"2px 2px 0 rgba(0,0,0,.5)" }}>RED BARN</div>
            <div style={{ fontFamily:"'Rye',cursive", fontSize:12, color:"var(--tan)", letterSpacing:4, marginTop:1 }}>BARBER SHOP</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display:"flex", gap:2, flexWrap:"wrap" }}>
          {navViews.map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view===v ? "rgba(212,136,42,.18)" : "transparent",
              color: view===v ? "var(--amber)" : "var(--smoke)",
              border: view===v ? "1px solid var(--leather)" : "1px solid transparent",
              padding:"6px 14px", borderRadius:4, fontSize:13, fontWeight:700,
              textTransform:"capitalize", letterSpacing:.5,
              fontFamily:"'Cabin Condensed',sans-serif",
            }}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>
          ))}
        </nav>

        {/* Auth button */}
        {isBarber
          ? <Btn variant="danger" onClick={onLogout} style={{ fontSize:12 }}>🚪 Sair</Btn>
          : <Btn variant="dark"   onClick={onGoLogin} style={{ fontSize:12 }}>🔑 Barbeiro</Btn>
        }
      </div>
    </header>
  );
}

// ── CLIENT HOME ────────────────────────────────────────────────────────────
function ClientHome({ setView, photos = [] }) {
  return (
    <div className="fade-up">

      {/* HERO */}
      <div style={{
        position:"relative", overflow:"hidden",
        background:"linear-gradient(180deg, #1a0e06 0%, #2b1a0e 60%, #1a0e06 100%)",
        borderBottom:"4px solid var(--leather)",
        padding:"70px 24px 60px",
        textAlign:"center",
      }}>
        {/* Diagonal wood grain bg */}
        <div style={{
          position:"absolute", inset:0, opacity:.07,
          backgroundImage:"repeating-linear-gradient(35deg, transparent, transparent 40px, rgba(212,136,42,1) 40px, rgba(212,136,42,1) 42px)",
        }} />
        {/* Star badge */}
        <div style={{
          display:"inline-block",
          border:"2px solid var(--amber)", borderRadius:"50%",
          width:64, height:64, lineHeight:"60px", fontSize:30,
          marginBottom:20, background:"rgba(212,136,42,.1)",
          boxShadow:"0 0 30px rgba(212,136,42,.3)",
        }}>⭐</div>
        <div style={{ fontFamily:"'Cabin Condensed',sans-serif", fontWeight:700, color:"var(--tan)", letterSpacing:6, fontSize:13, marginBottom:8 }}>
          — EST. 2010 · SÃO PAULO, BRAZIL —
        </div>
        <h1 style={{ fontFamily:"'Rye',cursive", fontSize:"clamp(42px,8vw,80px)", color:"var(--cream)", lineHeight:1.05, textShadow:"3px 3px 0 rgba(0,0,0,.6)", marginBottom:8 }}>
          RED BARN<br/><span style={{ color:"var(--amber)" }}>BARBER SHOP</span>
        </h1>
        <p style={{ color:"var(--smoke)", fontSize:16, maxWidth:400, margin:"16px auto 36px", fontFamily:"'Special Elite',cursive", lineHeight:1.6 }}>
          Where every cut tells a story. Real craft, real tools, real men.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <Btn onClick={() => setView("agendar")} style={{ padding:"14px 36px", fontSize:15 }}>✂️ Book Your Seat</Btn>
          <Btn variant="ghost" onClick={() => setView("meus horários")} style={{ padding:"14px 24px", fontSize:15 }}>My Appointments</Btn>
        </div>
      </div>

      {/* WANTED-POSTER-style services */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"52px 24px" }}>

        <div style={{ textAlign:"center", marginBottom:40 }}>
          <SectionTitle>Our Services</SectionTitle>
          <div className="star-divider" />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:18, marginBottom:56 }}>
          {SERVICES.map((s,i) => (
            <div
              key={s.id}
              className="wanted-border fade-up"
              onClick={() => setView("agendar")}
              style={{
                background:"linear-gradient(160deg, #3d2a18, #2b1a0e)",
                padding:24, textAlign:"center", cursor:"pointer",
                animationDelay:`${i*0.08}s`,
                transition:"transform .2s, box-shadow .2s",
                position:"relative",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(0,0,0,.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=""; }}
            >
              {/* Nail corners */}
              <div className="nail" style={{ position:"absolute", top:8, left:8 }} />
              <div className="nail" style={{ position:"absolute", top:8, right:8 }} />
              <div style={{ fontSize:38, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Rye',cursive", fontSize:16, color:"var(--cream)", marginBottom:4 }}>{s.name}</div>
              <div style={{ color:"var(--smoke)", fontSize:12, marginBottom:10, fontFamily:"'Cabin Condensed',sans-serif", letterSpacing:1 }}>{s.duration} MIN</div>
              <div style={{ fontFamily:"'Rye',cursive", fontSize:26, color:"var(--amber)", textShadow:"1px 1px 0 rgba(0,0,0,.5)" }}>R$ {s.price}</div>
            </div>
          ))}
        </div>

        <RopeDivider />

{/* Public Gallery injected via App */}
        {/* Info cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16, marginTop:36 }}>
          {[
            { icon:"📍", title:"Find Us", text:"Rua das Acácias, 342\nCentro – São Paulo, SP\n\nGoogle Maps →" },
            { icon:"🕐", title:"Hours",   text:"Mon–Fri: 9am–8pm\nSaturday: 8am–6pm\nSunday: Closed" },
            { icon:"📞", title:"Holler",  text:"(11) 9 8765-4321\n24h WhatsApp bot\nwalk-ins welcome" },
            { icon:"💰", title:"Pay",     text:"Pix · Credit Card\nDebit · Cash\nOnline payment link" },
          ].map(item => (
            <Card key={item.title} style={{ position:"relative" }}>
              <div className="nail" style={{ position:"absolute", top:8, left:8 }} />
              <div className="nail" style={{ position:"absolute", top:8, right:8 }} />
              <div style={{ fontSize:28, marginBottom:8 }}>{item.icon}</div>
              <div style={{ fontFamily:"'Rye',cursive", fontSize:15, color:"var(--amber)", marginBottom:8, letterSpacing:1 }}>{item.title}</div>
              <div style={{ color:"var(--smoke)", fontSize:13, whiteSpace:"pre-line", lineHeight:1.8, fontFamily:"'Special Elite',cursive" }}>{item.text}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BOOKING ────────────────────────────────────────────────────────────────
function Booking({ appointments, setAppointments }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ client:"", phone:"", service:"", date:"", time:"", payment:"pix", music:"", notes:"" });
  const [done, setDone] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
  const occupied = appointments.filter(a => a.date===form.date && a.status!=="cancelado").map(a => a.time);
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const confirm = () => {
    const id = Date.now();
    setAppointments(prev => [...prev, { id, ...form, status:"aguardando", price: SERVICES.find(s=>s.name===form.service)?.price||0 }]);
    setBookingId(id);
    setDone(true);
  };

  if (done) return (
    <div className="fade-up" style={{ maxWidth:500, margin:"60px auto", padding:"0 24px", textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🤠</div>
      <h2 style={{ fontFamily:"'Rye',cursive", fontSize:34, color:"var(--amber)", letterSpacing:3, marginBottom:8 }}>You're Booked, Partner!</h2>
      <Card style={{ marginBottom:20, textAlign:"left" }}>
        <div className="nail" style={{ position:"absolute", top:8, left:8 }} />
        <div className="nail" style={{ position:"absolute", top:8, right:8 }} />
        <div style={{ fontFamily:"'Special Elite',cursive", lineHeight:2, color:"var(--cream)" }}>
          <div>📋 <strong>{form.service}</strong></div>
          <div>📅 {form.date} at {form.time}</div>
          <div>🎵 {form.music}</div>
          <div>💳 {form.payment}</div>
          <div style={{ color:"var(--smoke)", fontSize:13, marginTop:8 }}>Booking ID: <strong style={{ color:"var(--amber)" }}>#{bookingId}</strong></div>
        </div>
      </Card>
      <Card style={{ marginBottom:20 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ fontSize:28 }}>💬</div>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontFamily:"'Rye',cursive", color:"var(--amber)", fontSize:14, marginBottom:2 }}>WhatsApp Confirmation</div>
            <div style={{ color:"var(--smoke)", fontSize:12 }}>Bot sends reminder to {form.phone}</div>
          </div>
          <span className="badge badge-green" style={{ marginLeft:"auto" }}>BOT ON</span>
        </div>
      </Card>
      <Btn onClick={() => { setDone(false); setStep(1); setForm({ client:"",phone:"",service:"",date:"",time:"",payment:"pix",music:"",notes:"" }); }}>
        Book Another
      </Btn>
    </div>
  );

  const STEPS = ["Your Info","Service","Date & Time","Payment & Tunes"];

  return (
    <div className="fade-up" style={{ maxWidth:660, margin:"40px auto", padding:"0 24px" }}>
      <SectionTitle>Book Your Seat</SectionTitle>

      {/* Step progress */}
      <div style={{ display:"flex", marginBottom:28, gap:0 }}>
        {STEPS.map((s,i) => (
          <div key={i} style={{ flex:1, textAlign:"center" }}>
            <div style={{
              width:32, height:32, borderRadius:"50%",
              background: step>i+1 ? "var(--amber)" : step===i+1 ? "var(--amber)" : "var(--iron)",
              color: step>=i+1 ? "#1a0e06" : "var(--smoke)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 6px", fontSize:13, fontWeight:900,
              border:`2px solid ${step>=i+1 ? "var(--amber)" : "var(--leather)"}`,
              fontFamily:"'Cabin Condensed',sans-serif",
            }}>{step>i+1?"✓":i+1}</div>
            <div style={{ fontSize:10, color: step===i+1?"var(--amber)":"var(--smoke)", letterSpacing:.5, fontFamily:"'Cabin Condensed',sans-serif", fontWeight:700 }}>{s}</div>
          </div>
        ))}
      </div>

      <div className="wanted-border" style={{ background:"linear-gradient(160deg,#3d2a18,#2b1a0e)", padding:28, position:"relative" }}>
        <div className="nail" style={{ position:"absolute", top:8, left:8 }} />
        <div className="nail" style={{ position:"absolute", top:8, right:8 }} />
        <div className="nail" style={{ position:"absolute", bottom:8, left:8 }} />
        <div className="nail" style={{ position:"absolute", bottom:8, right:8 }} />

        {step===1 && (
          <div>
            <Field label="Full Name"><input value={form.client} onChange={e=>set("client",e.target.value)} placeholder="John Wayne" /></Field>
            <Field label="WhatsApp (with area code)"><input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="11987654321" maxLength={11} /></Field>
          </div>
        )}

        {step===2 && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {SERVICES.map(s => (
              <button key={s.id} onClick={() => set("service",s.name)} style={{
                padding:14, borderRadius:4, cursor:"pointer", textAlign:"left",
                border:`2px solid ${form.service===s.name?"var(--amber)":"var(--leather)"}`,
                background: form.service===s.name ? "rgba(212,136,42,.15)" : "rgba(43,26,14,.8)",
                transition:"all .2s",
              }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Rye',cursive", fontSize:13, color:"var(--cream)", marginBottom:2 }}>{s.name}</div>
                <div style={{ fontSize:11, color:"var(--smoke)", fontFamily:"'Cabin Condensed',sans-serif", letterSpacing:1 }}>{s.duration} MIN</div>
                <div style={{ color:"var(--amber)", fontFamily:"'Rye',cursive", fontSize:17, marginTop:2 }}>R$ {s.price}</div>
              </button>
            ))}
          </div>
        )}

        {step===3 && (
          <div>
            <Field label="Pick a Date">
              <input type="date" value={form.date} onChange={e=>set("date",e.target.value)} min={new Date().toISOString().split("T")[0]} />
            </Field>
            {form.date && (
              <Field label="Available Times">
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                  {TIMES.map(t => {
                    const occ = occupied.includes(t);
                    return (
                      <button key={t} disabled={occ} onClick={() => set("time",t)} style={{
                        padding:"10px 2px", borderRadius:4, fontSize:13,
                        fontFamily:"'Cabin Condensed',sans-serif", fontWeight:700,
                        border:`2px solid ${form.time===t?"var(--amber)":occ?"var(--iron)":"var(--leather)"}`,
                        background: form.time===t?"rgba(212,136,42,.2)":occ?"rgba(26,14,6,.6)":"rgba(43,26,14,.8)",
                        color: form.time===t?"var(--amber)":occ?"var(--iron)":"var(--cream)",
                        cursor: occ?"not-allowed":"pointer",
                        textDecoration: occ?"line-through":"none",
                      }}>{t}</button>
                    );
                  })}
                </div>
              </Field>
            )}
          </div>
        )}

        {step===4 && (
          <div>
            <Field label="Payment Method">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[["pix","🏦 Pix"],["cartão","💳 Card"],["dinheiro","💵 Cash"],["link","🔗 Pay Link"]].map(([val,label])=>(
                  <button key={val} onClick={() => set("payment",val)} style={{
                    padding:"12px 8px", borderRadius:4, fontSize:13,
                    fontFamily:"'Cabin Condensed',sans-serif", fontWeight:700,
                    border:`2px solid ${form.payment===val?"var(--amber)":"var(--leather)"}`,
                    background: form.payment===val?"rgba(212,136,42,.15)":"rgba(43,26,14,.8)",
                    color: form.payment===val?"var(--amber)":"var(--cream)",
                  }}>{label}</button>
                ))}
              </div>
            </Field>
            <Field label="🎵 Pick Your Music">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {MUSIC_GENRES.map(g=>(
                  <button key={g.id} onClick={() => set("music",g.name)} style={{
                    padding:"10px 8px", borderRadius:4, fontSize:12,
                    fontFamily:"'Cabin Condensed',sans-serif", fontWeight:700,
                    border:`2px solid ${form.music===g.name?"var(--amber)":"var(--leather)"}`,
                    background: form.music===g.name?"rgba(212,136,42,.15)":"rgba(43,26,14,.8)",
                    color: form.music===g.name?"var(--amber)":"var(--cream)",
                  }}>{g.icon} {g.name}</button>
                ))}
              </div>
            </Field>
            <Field label="Special Requests">
              <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={3} placeholder="Anything special, partner?" />
            </Field>
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", marginTop:24, borderTop:"1px solid var(--leather)", paddingTop:18 }}>
          {step>1 ? <Btn variant="ghost" onClick={()=>setStep(s=>s-1)}>← Back</Btn> : <div/>}
          {step<4
            ? <Btn onClick={()=>setStep(s=>s+1)} disabled={
                (step===1&&(!form.client||!form.phone))||
                (step===2&&!form.service)||
                (step===3&&(!form.date||!form.time))
              }>Next →</Btn>
            : <Btn onClick={confirm} disabled={!form.payment||!form.music}>🤠 Confirm Booking</Btn>
          }
        </div>
      </div>
    </div>
  );
}

// ── CLIENT APPOINTMENTS ────────────────────────────────────────────────────
function ClientAppointments({ appointments, setAppointments }) {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const myAppts = appointments.filter(a=>a.phone===phone);
  const cancel = id => setAppointments(prev=>prev.map(a=>a.id===id?{...a,status:"cancelado"}:a));

  return (
    <div className="fade-up" style={{ maxWidth:660, margin:"40px auto", padding:"0 24px" }}>
      <SectionTitle>My Appointments</SectionTitle>
      <div className="wanted-border" style={{ background:"linear-gradient(160deg,#3d2a18,#2b1a0e)", padding:24, marginBottom:20, position:"relative" }}>
        <div className="nail" style={{ position:"absolute",top:8,left:8 }} />
        <div className="nail" style={{ position:"absolute",top:8,right:8 }} />
        <Field label="Enter your WhatsApp to find bookings">
          <div style={{ display:"flex",gap:10 }}>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="11987654321" maxLength={11} />
            <Btn onClick={()=>setSearched(true)} style={{ whiteSpace:"nowrap" }}>Search</Btn>
          </div>
        </Field>
      </div>

      {searched && myAppts.length===0 && (
        <div style={{ textAlign:"center", color:"var(--smoke)", padding:40, fontFamily:"'Special Elite',cursive" }}>
          No bookings found for this number, partner.
        </div>
      )}

      {myAppts.map(a => (
        <Card key={a.id} style={{ marginBottom:12, position:"relative" }}>
          <div className="nail" style={{ position:"absolute",top:8,right:8 }} />
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10 }}>
            <div>
              <div style={{ fontFamily:"'Rye',cursive", fontSize:16, color:"var(--cream)", marginBottom:4 }}>{a.service}</div>
              <div style={{ color:"var(--smoke)", fontSize:13 }}>📅 {a.date} at {a.time}</div>
              <div style={{ color:"var(--smoke)", fontSize:13 }}>🎵 {a.music} · 💳 {a.payment}</div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8 }}>
              <span className={`badge badge-${a.status==="confirmado"?"green":a.status==="cancelado"?"red":"amber"}`}>{a.status}</span>
              {a.status!=="cancelado"&&<Btn variant="danger" onClick={()=>cancel(a.id)} style={{ fontSize:11,padding:"5px 12px" }}>Cancel</Btn>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── BARBER DASHBOARD ────────────────────────────────────────────────────────
function BarberDashboard({ appointments }) {
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(a=>a.date===today);
  const confirmed  = appointments.filter(a=>a.status==="confirmado").length;
  const pending    = appointments.filter(a=>a.status==="aguardando").length;
  const revenue    = appointments.filter(a=>a.status!=="cancelado").reduce((s,a)=>s+(a.price||0),0);

  return (
    <div className="fade-up" style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
      <SectionTitle>The Ranch – Dashboard</SectionTitle>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
        {[
          { label:"Today's Riders",  value:todayAppts.length, sub:"appointments", color:"var(--amber)" },
          { label:"Confirmed",       value:confirmed,          sub:"total",        color:"#7dbb6a" },
          { label:"Waiting",         value:pending,            sub:"pending",      color:"#d4a44c" },
          { label:"Revenue",         value:`R$${revenue}`,     sub:"estimated",    color:"var(--amber)" },
        ].map(s=>(
          <Card key={s.label} style={{ textAlign:"center", position:"relative" }}>
            <div className="nail" style={{ position:"absolute",top:8,right:8 }} />
            <div style={{ color:"var(--smoke)", fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:8, fontFamily:"'Cabin Condensed',sans-serif", fontWeight:700 }}>{s.label}</div>
            <div style={{ fontFamily:"'Rye',cursive", fontSize:38, color:s.color, textShadow:"1px 1px 0 rgba(0,0,0,.4)" }}>{s.value}</div>
            <div style={{ color:"var(--smoke)", fontSize:12 }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      <h3 style={{ fontFamily:"'Rye',cursive", fontSize:20, color:"var(--amber)", letterSpacing:2, marginBottom:16 }}>Today's Schedule</h3>
      {todayAppts.length===0
        ? <Card><div style={{ textAlign:"center",color:"var(--smoke)",padding:20,fontFamily:"'Special Elite',cursive" }}>No riders booked for today.</div></Card>
        : todayAppts.map(a=>(
          <Card key={a.id} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
              <div style={{ display:"flex",gap:16,alignItems:"center" }}>
                <div style={{ fontFamily:"'Rye',cursive", fontSize:22, color:"var(--amber)", minWidth:52 }}>{a.time}</div>
                <div>
                  <div style={{ fontFamily:"'Cabin Condensed',sans-serif", fontWeight:700, fontSize:15 }}>{a.client}</div>
                  <div style={{ color:"var(--smoke)", fontSize:13 }}>{a.service} · {a.music} · {a.payment}</div>
                </div>
              </div>
              <span className={`badge badge-${a.status==="confirmado"?"green":a.status==="cancelado"?"red":"amber"}`}>{a.status}</span>
            </div>
          </Card>
      ))}
    </div>
  );
}

// ── AGENDA ─────────────────────────────────────────────────────────────────
function BarberAgenda({ appointments, setAppointments }) {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAdd, setShowAdd]   = useState(false);
  const [newA, setNewA]         = useState({ client:"",phone:"",service:"",date:"",time:"",payment:"pix",music:"",price:"" });

  const filtered = appointments.filter(a=>!filterDate||a.date===filterDate).sort((a,b)=>a.time.localeCompare(b.time));
  const setN = (k,v) => setNewA(f=>({...f,[k]:v}));
  const updateStatus = (id,status) => setAppointments(prev=>prev.map(a=>a.id===id?{...a,status}:a));

  const addAppt = () => {
    setAppointments(prev=>[...prev,{ id:Date.now(),...newA,status:"confirmado",price:Number(newA.price) }]);
    setShowAdd(false);
    setNewA({ client:"",phone:"",service:"",date:"",time:"",payment:"pix",music:"",price:"" });
  };

  return (
    <div className="fade-up" style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:16 }}>
        <SectionTitle>Booking Ledger</SectionTitle>
        <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
          <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{ width:170 }} />
          <Btn onClick={()=>setShowAdd(true)}>+ New Booking</Btn>
        </div>
      </div>

      {filtered.length===0
        ? <Card><div style={{ textAlign:"center",color:"var(--smoke)",padding:30,fontFamily:"'Special Elite',cursive" }}>No riders on this day.</div></Card>
        : filtered.map(a=>(
          <Card key={a.id} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
              <div style={{ display:"flex",gap:14,alignItems:"center" }}>
                <div style={{ fontFamily:"'Rye',cursive", fontSize:22, color:"var(--amber)", minWidth:56 }}>{a.time}</div>
                <div>
                  <div style={{ fontFamily:"'Cabin Condensed',sans-serif", fontWeight:700, fontSize:15 }}>{a.client}</div>
                  <div style={{ color:"var(--smoke)", fontSize:13 }}>📱 {a.phone} · {a.service}</div>
                  <div style={{ color:"var(--smoke)", fontSize:13 }}>🎵 {a.music} · 💳 {a.payment} · <span style={{ color:"var(--amber)" }}>R$ {a.price}</span></div>
                </div>
              </div>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap",alignItems:"center" }}>
                <span className={`badge badge-${a.status==="confirmado"?"green":a.status==="cancelado"?"red":"amber"}`}>{a.status}</span>
                {a.status!=="cancelado"&&<Btn variant="green" onClick={()=>updateStatus(a.id,"confirmado")} style={{ fontSize:11,padding:"5px 12px" }}>✓ Confirm</Btn>}
                {a.status!=="cancelado"&&<Btn variant="danger" onClick={()=>updateStatus(a.id,"cancelado")} style={{ fontSize:11,padding:"5px 12px" }}>✗ Cancel</Btn>}
              </div>
            </div>
          </Card>
        ))
      }

      {showAdd && (
        <Modal title="NEW BOOKING" onClose={()=>setShowAdd(false)}>
          <Field label="Client Name"><input value={newA.client} onChange={e=>setN("client",e.target.value)} /></Field>
          <Field label="WhatsApp"><input value={newA.phone} onChange={e=>setN("phone",e.target.value)} /></Field>
          <Field label="Service">
            <select value={newA.service} onChange={e=>setN("service",e.target.value)}>
              <option value="">Select...</option>
              {SERVICES.map(s=><option key={s.id} value={s.name}>{s.name} – R$ {s.price}</option>)}
            </select>
          </Field>
          <Field label="Date"><input type="date" value={newA.date} onChange={e=>setN("date",e.target.value)} /></Field>
          <Field label="Time"><input type="time" value={newA.time} onChange={e=>setN("time",e.target.value)} /></Field>
          <Field label="Payment">
            <select value={newA.payment} onChange={e=>setN("payment",e.target.value)}>
              {["pix","cartão","dinheiro","link"].map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Music">
            <select value={newA.music} onChange={e=>setN("music",e.target.value)}>
              <option value="">Select...</option>
              {MUSIC_GENRES.map(g=><option key={g.id} value={g.name}>{g.name}</option>)}
            </select>
          </Field>
          <Field label="Price (R$)"><input type="number" value={newA.price} onChange={e=>setN("price",e.target.value)} /></Field>
          <div style={{ display:"flex",gap:10,marginTop:4 }}>
            <Btn onClick={addAppt} disabled={!newA.client||!newA.service||!newA.date||!newA.time}>Save</Btn>
            <Btn variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── CLIENTS ────────────────────────────────────────────────────────────────
function Clients({ clients, setClients }) {
  const [search, setSearch]     = useState("");
  const [showAdd, setShowAdd]   = useState(false);
  const [newC, setNewC]         = useState({ name:"",phone:"",favoriteService:"" });

  const filtered = clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search));

  const sendWhatsApp = (phone,name) => {
    const msg = encodeURIComponent(`Howdy ${name}! 🤠 Time for a fresh cut at Red Barn Barber Shop? Book your seat online or reply here! ✂️`);
    window.open(`https://wa.me/55${phone}?text=${msg}`,"_blank");
  };

  const addClient = () => {
    setClients(prev=>[...prev,{ id:Date.now(),...newC,visits:0,lastVisit:"-" }]);
    setShowAdd(false);
    setNewC({ name:"",phone:"",favoriteService:"" });
  };

  return (
    <div className="fade-up" style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:16 }}>
        <SectionTitle>The Regulars</SectionTitle>
        <div style={{ display:"flex",gap:10 }}>
          <input placeholder="🔍 Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:200 }} />
          <Btn onClick={()=>setShowAdd(true)}>+ Register</Btn>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {filtered.map(c=>(
          <Card key={c.id} style={{ position:"relative" }}>
            <div className="nail" style={{ position:"absolute",top:8,right:8 }} />
            <div style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:14 }}>
              <div style={{ width:46,height:46,borderRadius:"50%",
                background:"linear-gradient(135deg,var(--leather),var(--wood-dark))",
                border:"2px solid var(--amber)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"'Rye',cursive",fontSize:18,color:"var(--amber)",flexShrink:0 }}>
                {c.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily:"'Cabin Condensed',sans-serif",fontWeight:700,fontSize:15 }}>{c.name}</div>
                <div style={{ color:"var(--smoke)",fontSize:13 }}>📱 {c.phone}</div>
                <div style={{ color:"var(--smoke)",fontSize:12 }}>✂️ {c.favoriteService}</div>
              </div>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:"1px solid var(--leather)" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:10,color:"var(--smoke)",fontFamily:"'Cabin Condensed',sans-serif",letterSpacing:1 }}>VISITS</div>
                <div style={{ fontFamily:"'Rye',cursive",fontSize:24,color:"var(--amber)" }}>{c.visits}</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:10,color:"var(--smoke)",fontFamily:"'Cabin Condensed',sans-serif",letterSpacing:1 }}>LAST VISIT</div>
                <div style={{ fontSize:12,color:"var(--cream)" }}>{c.lastVisit}</div>
              </div>
              <Btn variant="green" onClick={()=>sendWhatsApp(c.phone,c.name)} style={{ fontSize:11,padding:"6px 12px" }}>💬 WhatsApp</Btn>
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Modal title="REGISTER CLIENT" onClose={()=>setShowAdd(false)}>
          <Field label="Name"><input value={newC.name} onChange={e=>setNewC(f=>({...f,name:e.target.value}))} /></Field>
          <Field label="WhatsApp"><input value={newC.phone} onChange={e=>setNewC(f=>({...f,phone:e.target.value}))} /></Field>
          <Field label="Favorite Service">
            <select value={newC.favoriteService} onChange={e=>setNewC(f=>({...f,favoriteService:e.target.value}))}>
              <option value="">Select...</option>
              {SERVICES.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </Field>
          <div style={{ display:"flex",gap:10 }}>
            <Btn onClick={addClient} disabled={!newC.name||!newC.phone}>Save</Btn>
            <Btn variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── SERVICES ───────────────────────────────────────────────────────────────
function ServicesManager() {
  const [services, setServices] = useState(SERVICES);
  const [editing, setEditing]   = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [newSvc, setNewSvc]     = useState({ name:"",duration:"",price:"",icon:"✂️" });

  const save = () => { setServices(prev=>prev.map(s=>s.id===editing.id?editing:s)); setEditing(null); };
  const addSvc = () => {
    setServices(prev=>[...prev,{ id:Date.now(),...newSvc,duration:Number(newSvc.duration),price:Number(newSvc.price) }]);
    setShowAdd(false);
    setNewSvc({ name:"",duration:"",price:"",icon:"✂️" });
  };

  return (
    <div className="fade-up" style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12 }}>
        <SectionTitle>Services Menu</SectionTitle>
        <Btn onClick={()=>setShowAdd(true)}>+ Add Service</Btn>
      </div>

      {services.map(s=>(
        <Card key={s.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
            {editing?.id===s.id ? (
              <div style={{ display:"flex",gap:10,flex:1,flexWrap:"wrap",alignItems:"center" }}>
                <input value={editing.name} onChange={e=>setEditing(f=>({...f,name:e.target.value}))} style={{ flex:2,minWidth:130 }} />
                <input type="number" value={editing.duration} onChange={e=>setEditing(f=>({...f,duration:Number(e.target.value)}))} placeholder="min" style={{ width:80 }} />
                <input type="number" value={editing.price} onChange={e=>setEditing(f=>({...f,price:Number(e.target.value)}))} placeholder="R$" style={{ width:90 }} />
                <Btn onClick={save}>Save</Btn>
                <Btn variant="ghost" onClick={()=>setEditing(null)}>Cancel</Btn>
              </div>
            ):(
              <>
                <div style={{ display:"flex",gap:14,alignItems:"center" }}>
                  <span style={{ fontSize:28 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily:"'Rye',cursive",fontSize:16,color:"var(--cream)" }}>{s.name}</div>
                    <div style={{ color:"var(--smoke)",fontSize:12,fontFamily:"'Cabin Condensed',sans-serif",letterSpacing:1 }}>⏱ {s.duration} MIN</div>
                  </div>
                </div>
                <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                  <div style={{ fontFamily:"'Rye',cursive",fontSize:24,color:"var(--amber)" }}>R$ {s.price}</div>
                  <Btn variant="dark" onClick={()=>setEditing(s)} style={{ fontSize:11,padding:"5px 12px" }}>✏️ Edit</Btn>
                  <Btn variant="danger" onClick={()=>setServices(prev=>prev.filter(x=>x.id!==s.id))} style={{ fontSize:11,padding:"5px 12px" }}>🗑</Btn>
                </div>
              </>
            )}
          </div>
        </Card>
      ))}

      {showAdd && (
        <Modal title="NEW SERVICE" onClose={()=>setShowAdd(false)}>
          <Field label="Name"><input value={newSvc.name} onChange={e=>setNewSvc(f=>({...f,name:e.target.value}))} /></Field>
          <Field label="Duration (min)"><input type="number" value={newSvc.duration} onChange={e=>setNewSvc(f=>({...f,duration:e.target.value}))} /></Field>
          <Field label="Price (R$)"><input type="number" value={newSvc.price} onChange={e=>setNewSvc(f=>({...f,price:e.target.value}))} /></Field>
          <Field label="Emoji Icon"><input value={newSvc.icon} onChange={e=>setNewSvc(f=>({...f,icon:e.target.value}))} placeholder="✂️" /></Field>
          <div style={{ display:"flex",gap:10 }}>
            <Btn onClick={addSvc} disabled={!newSvc.name||!newSvc.duration||!newSvc.price}>Save</Btn>
            <Btn variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── SETTINGS ───────────────────────────────────────────────────────────────
function Settings() {
  const [botOn, setBotOn]         = useState(false);
  const [token, setToken]         = useState("");
  const [payLink, setPayLink]     = useState("");
  const [saved, setSaved]         = useState(false);
  const [newEmail, setNewEmail]   = useState("");
  const [newPass, setNewPass]     = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [credMsg, setCredMsg]     = useState(null);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const saveCreds = () => {
    if (newPass.length < 6) { setCredMsg({ ok:false, text:"Password must be at least 6 characters." }); return; }
    if (newPass !== confirmPass) { setCredMsg({ ok:false, text:"Passwords don't match, partner!" }); return; }
    try { localStorage.setItem("rb_barber", JSON.stringify({ email: newEmail.trim().toLowerCase(), password: newPass })); } catch {}
    setCredMsg({ ok:true, text:"Credentials updated! Use them next time you log in." });
    setNewEmail(""); setNewPass(""); setConfirmPass("");
    setTimeout(()=>setCredMsg(null),4000);
  };

  return (
    <div className="fade-up" style={{ maxWidth:720, margin:"0 auto", padding:"32px 24px" }}>
      <SectionTitle>Homestead Settings</SectionTitle>

      {/* WhatsApp */}
      <Card style={{ marginBottom:16, position:"relative" }}>
        <div className="nail" style={{ position:"absolute",top:8,left:8 }} />
        <div className="nail" style={{ position:"absolute",top:8,right:8 }} />
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:"'Rye',cursive",fontSize:17,color:"#25d366",letterSpacing:1 }}>💬 WhatsApp Bot</div>
            <div style={{ color:"var(--smoke)",fontSize:13,marginTop:2 }}>Auto-confirmation & reminder messages</div>
          </div>
          <button onClick={()=>setBotOn(!botOn)} style={{
            width:54,height:28,borderRadius:14,border:"none",
            background:botOn?"#25d366":"var(--iron)",position:"relative",transition:"background .3s",cursor:"pointer",
          }}>
            <span style={{
              position:"absolute",top:3,left:botOn?28:3,
              width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .3s",
            }} />
          </button>
        </div>
        <Field label="API Token (Z-API / Evolution API / Twilio)">
          <input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Paste your integration token here" />
        </Field>
        <div style={{ background:"rgba(37,211,102,.07)",border:"1px solid rgba(37,211,102,.2)",borderRadius:6,padding:14,marginTop:8 }}>
          <div style={{ fontSize:13,color:"#25d366",fontFamily:"'Cabin Condensed',sans-serif",fontWeight:700,marginBottom:6,letterSpacing:1 }}>
            📋 HOW TO CONNECT YOUR BOT
          </div>
          <div style={{ fontSize:12,color:"var(--smoke)",lineHeight:1.9,fontFamily:"'Special Elite',cursive" }}>
            1. Create account at <strong style={{color:"var(--cream)"}}>Z-API.io</strong> or <strong style={{color:"var(--cream)"}}>Evolution API</strong><br/>
            2. Scan the QR Code to link your WhatsApp number<br/>
            3. Copy your integration token and paste above<br/>
            4. Toggle the bot ON and save — done, partner! 🤠
          </div>
        </div>
      </Card>

      {/* Payments */}
      <Card style={{ marginBottom:16,position:"relative" }}>
        <div className="nail" style={{ position:"absolute",top:8,left:8 }} />
        <div className="nail" style={{ position:"absolute",top:8,right:8 }} />
        <div style={{ fontFamily:"'Rye',cursive",fontSize:17,color:"var(--amber)",letterSpacing:1,marginBottom:12 }}>💰 Payment Link</div>
        <Field label="Mercado Pago / PagSeguro / Stripe URL">
          <input value={payLink} onChange={e=>setPayLink(e.target.value)} placeholder="https://mpago.la/your-link" />
        </Field>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10 }}>
          {[["🏦","Pix"],["💳","Credit"],["🪙","Debit"],["💵","Cash"]].map(([icon,label])=>(
            <div key={label} style={{ background:"rgba(43,26,14,.8)",border:"1px solid var(--leather)",borderRadius:6,padding:"10px",textAlign:"center",fontSize:12,color:"var(--smoke)" }}>
              <div style={{ fontSize:20,marginBottom:4 }}>{icon}</div>{label}
            </div>
          ))}
        </div>
      </Card>

      {/* Credentials */}
      <Card style={{ marginBottom:16,position:"relative" }}>
        <div className="nail" style={{ position:"absolute",top:8,left:8 }} />
        <div className="nail" style={{ position:"absolute",top:8,right:8 }} />
        <div style={{ fontFamily:"'Rye',cursive",fontSize:17,color:"var(--amber)",letterSpacing:1,marginBottom:4 }}>🔐 Login Credentials</div>
        <div style={{ color:"var(--smoke)",fontSize:12,marginBottom:14,fontFamily:"'Special Elite',cursive" }}>Change your barber login e-mail and password</div>
        <Field label="New E-mail"><input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="seu@email.com" /></Field>
        <Field label="New Password"><input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Min. 6 characters" /></Field>
        <Field label="Confirm Password"><input type="password" value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} placeholder="Repeat password" /></Field>
        {credMsg && (
          <div style={{
            padding:"10px 14px", borderRadius:4, marginBottom:12, fontSize:13,
            background: credMsg.ok ? "rgba(74,92,64,.3)" : "rgba(139,32,32,.2)",
            border: `1px solid ${credMsg.ok ? "#3a5c30" : "var(--red-barn)"}`,
            color: credMsg.ok ? "#7dbb6a" : "#c97a7a",
            fontFamily:"'Special Elite',cursive",
          }}>{credMsg.text}</div>
        )}
        <Btn variant="ghost" onClick={saveCreds} disabled={!newEmail||!newPass} style={{ fontSize:12 }}>
          🔑 Update Credentials
        </Btn>
      </Card>

      {/* Shop Info */}
      <Card style={{ marginBottom:24,position:"relative" }}>
        <div className="nail" style={{ position:"absolute",top:8,left:8 }} />
        <div className="nail" style={{ position:"absolute",top:8,right:8 }} />
        <div style={{ fontFamily:"'Rye',cursive",fontSize:17,color:"var(--amber)",letterSpacing:1,marginBottom:12 }}>📍 Shop Info</div>
        <Field label="Shop Name"><input defaultValue="Red Barn Barber Shop" /></Field>
        <Field label="Address"><input defaultValue="Rua das Acácias, 342 – Centro, São Paulo – SP" /></Field>
        <Field label="WhatsApp"><input defaultValue="11987654321" /></Field>
        <Field label="Business Hours"><input defaultValue="Mon–Fri 9am–8pm · Sat 8am–6pm" /></Field>
      </Card>

      <Btn onClick={save} style={{ width:"100%",padding:"14px",fontSize:15,justifyContent:"center" }}>
        {saved ? "🤠 Saved, Partner!" : "💾 Save Settings"}
      </Btn>
    </div>
  );
}


// ── WEEKLY GALLERY ─────────────────────────────────────────────────────────
const GALLERY_STORAGE_KEY = "rb_weekly_photos";

function useGallery() {
  const [photos, setPhotos] = useState(() => {
    try {
      const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const now = Date.now();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      return parsed.filter(p => now - p.uploadedAt < SEVEN_DAYS);
    } catch { return []; }
  });

  const savePhotos = (list) => {
    setPhotos(list);
    try { localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(list)); } catch {}
  };

  // Purge photos older than 7 days on mount
  useEffect(() => {
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const fresh = photos.filter(p => now - p.uploadedAt < SEVEN_DAYS);
    if (fresh.length !== photos.length) savePhotos(fresh);
  }, []);

  const addPhoto = (dataUrl, caption) => {
    const newPhoto = { id: Date.now(), dataUrl, caption, uploadedAt: Date.now() };
    savePhotos([...photos, newPhoto]);
  };

  const removePhoto = (id) => savePhotos(photos.filter(p => p.id !== id));

  return { photos, addPhoto, removePhoto };
}

function daysLeft(uploadedAt) {
  const diff = 7 * 24 * 60 * 60 * 1000 - (Date.now() - uploadedAt);
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

// Public gallery (client-facing section in home)
function PublicGallery({ photos }) {
  const [lightbox, setLightbox] = useState(null);
  if (photos.length === 0) return null;

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px 52px" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <SectionTitle>This Week's Work</SectionTitle>
        <div className="star-divider" />
      </div>
      <div style={{ columns:"3 220px", gap:14 }}>
        {photos.map((p, i) => (
          <div
            key={p.id}
            onClick={() => setLightbox(p)}
            className="fade-up"
            style={{
              breakInside:"avoid", marginBottom:14, cursor:"zoom-in",
              border:"3px solid var(--leather)",
              boxShadow:"0 4px 16px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.04)",
              borderRadius:4, overflow:"hidden", position:"relative",
              animationDelay:`${i*0.07}s`,
              transition:"transform .2s, box-shadow .2s",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.02)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.7)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.5)"; }}
          >
            <img src={p.dataUrl} alt={p.caption} style={{ width:"100%", display:"block", objectFit:"cover" }} />
            {p.caption && (
              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                background:"linear-gradient(transparent, rgba(10,6,2,.9))",
                padding:"20px 10px 8px",
                fontFamily:"'Special Elite',cursive", fontSize:12, color:"var(--cream)",
                letterSpacing:.5,
              }}>{p.caption}</div>
            )}
            {/* Nail decoration */}
            <div className="nail" style={{ position:"absolute", top:6, left:6 }} />
            <div className="nail" style={{ position:"absolute", top:6, right:6 }} />
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,.92)", zIndex:2000,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20,
          }}
        >
          <img src={lightbox.dataUrl} alt={lightbox.caption} style={{ maxWidth:"90vw", maxHeight:"80vh", objectFit:"contain", borderRadius:4, border:"3px solid var(--leather)" }} />
          {lightbox.caption && <div style={{ color:"var(--cream)", marginTop:14, fontFamily:"'Special Elite',cursive", fontSize:15 }}>{lightbox.caption}</div>}
          <div style={{ color:"var(--smoke)", marginTop:8, fontSize:12 }}>Click anywhere to close</div>
        </div>
      )}
    </div>
  );
}

// Barber gallery manager
function GalleryManager({ photos, addPhoto, removePhoto }) {
  const [dragging, setDragging] = useState(false);
  const [caption, setCaption]   = useState("");
  const [preview, setPreview]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useState(null);

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => setPreview({ dataUrl: e.target.result, name: file.name });
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    readFile(file);
  };

  const handleFile = (e) => readFile(e.target.files[0]);

  const confirmUpload = () => {
    if (!preview) return;
    setUploading(true);
    setTimeout(() => {
      addPhoto(preview.dataUrl, caption.trim());
      setPreview(null); setCaption(""); setUploading(false);
    }, 400);
  };

  return (
    <div className="fade-up" style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
      <SectionTitle>Weekly Photo Board</SectionTitle>
      <div style={{ color:"var(--smoke)", fontSize:13, marginBottom:24, fontFamily:"'Special Elite',cursive" }}>
        Photos are automatically removed after <strong style={{color:"var(--amber)"}}>7 days</strong>. They appear publicly on the client home page.
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e=>{ e.preventDefault(); setDragging(true); }}
        onDragLeave={()=>setDragging(false)}
        onDrop={handleDrop}
        style={{
          border:`2px dashed ${dragging?"var(--amber)":"var(--leather)"}`,
          borderRadius:8, padding:"36px 24px", textAlign:"center", marginBottom:24,
          background: dragging ? "rgba(212,136,42,.07)" : "rgba(43,26,14,.5)",
          transition:"all .2s", cursor:"pointer",
        }}
        onClick={() => document.getElementById("gallery-file-input").click()}
      >
        <div style={{ fontSize:40, marginBottom:10 }}>📸</div>
        <div style={{ fontFamily:"'Rye',cursive", color:"var(--tan)", fontSize:16, marginBottom:4 }}>
          {dragging ? "Drop it like it's hot!" : "Drag & drop a photo here"}
        </div>
        <div style={{ color:"var(--smoke)", fontSize:13 }}>or click to browse your files</div>
        <input id="gallery-file-input" type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
      </div>

      {/* Preview before saving */}
      {preview && (
        <div className="wanted-border" style={{ background:"linear-gradient(160deg,#3d2a18,#2b1a0e)", padding:20, marginBottom:24, position:"relative" }}>
          <div className="nail" style={{ position:"absolute",top:8,left:8 }} />
          <div className="nail" style={{ position:"absolute",top:8,right:8 }} />
          <div style={{ fontFamily:"'Rye',cursive", color:"var(--amber)", fontSize:16, marginBottom:12 }}>📌 Preview</div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"flex-start" }}>
            <img src={preview.dataUrl} alt="preview" style={{ width:180, height:180, objectFit:"cover", borderRadius:4, border:"2px solid var(--leather)", flexShrink:0 }} />
            <div style={{ flex:1, minWidth:200 }}>
              <Field label="Caption (optional)">
                <input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="e.g. Classic taper fade..." maxLength={80} />
              </Field>
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <Btn onClick={confirmUpload} disabled={uploading}>
                  {uploading ? "Pinning..." : "📌 Pin to Board"}
                </Btn>
                <Btn variant="danger" onClick={()=>{ setPreview(null); setCaption(""); }}>Discard</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current photos grid */}
      {photos.length === 0 ? (
        <Card>
          <div style={{ textAlign:"center", color:"var(--smoke)", padding:30, fontFamily:"'Special Elite',cursive" }}>
            No photos pinned yet. Upload your first cut above! 📸
          </div>
        </Card>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
          {photos.map(p => {
            const remaining = daysLeft(p.uploadedAt);
            const urgent = remaining <= 1;
            return (
              <div key={p.id} style={{ position:"relative", border:`2px solid ${urgent?"var(--red-barn)":"var(--leather)"}`, borderRadius:6, overflow:"hidden", background:"var(--wood-dark)" }}>
                <div className="nail" style={{ position:"absolute",top:6,left:6,zIndex:2 }} />
                <div className="nail" style={{ position:"absolute",top:6,right:6,zIndex:2 }} />
                <img src={p.dataUrl} alt={p.caption} style={{ width:"100%", height:180, objectFit:"cover", display:"block" }} />
                <div style={{ padding:"10px 12px" }}>
                  {p.caption && <div style={{ fontFamily:"'Special Elite',cursive", fontSize:13, color:"var(--cream)", marginBottom:6 }}>{p.caption}</div>}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span className={`badge ${urgent?"badge-red":"badge-amber"}`}>
                      {remaining === 0 ? "Expiring today" : `${remaining}d left`}
                    </span>
                    <button onClick={()=>removePhoto(p.id)} style={{
                      background:"none", border:"1px solid var(--red-barn)", borderRadius:4,
                      color:"#c97a7a", fontSize:11, padding:"3px 8px", fontFamily:"'Cabin Condensed',sans-serif",
                    }}>🗑 Remove</button>
                  </div>
                  <div style={{ marginTop:6, height:3, borderRadius:2, background:"var(--iron)", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(remaining/7)*100}%`, background: urgent ? "var(--red-barn)" : "var(--amber)", transition:"width .3s" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]               = useState("home");
  const [isBarber, setIsBarber]       = useState(false);
  const [showLogin, setShowLogin]     = useState(false);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [clients, setClients]         = useState(INITIAL_CLIENTS);
  const { photos, addPhoto, removePhoto } = useGallery();

  const handleLogin = () => {
    setIsBarber(true);
    setShowLogin(false);
    setView("dashboard");
  };

  const handleLogout = () => {
    setIsBarber(false);
    setView("home");
  };

  if (showLogin && !isBarber) {
    return <BarberLogin onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight:"100vh" }}>
      <Header
        view={view}
        setView={setView}
        isBarber={isBarber}
        onLogout={handleLogout}
        onGoLogin={() => setShowLogin(true)}
      />
      <main>
        {!isBarber && view==="home"           && <ClientHome setView={setView} photos={photos} />}
        {!isBarber && view==="agendar"        && <Booking appointments={appointments} setAppointments={setAppointments} />}
        {!isBarber && view==="meus horários"  && <ClientAppointments appointments={appointments} setAppointments={setAppointments} />}
        {isBarber  && view==="dashboard"      && <BarberDashboard appointments={appointments} />}
        {isBarber  && view==="agenda"         && <BarberAgenda appointments={appointments} setAppointments={setAppointments} />}
        {isBarber  && view==="clientes"       && <Clients clients={clients} setClients={setClients} />}
        {isBarber  && view==="serviços"       && <ServicesManager />}
        {isBarber  && view==="galeria"        && <GalleryManager photos={photos} addPhoto={addPhoto} removePhoto={removePhoto} />}
        {isBarber  && view==="configurações"  && <Settings />}
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"3px solid var(--leather)", marginTop:40, padding:"24px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Rye',cursive", color:"var(--amber)", fontSize:14, letterSpacing:3, marginBottom:6 }}>RED BARN BARBER SHOP</div>
        <div style={{ color:"var(--smoke)", fontSize:12, fontFamily:"'Special Elite',cursive" }}>
          Rua das Acácias, 342 · Centro · São Paulo, SP · (11) 9 8765-4321
        </div>
        <div style={{ height:3, background:"repeating-linear-gradient(90deg, var(--amber) 0, var(--amber) 12px, var(--red-barn) 12px, var(--red-barn) 24px)", marginTop:16 }} />
      </footer>
    </div>
  );
}
