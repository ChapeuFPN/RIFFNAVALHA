import { useState, useEffect } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_BARBEIRO = {
  email: "barbeiro@riff.com",
  senha: "riff123",
  role: "barbeiro",
  nome: "Carlos Riff",
};

// ─── localStorage helpers ─────────────────────────────────────────────────────
const getClientes = () => {
  try {
    const saved = localStorage.getItem("riff_clientes");
    return saved ? JSON.parse(saved) : [
      { id: 1, nome: "João Silva", email: "joao@email.com", senha: "123456", celular: "11999990001", role: "cliente" },
      { id: 2, nome: "Pedro Alves", email: "pedro@email.com", senha: "123456", celular: "11999990002", role: "cliente" },
    ];
  } catch { return []; }
};

const saveClientes = (clientes) => {
  try { localStorage.setItem("riff_clientes", JSON.stringify(clientes)); } catch {}
};

const getUsuarioLogado = () => {
  try {
    const saved = localStorage.getItem("riff_usuario");
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

const saveUsuarioLogado = (usuario) => {
  try {
    if (usuario) localStorage.setItem("riff_usuario", JSON.stringify(usuario));
    else localStorage.removeItem("riff_usuario");
  } catch {}
};

const CORTES_INICIAIS = [
  { id: 1, nome: "Corte Clássico", valor: 35, tempo: 30, foto: null },
  { id: 2, nome: "Degradê", valor: 45, tempo: 40, foto: null },
  { id: 3, nome: "Navalhado", valor: 50, tempo: 45, foto: null },
  { id: 4, nome: "Social", valor: 40, tempo: 35, foto: null },
];

const MUSICAS_INICIAIS = [
  { id: 1, nome: "Rock" },
  { id: 2, nome: "Hip Hop" },
  { id: 3, nome: "Sertanejo" },
  { id: 4, nome: "MPB" },
  { id: 5, nome: "Eletrônico" },
];

const AGENDAMENTOS_INICIAIS = [
  {
    id: 1,
    clienteId: 1,
    clienteNome: "João Silva",
    corteId: 1,
    corteNome: "Corte Clássico",
    valor: 35,
    data: "2026-03-12",
    hora: "10:00",
    status: "confirmado",
  },
  {
    id: 2,
    clienteId: 2,
    clienteNome: "Pedro Alves",
    corteId: 2,
    corteNome: "Degradê",
    valor: 45,
    data: "2026-03-12",
    hora: "11:00",
    status: "pendente",
  },
];

const INFO_BARBEARIA_INICIAL = {
  nome: "RIFF NAVALHA",
  endereco: "Rua das Tesouras, 42 - Centro",
  cidade: "São Paulo - SP",
  telefone: "(11) 99999-0000",
  horario: "Seg-Sáb: 9h às 20h",
  descricao: "A barbearia que corta com alma. Tradição e estilo em cada navalha.",
  lat: -23.5505,
  lng: -46.6333,
};

const FOTOS_SEMANA_INICIAIS = [
  { id: 1, legenda: "Degradê perfeito!", data: new Date().toISOString(), likes: 12 },
  { id: 2, legenda: "Corte navalhado clássico", data: new Date(Date.now() - 2 * 86400000).toISOString(), likes: 8 },
];

// ─── Estilos base ─────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #f5f0e8;
    --warm: #e8dcc8;
    --brown: #8b6f47;
    --dark-brown: #4a3728;
    --charcoal: #2c2416;
    --rust: #c4622d;
    --gold: #c9a84c;
    --text: #2c2416;
    --white: #fefcf8;
  }

  body {
    font-family: 'Crimson Text', serif;
    background: var(--cream);
    color: var(--text);
    min-height: 100vh;
  }

  .app { min-height: 100vh; }

  /* ── Auth ── */
  .auth-bg {
    min-height: 100vh;
    background: var(--charcoal);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .auth-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 40px,
      rgba(201,168,76,0.04) 40px,
      rgba(201,168,76,0.04) 41px
    );
  }
  .auth-card {
    background: var(--white);
    border: 2px solid var(--gold);
    padding: 48px 40px;
    width: 100%;
    max-width: 420px;
    position: relative;
  }
  .auth-card::before {
    content: '';
    position: absolute;
    top: 6px; left: 6px; right: -6px; bottom: -6px;
    border: 1px solid var(--brown);
    pointer-events: none;
  }
  .auth-logo {
    text-align: center;
    margin-bottom: 32px;
  }
  .auth-logo h1 {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 900;
    color: var(--charcoal);
    letter-spacing: 4px;
  }
  .auth-logo span {
    display: block;
    font-size: 12px;
    letter-spacing: 6px;
    color: var(--gold);
    text-transform: uppercase;
    margin-top: 4px;
  }
  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 16px 0 28px;
    color: var(--brown);
    font-size: 13px;
    letter-spacing: 2px;
  }
  .auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--warm);
  }

  /* ── Forms ── */
  .field { margin-bottom: 18px; }
  .field label {
    display: block;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--brown);
    margin-bottom: 6px;
  }
  .field input, .field select, .field textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--warm);
    background: var(--cream);
    font-family: 'Crimson Text', serif;
    font-size: 16px;
    color: var(--charcoal);
    outline: none;
    transition: border-color 0.2s;
  }
  .field input:focus, .field select:focus, .field textarea:focus {
    border-color: var(--gold);
  }
  .field textarea { resize: vertical; min-height: 80px; }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    font-family: 'Crimson Text', serif;
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    font-weight: 600;
  }
  .btn-primary {
    background: var(--charcoal);
    color: var(--gold);
    width: 100%;
  }
  .btn-primary:hover { background: var(--dark-brown); }
  .btn-gold {
    background: var(--gold);
    color: var(--charcoal);
  }
  .btn-gold:hover { background: #b8973d; }
  .btn-outline {
    background: transparent;
    color: var(--charcoal);
    border: 1px solid var(--charcoal);
  }
  .btn-outline:hover { background: var(--warm); }
  .btn-danger {
    background: #c0392b;
    color: white;
  }
  .btn-sm { padding: 7px 14px; font-size: 12px; }

  .link-btn {
    background: none;
    border: none;
    color: var(--gold);
    cursor: pointer;
    font-family: 'Crimson Text', serif;
    font-size: 15px;
    text-decoration: underline;
  }

  /* ── Layout ── */
  .topbar {
    background: var(--charcoal);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 2px solid var(--gold);
  }
  .topbar-logo {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 900;
    color: var(--gold);
    letter-spacing: 3px;
  }
  .topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .topbar-user {
    color: var(--warm);
    font-size: 14px;
    letter-spacing: 1px;
  }
  .topbar-logout {
    background: none;
    border: 1px solid var(--gold);
    color: var(--gold);
    padding: 6px 14px;
    cursor: pointer;
    font-size: 12px;
    letter-spacing: 1px;
    font-family: 'Crimson Text', serif;
    transition: all 0.2s;
  }
  .topbar-logout:hover { background: var(--gold); color: var(--charcoal); }

  .nav-tabs {
    background: var(--white);
    border-bottom: 1px solid var(--warm);
    display: flex;
    overflow-x: auto;
    padding: 0 16px;
  }
  .nav-tab {
    padding: 14px 20px;
    cursor: pointer;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--brown);
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    background: none;
    border-left: none;
    border-right: none;
    border-top: none;
    font-family: 'Crimson Text', serif;
    transition: all 0.2s;
  }
  .nav-tab.active {
    color: var(--charcoal);
    border-bottom-color: var(--gold);
  }
  .nav-tab:hover { color: var(--charcoal); }

  .content { padding: 28px 24px; max-width: 960px; margin: 0 auto; }

  /* ── Cards ── */
  .card {
    background: var(--white);
    border: 1px solid var(--warm);
    padding: 24px;
    margin-bottom: 20px;
  }
  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--warm);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* ── Grid ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

  @media (max-width: 768px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }

    .auth-card { padding: 32px 20px; }
    .auth-logo h1 { font-size: 28px; }

    .topbar { padding: 0 14px; }
    .topbar-logo { font-size: 18px; }
    .topbar-user { display: none; }

    .nav-tabs { padding: 0 8px; }
    .nav-tab { padding: 12px 10px; font-size: 11px; letter-spacing: 1px; }

    .content { padding: 16px 12px; }

    .card { padding: 16px; }
    .card-title { font-size: 17px; flex-wrap: wrap; gap: 8px; }

    .stat-grid { grid-template-columns: 1fr 1fr; }
    .stat-num { font-size: 24px; }

    .agend-item { flex-direction: column; align-items: flex-start; }
    .cobranca-item { flex-direction: column; align-items: flex-start; }

    .horario-agend { grid-template-columns: repeat(3, 1fr); }

    .modal { padding: 20px 16px; }
    .modal-title { font-size: 18px; }

    .btn { font-size: 13px; padding: 10px 18px; }
    .btn-sm { padding: 6px 10px; font-size: 11px; }

    .corte-card img { height: 80px; }

    .foto-placeholder { height: 130px; }

    .mapa-placeholder { height: 160px; font-size: 13px; }

    .flex-gap { flex-wrap: wrap; }
    .musica-select-item { font-size: 13px; padding: 8px 14px; }
  }

  @media (max-width: 400px) {
    .horario-agend { grid-template-columns: repeat(2, 1fr); }
    .stat-grid { grid-template-columns: 1fr; }
    .nav-tab { padding: 10px 7px; font-size: 10px; }
  }

  /* ── Corte Card ── */
  .corte-card {
    background: var(--cream);
    border: 1px solid var(--warm);
    padding: 16px;
    position: relative;
  }
  .corte-card img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    margin-bottom: 10px;
    border: 1px solid var(--warm);
  }
  .corte-card-nome {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .corte-card-info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--brown);
    margin-bottom: 10px;
  }
  .corte-valor { color: var(--rust); font-weight: 600; font-size: 16px; }

  /* ── Agendamento ── */
  .agend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: var(--cream);
    border: 1px solid var(--warm);
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .agend-info { flex: 1; min-width: 200px; }
  .agend-nome { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; }
  .agend-detalhe { font-size: 14px; color: var(--brown); margin-top: 2px; }
  .badge {
    display: inline-block;
    padding: 3px 10px;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .badge-confirmado { background: #d4edda; color: #155724; }
  .badge-pendente { background: #fff3cd; color: #856404; }
  .badge-concluido { background: #cce5ff; color: #004085; }
  .badge-cancelado { background: #f8d7da; color: #721c24; }

  /* ── Música ── */
  .musica-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--cream);
    border: 1px solid var(--warm);
    margin-bottom: 8px;
  }
  .musica-nome { font-size: 16px; font-weight: 600; }

  /* ── Fotos Semana ── */
  .foto-card {
    background: var(--cream);
    border: 1px solid var(--warm);
    overflow: hidden;
  }
  .foto-placeholder {
    width: 100%;
    height: 160px;
    background: linear-gradient(135deg, var(--warm), var(--brown));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
  }
  .foto-info { padding: 12px; }
  .foto-legenda { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
  .foto-meta { font-size: 12px; color: var(--brown); margin-bottom: 10px; }
  .foto-actions { display: flex; align-items: center; gap: 10px; }
  .like-btn {
    background: none;
    border: 1px solid var(--warm);
    padding: 5px 12px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s;
    font-family: 'Crimson Text', serif;
  }
  .like-btn:hover, .like-btn.liked { background: var(--rust); color: white; border-color: var(--rust); }

  /* ── Mapa ── */
  .mapa-placeholder {
    width: 100%;
    height: 220px;
    background: linear-gradient(135deg, #e8e0d0, #c8b898);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--warm);
    font-size: 15px;
    color: var(--dark-brown);
    gap: 8px;
  }

  /* ── Cobranças ── */
  .cobranca-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: var(--cream);
    border: 1px solid var(--warm);
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .cobranca-valor { font-size: 20px; font-weight: 700; color: var(--rust); font-family: 'Playfair Display', serif; }

  /* ── Stats ── */
  .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  @media (max-width: 640px) { .stat-grid { grid-template-columns: 1fr 1fr; } }
  .stat-card {
    background: var(--charcoal);
    color: var(--white);
    padding: 20px;
    text-align: center;
  }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; color: var(--gold); }
  .stat-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--warm); margin-top: 4px; }

  /* ── Misc ── */
  .section-sep { height: 1px; background: var(--warm); margin: 20px 0; }
  .text-muted { color: var(--brown); font-size: 14px; }
  .mt-12 { margin-top: 12px; }
  .mt-16 { margin-top: 16px; }
  .gap-8 { gap: 8px; display: flex; }
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px;
  }
  .modal {
    background: var(--white);
    border: 2px solid var(--gold);
    padding: 32px;
    width: 100%; max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
  }
  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--charcoal);
  }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .flex-gap { display: flex; gap: 10px; flex-wrap: wrap; }
  .musica-select-item {
    padding: 10px 18px;
    border: 2px solid var(--warm);
    cursor: pointer;
    font-family: 'Crimson Text', serif;
    font-size: 15px;
    transition: all 0.2s;
    background: var(--cream);
  }
  .musica-select-item.selected { border-color: var(--gold); background: var(--gold); color: var(--charcoal); font-weight: 700; }
  .musica-select-item:hover { border-color: var(--gold); }
  .alert { padding: 12px 16px; font-size: 14px; margin-bottom: 16px; }
  .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  .horario-agend {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-top: 12px;
  }
  .horario-slot {
    padding: 8px;
    text-align: center;
    border: 1px solid var(--warm);
    cursor: pointer;
    font-size: 14px;
    background: var(--cream);
    transition: all 0.2s;
  }
  .horario-slot:hover, .horario-slot.selected { background: var(--gold); border-color: var(--gold); font-weight: 700; }
  .cliente-select-corte {
    border: 2px solid var(--warm);
    padding: 14px;
    cursor: pointer;
    margin-bottom: 10px;
    background: var(--cream);
    transition: all 0.2s;
  }
  .cliente-select-corte:hover, .cliente-select-corte.selected { border-color: var(--gold); background: var(--white); }
`;

// ─── Componentes Utilitários ───────────────────────────────────────────────────
function StyleSheet() {
  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}

function Alert({ type = "success", msg }) {
  if (!msg) return null;
  return <div className={`alert alert-${type}`}>{msg}</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <div className="modal-title">{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--brown)" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Telas de Autenticação ────────────────────────────────────────────────────
function Login({ onLogin, onCadastro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = () => {
    setErro("");
    if (email === MOCK_BARBEIRO.email && senha === MOCK_BARBEIRO.senha) {
      onLogin({ ...MOCK_BARBEIRO });
    } else {
      const clientes = getClientes();
      const c = clientes.find(c => c.email === email && c.senha === senha);
      if (c) onLogin({ ...c });
      else setErro("Email ou senha incorretos.");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>RIFF</h1>
          <span>✦ navalha ✦</span>
        </div>
        <Alert type="error" msg={erro} />
        <div className="field">
          <label>E-mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <button className="btn btn-primary" onClick={handleLogin}>Entrar</button>
        <div className="auth-divider">ou</div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 15, color: "var(--brown)" }}>Não tem conta? </span>
          <button className="link-btn" onClick={onCadastro}>Cadastre-se</button>
        </div>
        <div style={{ marginTop: 20, padding: 14, background: "var(--cream)", fontSize: 13, color: "var(--brown)" }}>
          <strong>Demo:</strong><br />
          Barbeiro: barbeiro@riff.com / riff123<br />
          Cliente: joao@email.com / 123456
        </div>
      </div>
    </div>
  );
}

function Cadastro({ onVoltar, onCadastrado }) {
  const [form, setForm] = useState({ nome: "", email: "", celular: "", senha: "", confirma: "" });
  const [erro, setErro] = useState("");

  const handleCadastro = () => {
    if (!form.nome || !form.email || !form.celular || !form.senha) { setErro("Preencha todos os campos."); return; }
    if (form.senha !== form.confirma) { setErro("As senhas não coincidem."); return; }
    const clientes = getClientes();
    if (clientes.find(c => c.email === form.email)) { setErro("Este email já está cadastrado."); return; }
    const novoCliente = { ...form, id: Date.now(), role: "cliente" };
    const novosClientes = [...clientes, novoCliente];
    saveClientes(novosClientes);
    onCadastrado(novoCliente);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>RIFF</h1>
          <span>✦ cadastro ✦</span>
        </div>
        <Alert type="error" msg={erro} />
        {["nome", "email", "celular", "senha", "confirma"].map(f => (
          <div className="field" key={f}>
            <label>{f === "confirma" ? "Confirmar Senha" : f.charAt(0).toUpperCase() + f.slice(1)}</label>
            <input
              type={f.includes("senha") || f === "confirma" ? "password" : f === "email" ? "email" : "text"}
              value={form[f]}
              onChange={e => setForm({ ...form, [f]: e.target.value })}
              placeholder={f === "celular" ? "(11) 99999-0000" : ""}
            />
          </div>
        ))}
        <button className="btn btn-primary" onClick={handleCadastro}>Criar Conta</button>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button className="link-btn" onClick={onVoltar}>← Voltar ao login</button>
        </div>
      </div>
    </div>
  );
}

// ─── BARBEIRO ─────────────────────────────────────────────────────────────────
function BarberDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("agenda");
  const [cortes, setCortes] = useState(CORTES_INICIAIS);
  const [musicas, setMusicas] = useState(MUSICAS_INICIAIS);
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_INICIAIS);
  const [infoBarbearia, setInfoBarbearia] = useState(INFO_BARBEARIA_INICIAL);
  const [fotosSemana, setFotosSemana] = useState(FOTOS_SEMANA_INICIAIS);

  const tabs = [
    { id: "agenda", label: "Agenda" },
    { id: "cortes", label: "Cortes" },
    { id: "musica", label: "Música" },
    { id: "fotos", label: "Cortes da Semana" },
    { id: "cobrancas", label: "Cobranças" },
    { id: "barbearia", label: "Barbearia" },
  ];

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-logo">RIFF ✦</div>
        <div className="topbar-right">
          <span className="topbar-user">✂ {user.nome}</span>
          <button className="topbar-logout" onClick={onLogout}>Sair</button>
        </div>
      </div>
      <div className="nav-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="content">
        {tab === "agenda" && <BarberAgenda agendamentos={agendamentos} setAgendamentos={setAgendamentos} />}
        {tab === "cortes" && <BarberCortes cortes={cortes} setCortes={setCortes} />}
        {tab === "musica" && <BarberMusica musicas={musicas} setMusicas={setMusicas} />}
        {tab === "fotos" && <BarberFotos fotosSemana={fotosSemana} setFotosSemana={setFotosSemana} />}
        {tab === "cobrancas" && <BarberCobracas agendamentos={agendamentos} />}
        {tab === "barbearia" && <BarberInfo info={infoBarbearia} setInfo={setInfoBarbearia} />}
      </div>
    </div>
  );
}

function BarberAgenda({ agendamentos, setAgendamentos }) {
  const hoje = agendamentos.filter(a => a.data === "2026-03-12");
  const pendentes = agendamentos.filter(a => a.status === "pendente");

  const updateStatus = (id, status) => {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-num">{agendamentos.length}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-num">{hoje.length}</div><div className="stat-label">Hoje</div></div>
        <div className="stat-card"><div className="stat-num">{pendentes.length}</div><div className="stat-label">Pendentes</div></div>
      </div>
      <div className="card">
        <div className="card-title">Agendamentos</div>
        {agendamentos.map(a => (
          <div className="agend-item" key={a.id}>
            <div className="agend-info">
              <div className="agend-nome">{a.clienteNome}</div>
              <div className="agend-detalhe">{a.corteNome} • R$ {a.valor} • {a.data} às {a.hora}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className={`badge badge-${a.status}`}>{a.status}</span>
              {a.status === "pendente" && (
                <>
                  <button className="btn btn-gold btn-sm" onClick={() => updateStatus(a.id, "confirmado")}>Confirmar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a.id, "cancelado")}>Cancelar</button>
                </>
              )}
              {a.status === "confirmado" && (
                <button className="btn btn-outline btn-sm" onClick={() => updateStatus(a.id, "concluido")}>Concluir</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function BarberCortes({ cortes, setCortes }) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", valor: "", tempo: "", foto: null });

  const abrirNovo = () => { setEditando(null); setForm({ nome: "", valor: "", tempo: "", foto: null }); setModal(true); };
  const abrirEdit = (c) => { setEditando(c.id); setForm({ nome: c.nome, valor: c.valor, tempo: c.tempo, foto: c.foto }); setModal(true); };

  const salvar = () => {
    if (!form.nome || !form.valor || !form.tempo) return;
    if (editando) {
      setCortes(prev => prev.map(c => c.id === editando ? { ...c, ...form, valor: +form.valor, tempo: +form.tempo } : c));
    } else {
      setCortes(prev => [...prev, { id: Date.now(), ...form, valor: +form.valor, tempo: +form.tempo }]);
    }
    setModal(false);
  };

  const remover = (id) => setCortes(prev => prev.filter(c => c.id !== id));

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, foto: ev.target.result }));
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="card">
        <div className="card-title">
          Cortes & Serviços
          <button className="btn btn-gold btn-sm" onClick={abrirNovo}>+ Novo Corte</button>
        </div>
        <div className="grid-3">
          {cortes.map(c => (
            <div className="corte-card" key={c.id}>
              {c.foto ? <img src={c.foto} alt={c.nome} /> : (
                <div style={{ width: "100%", height: 100, background: "var(--warm)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 28 }}>✂</div>
              )}
              <div className="corte-card-nome">{c.nome}</div>
              <div className="corte-card-info">
                <span>⏱ {c.tempo}min</span>
                <span className="corte-valor">R$ {c.valor}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => abrirEdit(c)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => remover(c.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modal && (
        <Modal title={editando ? "Editar Corte" : "Novo Corte"} onClose={() => setModal(false)}>
          {["nome"].map(f => (
            <div className="field" key={f}>
              <label>{f.charAt(0).toUpperCase() + f.slice(1)} do Corte</label>
              <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
            </div>
          ))}
          <div className="grid-2">
            <div className="field">
              <label>Valor (R$)</label>
              <input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
            </div>
            <div className="field">
              <label>Tempo (min)</label>
              <input type="number" value={form.tempo} onChange={e => setForm({ ...form, tempo: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Foto do Corte (pequena)</label>
            <input type="file" accept="image/*" onChange={handleFoto} />
            {form.foto && <img src={form.foto} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8, border: "1px solid var(--warm)" }} />}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={salvar}>Salvar</button>
            <button className="btn btn-outline" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </Modal>
      )}
    </>
  );
}

function BarberMusica({ musicas, setMusicas }) {
  const [novaMusica, setNovaMusica] = useState("");

  const adicionar = () => {
    if (!novaMusica.trim()) return;
    setMusicas(prev => [...prev, { id: Date.now(), nome: novaMusica.trim() }]);
    setNovaMusica("");
  };

  const remover = (id) => setMusicas(prev => prev.filter(m => m.id !== id));

  return (
    <div className="card">
      <div className="card-title">Estilos Musicais</div>
      <p className="text-muted" style={{ marginBottom: 16 }}>O cliente poderá escolher o estilo que deseja ouvir durante o corte.</p>
      {musicas.map(m => (
        <div className="musica-item" key={m.id}>
          <span className="musica-nome">🎵 {m.nome}</span>
          <button className="btn btn-danger btn-sm" onClick={() => remover(m.id)}>Remover</button>
        </div>
      ))}
      <div className="section-sep" />
      <div style={{ display: "flex", gap: 10 }}>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}>
          <input value={novaMusica} onChange={e => setNovaMusica(e.target.value)} placeholder="Ex: Jazz, Funk, Gospel..." onKeyDown={e => e.key === "Enter" && adicionar()} />
        </div>
        <button className="btn btn-gold" onClick={adicionar}>+ Adicionar</button>
      </div>
    </div>
  );
}

function BarberFotos({ fotosSemana, setFotosSemana }) {
  const [modal, setModal] = useState(false);
  const [legenda, setLegenda] = useState("");
  const [fotoData, setFotoData] = useState(null);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setFotoData(ev.target.result);
    reader.readAsDataURL(file);
  };

  const postar = () => {
    setFotosSemana(prev => [...prev, {
      id: Date.now(),
      legenda,
      fotoData,
      data: new Date().toISOString(),
      likes: 0,
    }]);
    setModal(false);
    setLegenda("");
    setFotoData(null);
  };

  const remover = (id) => setFotosSemana(prev => prev.filter(f => f.id !== id));

  const diasRestantes = (dataStr) => {
    const diff = 7 - Math.floor((Date.now() - new Date(dataStr)) / 86400000);
    return Math.max(0, diff);
  };

  return (
    <>
      <div className="card">
        <div className="card-title">
          Cortes da Semana
          <button className="btn btn-gold btn-sm" onClick={() => setModal(true)}>+ Postar Foto</button>
        </div>
        <p className="text-muted" style={{ marginBottom: 16 }}>As fotos são removidas automaticamente após 7 dias.</p>
        <div className="grid-3">
          {fotosSemana.map(f => (
            <div className="foto-card" key={f.id}>
              {f.fotoData ? <img src={f.fotoData} alt={f.legenda} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                : <div className="foto-placeholder">✂</div>}
              <div className="foto-info">
                <div className="foto-legenda">{f.legenda}</div>
                <div className="foto-meta">❤ {f.likes} curtidas • {diasRestantes(f.data)} dias restantes</div>
                <button className="btn btn-danger btn-sm" onClick={() => remover(f.id)}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modal && (
        <Modal title="Nova Foto" onClose={() => setModal(false)}>
          <div className="field">
            <label>Foto</label>
            <input type="file" accept="image/*" onChange={handleFoto} />
            {fotoData && <img src={fotoData} alt="preview" style={{ width: "100%", height: 140, objectFit: "cover", marginTop: 8 }} />}
          </div>
          <div className="field">
            <label>Legenda</label>
            <input value={legenda} onChange={e => setLegenda(e.target.value)} placeholder="Ex: Degradê impecável!" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={postar}>Postar</button>
            <button className="btn btn-outline" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </Modal>
      )}
    </>
  );
}

function BarberCobracas({ agendamentos }) {
  const concluidos = agendamentos.filter(a => a.status === "concluido" || a.status === "confirmado");
  const total = concluidos.reduce((s, a) => s + a.valor, 0);
  const pendentes = agendamentos.filter(a => a.status === "pendente").reduce((s, a) => s + a.valor, 0);

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-num">R$ {total}</div><div className="stat-label">Recebido</div></div>
        <div className="stat-card"><div className="stat-num">R$ {pendentes}</div><div className="stat-label">A Receber</div></div>
        <div className="stat-card"><div className="stat-num">{concluidos.length}</div><div className="stat-label">Atendimentos</div></div>
      </div>
      <div className="card">
        <div className="card-title">Histórico de Cobranças</div>
        {agendamentos.map(a => (
          <div className="cobranca-item" key={a.id}>
            <div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 16, fontWeight: 700 }}>{a.clienteNome}</div>
              <div className="text-muted">{a.corteNome} • {a.data} às {a.hora}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="cobranca-valor">R$ {a.valor}</span>
              <span className={`badge badge-${a.status}`}>{a.status}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function BarberInfo({ info, setInfo }) {
  const [form, setForm] = useState({ ...info });
  const [salvo, setSalvo] = useState(false);

  const salvar = () => {
    setInfo({ ...form });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-title">Dados da Barbearia</div>
      {salvo && <Alert type="success" msg="Dados salvos com sucesso!" />}
      <div className="grid-2">
        {["nome", "endereco", "cidade", "telefone", "horario"].map(f => (
          <div className="field" key={f}>
            <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
            <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="field">
        <label>Descrição</label>
        <textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
      </div>
      <div className="section-sep" />
      <div className="field">
        <label>Localização no Mapa (endereço)</label>
        <div className="mapa-placeholder">
          <span style={{ fontSize: 32 }}>📍</span>
          <span>{form.endereco}, {form.cidade}</span>
          <span className="text-muted" style={{ fontSize: 13 }}>Integração com Google Maps</span>
        </div>
      </div>
      <button className="btn btn-primary" style={{ maxWidth: 200 }} onClick={salvar}>Salvar Alterações</button>
    </div>
  );
}

// ─── CLIENTE ──────────────────────────────────────────────────────────────────
function ClienteDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("agendar");
  const [cortes] = useState(CORTES_INICIAIS);
  const [musicas] = useState(MUSICAS_INICIAIS);
  const [fotosSemana, setFotosSemana] = useState(FOTOS_SEMANA_INICIAIS);
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_INICIAIS.filter(a => a.clienteId === user.id));
  const [infoBarbearia] = useState(INFO_BARBEARIA_INICIAL);

  const tabs = [
    { id: "agendar", label: "Agendar" },
    { id: "meus", label: "Meus Agendamentos" },
    { id: "musica", label: "Música" },
    { id: "fotos", label: "Cortes da Semana" },
    { id: "barbearia", label: "A Barbearia" },
  ];

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-logo">RIFF ✦</div>
        <div className="topbar-right">
          <span className="topbar-user">👤 {user.nome}</span>
          <button className="topbar-logout" onClick={onLogout}>Sair</button>
        </div>
      </div>
      <div className="nav-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="content">
        {tab === "agendar" && <ClienteAgendar cortes={cortes} user={user} agendamentos={agendamentos} setAgendamentos={setAgendamentos} />}
        {tab === "meus" && <ClienteMeusAgendamentos agendamentos={agendamentos} setAgendamentos={setAgendamentos} />}
        {tab === "musica" && <ClienteMusica musicas={musicas} />}
        {tab === "fotos" && <ClienteFotos fotosSemana={fotosSemana} setFotosSemana={setFotosSemana} />}
        {tab === "barbearia" && <ClienteBarbearia info={infoBarbearia} />}
      </div>
    </div>
  );
}

const HORARIOS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];

function ClienteAgendar({ cortes, user, agendamentos, setAgendamentos }) {
  const [corteId, setCorteId] = useState(null);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");

  const corte = cortes.find(c => c.id === corteId);

  const agendar = () => {
    if (!corteId || !data || !hora) { setErro("Selecione o corte, data e horário."); return; }
    setErro("");
    const novo = {
      id: Date.now(),
      clienteId: user.id,
      clienteNome: user.nome,
      corteId,
      corteNome: corte.nome,
      valor: corte.valor,
      data,
      hora,
      status: "pendente",
    };
    setAgendamentos(prev => [...prev, novo]);
    setSucesso(`✓ Agendamento de ${corte.nome} em ${data} às ${hora} realizado! Você receberá uma confirmação no celular.`);
    setCorteId(null); setData(""); setHora("");
    setTimeout(() => setSucesso(""), 5000);
  };

  return (
    <div className="card">
      <div className="card-title">Agendar Corte</div>
      <Alert type="success" msg={sucesso} />
      <Alert type="error" msg={erro} />

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--brown)", display: "block", marginBottom: 10 }}>Escolha o Corte</label>
        {cortes.map(c => (
          <div key={c.id} className={`cliente-select-corte ${corteId === c.id ? "selected" : ""}`} onClick={() => setCorteId(c.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: 16, fontWeight: 700 }}>{c.nome}</div>
                <div className="text-muted">⏱ {c.tempo} minutos</div>
              </div>
              <div className="corte-valor">R$ {c.valor}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="field">
          <label>Data</label>
          <input type="date" value={data} onChange={e => setData(e.target.value)} min="2026-03-10" />
        </div>
      </div>

      {data && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--brown)", display: "block", marginBottom: 8 }}>Horário</label>
          <div className="horario-agend">
            {HORARIOS.map(h => (
              <div key={h} className={`horario-slot ${hora === h ? "selected" : ""}`} onClick={() => setHora(h)}>{h}</div>
            ))}
          </div>
        </div>
      )}

      <button className="btn btn-primary" style={{ maxWidth: 220 }} onClick={agendar}>Confirmar Agendamento</button>
    </div>
  );
}

function ClienteMeusAgendamentos({ agendamentos, setAgendamentos }) {
  const cancelar = (id) => setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: "cancelado" } : a));

  return (
    <div className="card">
      <div className="card-title">Meus Agendamentos</div>
      {agendamentos.length === 0 && <p className="text-muted">Nenhum agendamento ainda.</p>}
      {agendamentos.map(a => (
        <div className="agend-item" key={a.id}>
          <div className="agend-info">
            <div className="agend-nome">{a.corteNome}</div>
            <div className="agend-detalhe">R$ {a.valor} • {a.data} às {a.hora}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className={`badge badge-${a.status}`}>{a.status}</span>
            {a.status === "pendente" && (
              <button className="btn btn-danger btn-sm" onClick={() => cancelar(a.id)}>Cancelar</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ClienteMusica({ musicas }) {
  const [escolhida, setEscolhida] = useState(null);
  const [enviado, setEnviado] = useState(false);

  const enviar = () => {
    if (!escolhida) return;
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div className="card">
      <div className="card-title">🎵 Escolha a Música</div>
      <p className="text-muted" style={{ marginBottom: 20 }}>Diga ao barbeiro o que você quer ouvir durante o corte!</p>
      {enviado && <Alert type="success" msg={`✓ Pedido de "${escolhida}" enviado ao barbeiro!`} />}
      <div className="flex-gap" style={{ marginBottom: 20 }}>
        {musicas.map(m => (
          <div key={m.id} className={`musica-select-item ${escolhida === m.nome ? "selected" : ""}`} onClick={() => setEscolhida(m.nome)}>
            {m.nome}
          </div>
        ))}
      </div>
      <button className="btn btn-gold" style={{ maxWidth: 200 }} onClick={enviar} disabled={!escolhida}>
        Pedir para o Barbeiro
      </button>
    </div>
  );
}

function ClienteFotos({ fotosSemana, setFotosSemana }) {
  const [likedIds, setLikedIds] = useState([]);

  const toggleLike = (id) => {
    if (likedIds.includes(id)) {
      setLikedIds(prev => prev.filter(l => l !== id));
      setFotosSemana(prev => prev.map(f => f.id === id ? { ...f, likes: f.likes - 1 } : f));
    } else {
      setLikedIds(prev => [...prev, id]);
      setFotosSemana(prev => prev.map(f => f.id === id ? { ...f, likes: f.likes + 1 } : f));
    }
  };

  const diasRestantes = (dataStr) => {
    const diff = 7 - Math.floor((Date.now() - new Date(dataStr)) / 86400000);
    return Math.max(0, diff);
  };

  return (
    <div className="card">
      <div className="card-title">✂ Cortes da Semana</div>
      <div className="grid-3">
        {fotosSemana.map(f => (
          <div className="foto-card" key={f.id}>
            {f.fotoData ? <img src={f.fotoData} alt={f.legenda} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              : <div className="foto-placeholder">✂</div>}
            <div className="foto-info">
              <div className="foto-legenda">{f.legenda}</div>
              <div className="foto-meta">{diasRestantes(f.data)} dias restantes</div>
              <button className={`like-btn ${likedIds.includes(f.id) ? "liked" : ""}`} onClick={() => toggleLike(f.id)}>
                ❤ {f.likes} curtidas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClienteBarbearia({ info }) {
  return (
    <div className="card">
      <div className="card-title">{info.nome}</div>
      <p style={{ fontSize: 18, fontStyle: "italic", color: "var(--brown)", marginBottom: 20 }}>"{info.descricao}"</p>
      <div className="grid-2">
        <div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Endereço</label>
            <div style={{ padding: "10px 0", fontSize: 16 }}>📍 {info.endereco}<br />{info.cidade}</div>
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Telefone</label>
            <div style={{ padding: "10px 0", fontSize: 16 }}>📞 {info.telefone}</div>
          </div>
          <div className="field">
            <label>Horário de Funcionamento</label>
            <div style={{ padding: "10px 0", fontSize: 16 }}>🕐 {info.horario}</div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--brown)", display: "block", marginBottom: 8 }}>Localização</label>
          <div className="mapa-placeholder">
            <span style={{ fontSize: 40 }}>📍</span>
            <strong>{info.nome}</strong>
            <span>{info.endereco}</span>
            <span>{info.cidade}</span>
            <span className="text-muted" style={{ fontSize: 12 }}>Integração com Google Maps disponível</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App Principal ─────────────────────────────────────────────────────────────
export default function App() {
  const [tela, setTela] = useState(() => getUsuarioLogado() ? "app" : "login");
  const [usuario, setUsuario] = useState(() => getUsuarioLogado());

  const handleLogin = (user) => { saveUsuarioLogado(user); setUsuario(user); setTela("app"); };
  const handleCadastrado = (user) => { saveUsuarioLogado(user); setUsuario(user); setTela("app"); };
  const handleLogout = () => { saveUsuarioLogado(null); setUsuario(null); setTela("login"); };

  return (
    <>
      <StyleSheet />
      {tela === "login" && <Login onLogin={handleLogin} onCadastro={() => setTela("cadastro")} />}
      {tela === "cadastro" && <Cadastro onVoltar={() => setTela("login")} onCadastrado={handleCadastrado} />}
      {tela === "app" && usuario && (
        usuario.role === "barbeiro"
          ? <BarberDashboard user={usuario} onLogout={handleLogout} />
          : <ClienteDashboard user={usuario} onLogout={handleLogout} />
      )}
    </>
  );
}
