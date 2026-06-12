/* EBD Digital - Vanilla JS app */
(function () {
  "use strict";

  // ============ Icons (inline SVG strings) ============
  const ICONS = {
    user: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    shield: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    eye: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
    home: `<svg class="icon icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    users: `<svg class="icon icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    userPlus: `<svg class="icon icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="11" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>`,
    chart: `<svg class="icon icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,
    coins: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`,
    search: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>`,
    pencil: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
    check: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
    plus: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    minus: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
    arrowLeft: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
    history: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,
    trash: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    avatar: `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    save: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    trophy: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
  };

  const CLASSES = ["Crianças", "Jovens", "Adultos"];
  const MOTIVOS = ["Presença EBD", "Participação", "Leitura Bíblica", "Memorização de Versículo", "Oferta Missionária", "Outro"];
  const STORAGE_KEY = "ebd-talentos-v1";
  const ADMIN_PASS = "ebd321";

  // ============ Store ============
  const uid = () => Math.random().toString(36).slice(2, 10);
  const todayStr = () => new Date().toISOString().slice(0, 10);

  function defaultState() {
  return {
    participantes: [
      { id: uid(), nome: "Aldeon", classe: "Adultos", talentos: 46, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Antonia", classe: "Adultos", talentos: 57, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Cleonisse", classe: "Adultos", talentos: 46, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Danilo", classe: "Adultos", talentos: 29, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Diego", classe: "Adultos", talentos: 48, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Edineia", classe: "Adultos", talentos: 36, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Esther", classe: "Adultos", talentos: 43, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Giovana", classe: "Adultos", talentos: 32, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Jivanilde", classe: "Adultos", talentos: 30, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Joel", classe: "Adultos", talentos: 30, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Joelma", classe: "Adultos", talentos: 57, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Josifran", classe: "Adultos", talentos: 32, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Jozimos", classe: "Adultos", talentos: 57, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Kleydson", classe: "Adultos", talentos: 57, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Miguel", classe: "Adultos", talentos: 36, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Pedro Henrique", classe: "Adultos", talentos: 45, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Pedro Ramos", classe: "Adultos", talentos: 48, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Priscila", classe: "Adultos", talentos: 29, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Ruth", classe: "Adultos", talentos: 18, criadoEm: new Date().toISOString() },
      { id: uid(), nome: "Samia", classe: "Crianças", talentos: 48, criadoEm: new Date().toISOString() }
    ],
    presencas: [],
    movimentacoes: [],
    isAdmin: false,
  };
}

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed.state || parsed);
    } catch { return defaultState(); }
  }

  let state = loadState();

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state }));
  }

  const Store = {
    get: () => state,
    login(senha) {
      if (senha === ADMIN_PASS) { state.isAdmin = true; persist(); return true; }
      return false;
    },
    logout() { state.isAdmin = false; persist(); },
    addParticipante(p) {
      state.participantes.push({
        id: uid(), nome: p.nome, classe: p.classe,
        talentos: p.talentos || 0, criadoEm: new Date().toISOString(),
      });
      persist();
    },
    updateParticipante(id, patch) {
      state.participantes = state.participantes.map((p) => p.id === id ? Object.assign({}, p, patch) : p);
      persist();
    },
    removeParticipante(id) {
      state.participantes = state.participantes.filter((p) => p.id !== id);
      state.presencas = state.presencas.filter((x) => x.participanteId !== id);
      state.movimentacoes = state.movimentacoes.filter((x) => x.participanteId !== id);
      persist();
    },
    registrarPresenca(id) {
      const d = todayStr();
      if (state.presencas.some((p) => p.participanteId === id && p.data === d)) {
        return { ok: false, msg: "Presença já registrada hoje." };
      }
      state.presencas.push({ id: uid(), participanteId: id, data: d });
      state.movimentacoes.unshift({ id: uid(), participanteId: id, tipo: "presenca", quantidade: 1, motivo: "Presença EBD", data: new Date().toISOString(), responsavel: "Sistema" });
      const p = state.participantes.find((x) => x.id === id);
      if (p) p.talentos += 1;
      persist();
      return { ok: true, msg: "Presença registrada! +1 Talento Digital." };
    },
    adicionarTalentos(id, qtd, motivo) {
      const p = state.participantes.find((x) => x.id === id);
      if (p) p.talentos += qtd;
      state.movimentacoes.unshift({ id: uid(), participanteId: id, tipo: "adicao", quantidade: qtd, motivo, data: new Date().toISOString(), responsavel: "Sistema" });
      persist();
    },
    removerTalentos(id, qtd, motivo) {
      const p = state.participantes.find((x) => x.id === id);
      if (p) p.talentos = Math.max(0, p.talentos - qtd);
      state.movimentacoes.unshift({ id: uid(), participanteId: id, tipo: "remocao", quantidade: qtd, motivo, data: new Date().toISOString(), responsavel: "Sistema" });
      persist();
    },
  };

  // ============ Toast ============
  function toast(msg, type = "default") {
    const c = document.getElementById("toast-container");
    const t = document.createElement("div");
    t.className = "toast " + type;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity 0.3s"; }, 2500);
    setTimeout(() => t.remove(), 2900);
  }
  toast.success = (m) => toast(m, "success");
  toast.error = (m) => toast(m, "error");
  toast.warning = (m) => toast(m, "warning");

  // ============ Router (hash-based) ============
  function parseRoute() {
    const hash = location.hash.replace(/^#/, "") || "/";
    return hash;
  }
  function navigate(path) {
    location.hash = path;
  }

  // ============ Modal ============
  function openModal(contentHTML, onMount) {
    const root = document.getElementById("modal-root");
    root.innerHTML = `<div class="modal-overlay" data-close><div class="modal" role="dialog">${contentHTML}</div></div>`;
    root.querySelector(".modal-overlay").addEventListener("click", (e) => {
      if (e.target.dataset.close !== undefined) closeModal();
    });
    document.addEventListener("keydown", escClose);
    if (onMount) onMount(root.querySelector(".modal"));
  }
  function closeModal() {
    document.getElementById("modal-root").innerHTML = "";
    document.removeEventListener("keydown", escClose);
  }
  function escClose(e) { if (e.key === "Escape") closeModal(); }

  // ============ Helpers ============
  const fmtData = (iso) => new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const escapeHtml = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // ============ Views ============
  function renderLanding() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="landing">
        <div class="landing-inner">
          <img src="logo-ad.jpg" alt="Logo Assembleia de Deus Missão 1203" class="logo" />
          <div>
            <h1>ASSEMBLEIA DE DEUS</h1>
            <p class="subtitle"><strong>MISSÃO 1203 — EBD Digital</strong></p>
          </div>
          <div class="actions">
            <button class="btn btn-lg" id="btn-participante">${ICONS.user} Sou Participante</button>
            <button class="btn btn-outline btn-lg" id="btn-admin">${ICONS.shield} Sou Administrador</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById("btn-participante").onclick = () => { Store.logout(); navigate("/app/membros"); };
    document.getElementById("btn-admin").onclick = openAdminModal;
  }

  function openAdminModal() {
    openModal(`
      <div class="modal-title">${ICONS.shield} Acesso Administrador</div>
      <div class="modal-body">
        <label class="label-small">Digite a senha para continuar:</label>
        <div class="password-wrap">
          <input id="adm-pass" type="password" class="input" placeholder="Senha" autofocus />
          <button class="eye" id="eye-toggle" type="button">${ICONS.eye}</button>
        </div>
        <button class="btn btn-md" id="adm-enter">Entrar</button>
      </div>
    `, (modal) => {
      const inp = modal.querySelector("#adm-pass");
      const eye = modal.querySelector("#eye-toggle");
      let show = false;
      eye.onclick = () => { show = !show; inp.type = show ? "text" : "password"; eye.innerHTML = show ? ICONS.eyeOff : ICONS.eye; };
      const submit = () => {
        if (Store.login(inp.value)) {
          closeModal(); toast.success("Bem-vindo, Administrador!"); navigate("/app");
        } else toast.error("Senha incorreta");
      };
      modal.querySelector("#adm-enter").onclick = submit;
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
      setTimeout(() => inp.focus(), 50);
    });
  }

  // ---- App shell ----
  function renderAppShell(currentPath, contentHTML) {
    const isAdmin = Store.get().isAdmin;
    const items = [
      { to: "/", label: "Início", icon: ICONS.home },
      { to: "/app/membros", label: "Membros", icon: ICONS.users },
    ];
    if (isAdmin) items.push({ to: "/app/cadastro", label: "Cadastro", icon: ICONS.userPlus });
    items.push({ to: "/app/relatorios", label: "Relatórios", icon: ICONS.chart });

    const nav = items.map((it) => {
      const active = it.to === "/" ? currentPath === "/" : currentPath.startsWith(it.to);
      return `<a href="#${it.to}" class="${active ? "active" : ""}">${it.icon}<span>${it.label}</span></a>`;
    }).join("");

    document.getElementById("app").innerHTML = `
      <div class="app-shell">
        <header class="app-header">
          <div class="app-header-inner">
            <img src="logo-ad.jpg" alt="logo" />
            <div>
              <div class="title">ASSEMBLEIA DE DEUS</div>
              <div class="subtitle-sm">MISSÃO 1203 — EBD Digital</div>
            </div>
          </div>
        </header>
        <main class="app-main">${contentHTML}</main>
        <nav class="bottom-nav">
          <div class="bottom-nav-inner" style="grid-template-columns: repeat(${items.length}, minmax(0,1fr));">${nav}</div>
        </nav>
      </div>
    `;
  }

  function memberCardHTML(p, isAdmin) {
    const hoje = todayStr();
    const jaPresente = Store.get().presencas.some((x) => x.participanteId === p.id && x.data === hoje);
    if (!isAdmin) {
      return `
        <div class="member-card card">
          <div class="member-head">
            <div style="min-width:0;">
              <h3 class="member-name">${escapeHtml(p.nome)}</h3>
              ${p.classe ? `<p class="member-class">${escapeHtml(p.classe)}</p>` : ""}
            </div>
            <span class="talent-badge"><span>🪙</span> ${p.talentos}</span>
          </div>
          <div class="member-actions">
            <a class="btn btn-outline" href="#/app/participante/${p.id}">Ver Perfil</a>
          </div>
        </div>`;
    }
    return `
      <div class="member-card card">
        <div class="member-head">
          <div style="min-width:0;">
            <h3 class="member-name">${escapeHtml(p.nome)}</h3>
            ${p.classe ? `<p class="member-class">${escapeHtml(p.classe)}</p>` : ""}
          </div>
          <span class="talent-badge"><span>🪙</span> ${p.talentos}</span>
        </div>
        <div class="member-actions">
          <button class="btn ${jaPresente ? "btn-success" : ""}" data-presenca="${p.id}" ${jaPresente ? "disabled" : ""}>
            ${ICONS.check} ${jaPresente ? "Presença Confirmada" : "Presença"}
          </button>
          <a class="btn btn-outline-danger btn-icon" href="#/app/participante/${p.id}" aria-label="Editar">${ICONS.pencil}</a>
        </div>
      </div>`;
  }

  function attachMemberCardHandlers(container) {
    container.querySelectorAll("[data-presenca]").forEach((btn) => {
      btn.onclick = () => {
        const r = Store.registrarPresenca(btn.dataset.presenca);
        r.ok ? toast.success(r.msg) : toast.warning(r.msg);
        render();
      };
    });
  }

  // ---- /app (início) ----
  function viewInicio() {
    const s = Store.get();
    const filtroQ = (sessionStorage.getItem("q-inicio") || "");
    const totalMembros = s.participantes.length;
    const totalTalentos = s.participantes.reduce((a, b) => a + b.talentos, 0);
    const list = s.participantes.filter((p) => p.nome.toLowerCase().includes(filtroQ.toLowerCase()));

    const html = `
      <div class="row-gap">
        <div class="grid-2">
          <div class="stat-card"><div class="stat-icon primary">${ICONS.users}</div><div class="stat-value">${totalMembros}</div><div class="stat-label">Membros</div></div>
          <div class="stat-card"><div class="stat-icon talent">${ICONS.coins}</div><div class="stat-value">${totalTalentos}</div><div class="stat-label">Talentos</div></div>
        </div>
        <div class="search-wrap">
          <span class="icon-search">${ICONS.search}</span>
          <input id="q" class="input pl-icon" placeholder="Pesquisar por nome..." value="${escapeHtml(filtroQ)}" />
        </div>
        <div id="list" class="row-gap">
          ${list.length === 0 ? `<p class="empty">Nenhum participante encontrado.</p>` : list.map((p) => memberCardHTML(p, s.isAdmin)).join("")}
        </div>
      </div>
    `;
    renderAppShell("/app", html);
    const q = document.getElementById("q");
    q.oninput = () => { sessionStorage.setItem("q-inicio", q.value); render(); q.focus(); q.setSelectionRange(q.value.length, q.value.length); };
    attachMemberCardHandlers(document);
  }

  // ---- /app/membros ----
  function viewMembros() {
    const s = Store.get();
    const filtroQ = (sessionStorage.getItem("q-membros") || "");
    const list = [...s.participantes].sort((a, b) => a.nome.localeCompare(b.nome))
      .filter((p) => p.nome.toLowerCase().includes(filtroQ.toLowerCase()));
    const isAdmin = s.isAdmin;

    let listHTML;
    if (isAdmin) {
      listHTML = list.length ? `<div class="row-gap">${list.map((p) => memberCardHTML(p, true)).join("")}</div>` : `<p class="empty">Sem resultados.</p>`;
    } else {
      listHTML = list.length ? `<div class="member-list">${list.map((p) => `
        <div class="row">
          <div style="min-width:0">
            <div class="nm">${escapeHtml(p.nome)}</div>
            ${p.classe ? `<div class="cl">${escapeHtml(p.classe)}</div>` : ""}
          </div>
          <span class="talent-badge"><span>🪙</span> ${p.talentos}</span>
        </div>`).join("")}</div>` : `<p class="empty">Sem resultados.</p>`;
    }

    renderAppShell("/app/membros", `
      <div class="row-gap">
        <h1 class="section-title">Membros</h1>
        <div class="search-wrap">
          <span class="icon-search">${ICONS.search}</span>
          <input id="q" class="input pl-icon" placeholder="Pesquisar..." value="${escapeHtml(filtroQ)}" />
        </div>
        ${listHTML}
      </div>
    `);
    const q = document.getElementById("q");
    q.oninput = () => { sessionStorage.setItem("q-membros", q.value); render(); q.focus(); q.setSelectionRange(q.value.length, q.value.length); };
    attachMemberCardHandlers(document);
  }

  // ---- /app/cadastro ----
  function viewCadastro() {
    if (!Store.get().isAdmin) { navigate("/app/membros"); return; }
    renderAppShell("/app/cadastro", `
      <div class="row-gap">
        <div class="title-row">${ICONS.userPlus}<h1 class="section-title">Novo Participante</h1></div>
        <form id="form-cad" class="card form-card">
          <div class="field">
            <label for="nome">Nome Completo *</label>
            <input id="nome" class="input" placeholder="Ex: Maria Souza" />
          </div>
          <div class="field">
            <label>Classe EBD <span class="muted">(Opcional)</span></label>
            <select id="classe" class="select">
              <option value="">Selecione...</option>
              ${CLASSES.map((c) => `<option value="${c}">${c}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="talentos"><span class="label-talent-icon">${ICONS.coins}</span>Talentos iniciais <span class="muted">(Opcional)</span></label>
            <input id="talentos" type="number" min="0" class="input field-talent" placeholder="0" />
          </div>
          <button type="submit" class="btn btn-md">${ICONS.save} Salvar</button>
        </form>
      </div>
    `);
    document.getElementById("form-cad").onsubmit = (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      if (!nome) return toast.error("Informe o nome completo.");
      const classe = document.getElementById("classe").value || undefined;
      const t = parseInt(document.getElementById("talentos").value, 10);
      Store.addParticipante({ nome, classe, talentos: isNaN(t) ? 0 : Math.max(0, t) });
      toast.success("Participante cadastrado!");
      navigate("/app");
    };
  }

  // ---- /app/relatorios ----
  function viewRelatorios() {
    const s = Store.get();
    const top = [...s.participantes].sort((a, b) => b.talentos - a.talentos).slice(0, 5);
    const totalTal = s.participantes.reduce((a, b) => a + b.talentos, 0);
    renderAppShell("/app/relatorios", `
      <div class="row-gap">
        <div class="title-row">${ICONS.chart}<h1 class="section-title">Relatórios</h1></div>
        <div class="grid-2">
          <div class="stat-card"><div class="stat-icon talent">${ICONS.coins}</div><div class="stat-value">${totalTal}</div><div class="stat-label">Talentos</div></div>
          <div class="stat-card"><div class="stat-icon flame">${ICONS.trophy}</div><div class="stat-value">${s.participantes.length}</div><div class="stat-label">Membros</div></div>
        </div>
        <div class="card section-card">
          <h2>🏆 Mais Talentos</h2>
          <div>
            ${top.map((p, i) => `
              <div class="report-row">
                <div style="display:flex;align-items:center;gap:0.75rem;min-width:0;">
                  <span class="report-pos">${i + 1}</span>
                  <span class="report-name">${escapeHtml(p.nome)}</span>
                </div>
                <span class="report-val">${p.talentos} 🪙</span>
              </div>`).join("")}
          </div>
        </div>
      </div>
    `);
  }

  // ---- /app/participante/:id ----
  function viewPerfil(id) {
    const s = Store.get();
    const p = s.participantes.find((x) => x.id === id);
    if (!p) {
      renderAppShell("/app/participante", `<p class="empty">Não encontrado. <a href="#/app" style="color:var(--primary);text-decoration:underline">Voltar</a></p>`);
      return;
    }
    const isAdmin = s.isAdmin;
    const movs = s.movimentacoes.filter((m) => m.participanteId === id && m.tipo !== "presenca");
    const jaPresente = s.presencas.some((x) => x.participanteId === id && x.data === todayStr());

    const headHTML = isAdmin ? `
      <div class="profile-name-wrap">
        <input id="edit-nome" class="profile-name-input" value="${escapeHtml(p.nome)}" readonly />
        <button class="pencil-btn" id="btn-pencil" aria-label="Editar nome">${ICONS.pencil}</button>
      </div>
      <select id="edit-classe" class="classe-select-pill">
        <option value="">Classe...</option>
        ${CLASSES.map((c) => `<option value="${c}" ${p.classe === c ? "selected" : ""}>${c}</option>`).join("")}
      </select>
    ` : `
      <h1 class="profile-name">${escapeHtml(p.nome)}</h1>
      ${p.classe ? `<span class="classe-pill">${escapeHtml(p.classe)}</span>` : ""}
    `;

    const actionsHTML = isAdmin ? `
      <div class="action-block">
        <button id="btn-presenca" class="btn ${jaPresente ? "btn-success" : ""}" ${jaPresente ? "disabled" : ""}>
          ${ICONS.check} ${jaPresente ? "Presença Confirmada" : "Registrar Presença (+1 Talento)"}
        </button>
        <div class="grid-2">
          <button id="btn-add" class="btn btn-flame">${ICONS.plus} Adicionar Talentos</button>
          <button id="btn-rem" class="btn btn-outline-danger">${ICONS.minus} Remover Talentos</button>
        </div>
      </div>
    ` : "";

    const movHTML = movs.length === 0 ? `<p class="history-empty">Nenhuma movimentação ainda.</p>` :
      `<ul>${movs.map((m) => `
        <li class="history-item">
          <div class="history-left">
            <span class="history-icon">${ICONS.coins}</span>
            <div style="min-width:0;">
              <div class="history-motivo">${escapeHtml(m.motivo)}</div>
              <div class="history-data">${fmtData(m.data)}</div>
            </div>
          </div>
          <span class="history-val ${m.tipo === "remocao" ? "rem" : "add"}">${m.tipo === "remocao" ? "-" : "+"}${m.quantidade}</span>
        </li>`).join("")}</ul>`;

    const deleteHTML = isAdmin ? `<button id="btn-del" class="btn btn-ghost btn-md">${ICONS.trash} Excluir participante</button>` : "";

    renderAppShell("/app/participante", `
      <div class="row-gap">
        <a href="#/app" class="back-btn">${ICONS.arrowLeft} Voltar</a>
        <div class="card profile-head">
          <div class="avatar">${ICONS.avatar}</div>
          <div>${headHTML}</div>
          <div class="profile-stats">
            <div class="tn">🪙 ${p.talentos}</div>
            <div class="lb">Talentos</div>
          </div>
        </div>
        ${actionsHTML}
        <div class="card history-card">
          <div class="history-head">${ICONS.history}<h2>Histórico de Movimentações</h2></div>
          ${movHTML}
        </div>
        ${deleteHTML}
      </div>
    `);

    if (isAdmin) {
      const nomeInp = document.getElementById("edit-nome");
      const pencil = document.getElementById("btn-pencil");
      let unlocked = false;
      pencil.onclick = () => { unlocked = true; nomeInp.readOnly = false; nomeInp.classList.add("unlocked"); nomeInp.focus(); nomeInp.setSelectionRange(nomeInp.value.length, nomeInp.value.length); };
      const salvar = () => {
        const nv = nomeInp.value.trim();
        if (!nv) { nomeInp.value = p.nome; }
        else if (nv !== p.nome) { Store.updateParticipante(id, { nome: nv }); toast.success("Nome atualizado"); }
        unlocked = false; nomeInp.readOnly = true; nomeInp.classList.remove("unlocked");
      };
      nomeInp.onblur = salvar;
      nomeInp.onkeydown = (e) => { if (e.key === "Enter") nomeInp.blur(); };
      document.getElementById("edit-classe").onchange = (e) => {
        Store.updateParticipante(id, { classe: e.target.value || undefined });
        toast.success("Classe atualizada");
      };
      document.getElementById("btn-presenca").onclick = () => {
        const r = Store.registrarPresenca(id);
        r.ok ? toast.success(r.msg) : toast.warning(r.msg);
        render();
      };
      document.getElementById("btn-add").onclick = () => openTalentDialog("add", id);
      document.getElementById("btn-rem").onclick = () => openTalentDialog("rem", id);
      document.getElementById("btn-del").onclick = () => {
        if (confirm(`Remover ${p.nome}?`)) { Store.removeParticipante(id); toast.success("Removido"); navigate("/app"); }
      };
    }
  }

  function openTalentDialog(tone, id) {
    const isAdd = tone === "add";
    const title = isAdd ? "Adicionar Talentos" : "Remover Talentos";
    const defaultMotivo = isAdd ? "Participação" : "Ajuste";
    openModal(`
      <div class="modal-title">${title}</div>
      <div class="modal-body">
        <div class="field"><label>Quantidade</label><input id="td-qtd" type="number" min="1" value="1" class="input" /></div>
        <div class="field"><label>Motivo</label>
          <select id="td-motivo" class="select">
            ${(isAdd ? MOTIVOS : [...MOTIVOS, "Ajuste"]).map((m) => `<option ${m === defaultMotivo ? "selected" : ""}>${m}</option>`).join("")}
          </select>
        </div>
        <button class="btn btn-md ${isAdd ? "" : "btn-destructive"}" id="td-confirm">Confirmar</button>
      </div>
    `, (modal) => {
      modal.querySelector("#td-confirm").onclick = () => {
        const n = parseInt(modal.querySelector("#td-qtd").value, 10);
        if (!n || n < 1) return toast.error("Quantidade inválida");
        const motivo = modal.querySelector("#td-motivo").value;
        if (isAdd) { Store.adicionarTalentos(id, n, motivo); toast.success(`+${n} Talentos adicionados`); }
        else { Store.removerTalentos(id, n, motivo); toast.success(`-${n} Talentos removidos`); }
        closeModal(); render();
      };
    });
  }

  // ============ Router dispatcher ============
  function render() {
    const path = parseRoute();
    closeModal();
    if (path === "/" || path === "") return renderLanding();
    if (path === "/app" || path === "/app/") return viewInicio();
    if (path === "/app/membros") return viewMembros();
    if (path === "/app/cadastro") return viewCadastro();
    if (path === "/app/relatorios") return viewRelatorios();
    const m = path.match(/^\/app\/participante\/(.+)$/);
    if (m) return viewPerfil(m[1]);
    renderLanding();
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("DOMContentLoaded", render);
  if (document.readyState !== "loading") render();
})();
