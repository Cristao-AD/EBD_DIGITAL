/* EBD Digital - Vanilla JS app com Firebase Auth */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  runTransaction 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvLX2ywG4N-jNdXDHtTZCpmibhc397FKw",
  authDomain: "ebd-digital-bc9da.firebaseapp.com",
  projectId: "ebd-digital-bc9da",
  storageBucket: "ebd-digital-bc9da.firebasestorage.app",
  messagingSenderId: "249730740857",
  appId: "1:249730740857:web:4e578c6a6ff36c38931aa8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

(function () {
  "use strict";

  // Imagem tridimensional estável do saquinho de ouro 3D da Google Noto Emoji
  const IMG_SAQUINHO = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4b0/512.png";

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

  const todayStr = () => new Date().toISOString().slice(0, 10);

  let state = {
    participantes: [],
    presencas: [],
    movimentacoes: [],
    isAdmin: false, 
  };

  onAuthStateChanged(auth, (user) => {
    state.isAdmin = !!user;
    if (typeof render === "function") render();
  });

  // ============ Store ============
  const Store = {
    get: () => state,
    
    async sync() {
      try {
        const partSnap = await getDocs(collection(db, "participantes"));
        state.participantes = partSnap.docs.map(d => Object.assign({ id: d.id }, d.data()));

        const presSnap = await getDocs(collection(db, "presencas"));
        state.presencas = presSnap.docs.map(d => Object.assign({ id: d.id }, d.data()));

        const movSnap = await getDocs(collection(db, "movimentacoes"));
        state.movimentacoes = movSnap.docs.map(d => Object.assign({ id: d.id }, d.data()))
                                      .sort((a,b) => new Date(b.data) - new Date(a.data));
      } catch (err) {
        console.error("Erro ao sincronizar dados:", err);
      }
    },

    async login(email, senha) {
      try {
        await signInWithEmailAndPassword(auth, email, senha);
        return { ok: true };
      } catch (error) {
        let msg = "Erro ao fazer login.";
        if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
          msg = "E-mail ou senha incorretos.";
        } else if (error.code === "auth/invalid-email") {
          msg = "Formato de e-mail inválido.";
        }
        return { ok: false, msg };
      }
    },

    async logout() { 
      await signOut(auth);
    },

    async addParticipante(p) {
      const novo = {
        nome: p.nome,
        classe: p.classe || "",
        talentos: p.talentos || 0,
        criadoEm: new Date().toISOString()
      };
      await addDoc(collection(db, "participantes"), novo);
      await this.sync();
    },

    async updateParticipante(id, patch) {
      const docRef = doc(db, "participantes", id);
      await updateDoc(docRef, patch);
      await this.sync();
    },

    async removeParticipante(id) {
      await deleteDoc(doc(db, "participantes", id));
      await this.sync();
    },

    async registrarPresenca(id) {
      const d = todayStr();
      if (state.presencas.some((p) => p.participanteId === id && p.data === d)) {
        return { ok: false, msg: "Presença já registrada hoje." };
      }

      try {
        await runTransaction(db, async (transaction) => {
          const pRef = doc(db, "participantes", id);
          const pDoc = await transaction.get(pRef);
          if (!pDoc.exists()) throw "Participante não existe!";

          const novosTalentos = (pDoc.data().talentos || 0) + 1;
          transaction.update(pRef, { talentos: novosTalentos });

          const novaPresencaRef = doc(collection(db, "presencas"));
          transaction.set(novaPresencaRef, { participanteId: id, data: d });

          const novaMovRef = doc(collection(db, "movimentacoes"));
          transaction.set(novaMovRef, {
            participanteId: id,
            tipo: "presenca",
            quantidade: 1,
            motivo: "Presença EBD",
            data: new Date().toISOString(),
            responsavel: "Sistema"
          });
        });

        await this.sync();
        return { ok: true, msg: "Presença registrada! +1 Talento Digital." };
      } catch (e) {
        return { ok: false, msg: "Erro ao registrar: " + e };
      }
    },

    async cancelarPresenca(id) {
      const d = todayStr();
      const presencaHoje = state.presencas.find((p) => p.participanteId === id && p.data === d);
      
      if (!presencaHoje) {
        return { ok: false, msg: "Nenhuma presença registrada hoje para remover." };
      }

      try {
        await runTransaction(db, async (transaction) => {
          const pRef = doc(db, "participantes", id);
          const pDoc = await transaction.get(pRef);
          if (!pDoc.exists()) throw "Participante não existe!";

          const novosTalentos = Math.max(0, (pDoc.data().talentos || 0) - 1);
          transaction.update(pRef, { talentos: novosTalentos });

          const presencaRef = doc(db, "presencas", presencaHoje.id);
          transaction.delete(presencaRef);

          const novaMovRef = doc(collection(db, "movimentacoes"));
          transaction.set(novaMovRef, {
            participanteId: id,
            tipo: "remocao",
            quantidade: 1,
            motivo: "Cancelamento de Presença",
            data: new Date().toISOString(),
            responsavel: "Sistema"
          });
        });

        await this.sync();
        return { ok: true, msg: "Presença cancelada e 1 talento estornado!" };
      } catch (e) {
        return { ok: false, msg: "Erro ao cancelar: " + e };
      }
    },

    async adicionarTalentos(id, qtd, motivo) {
      try {
        await runTransaction(db, async (transaction) => {
          const pRef = doc(db, "participantes", id);
          const pDoc = await transaction.get(pRef);
          const novosTalentos = (pDoc.data().talentos || 0) + qtd;
          
          transaction.update(pRef, { talentos: novosTalentos });
          
          const novaMovRef = doc(collection(db, "movimentacoes"));
          transaction.set(novaMovRef, {
            participanteId: id,
            tipo: "adicao",
            quantidade: qtd,
            motivo,
            data: new Date().toISOString(),
            responsavel: "Sistema"
          });
        });
        await this.sync();
      } catch (e) { console.error(e); }
    },

    async removerTalentos(id, qtd, motivo) {
      try {
        await runTransaction(db, async (transaction) => {
          const pRef = doc(db, "participantes", id);
          const pDoc = await transaction.get(pRef);
          const novosTalentos = Math.max(0, (pDoc.data().talentos || 0) - qtd);
          
          transaction.update(pRef, { talentos: novosTalentos });
          
          const novaMovRef = doc(collection(db, "movimentacoes"));
          transaction.set(novaMovRef, {
            participanteId: id,
            tipo: "remocao",
            quantidade: qtd,
            motivo,
            data: new Date().toISOString(),
            responsavel: "Sistema"
          });
        });
        await this.sync();
      } catch (e) { console.error(e); }
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
    return location.hash.replace(/^#/, "") || "/";
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
          <img src="logo-ad.jpg" alt="Logo" class="logo" />
          <div>
            <h1>ASSEMBLEIA DE DEUS</h1>
            <p class="subtitle"><strong>MISSÃO 1203 — EBD Digital</strong></p>
          </div>
          <div class="actions">
            <button class="btn btn-lg" id="btn-participante">${ICONS.user} Sou Participante</button>
            <button class="btn btn-outline btn-lg" id="btn-admin">${ICONS.shield} Sou Administrador(a)</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById("btn-participante").onclick = () => { Store.logout(); navigate("/app/membros"); };
    document.getElementById("btn-admin").onclick = openAdminModal;
  }

  function openAdminModal() {
    openModal(`
      <div class="modal-title">${ICONS.shield} Acesso Administrador(a)</div>
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
      
      const submit = async () => {
        const emailFixo = "danilolex5@gmail.com";
        const senha = inp.value;
        
        if (!senha) return toast.error("Digite a senha.");
        
        toast("Autenticando...");
        const r = await Store.login(emailFixo, senha);
        
        if (r.ok) {
          closeModal(); 
          toast.success("Bem-vindo, Administrador(a)!"); 
          navigate("/app");
        } else {
          toast.error(r.msg);
        }
      };
      
      modal.querySelector("#adm-enter").onclick = submit;
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
      setTimeout(() => inp.focus(), 50);
    });
  }

  // 🎨 SHELL ATUALIZADO: Ícone de Início aponta para a raiz '/' e pílula azul aplicada
  function renderAppShell(currentPath, contentHTML) {
    const isAdmin = Store.get().isAdmin;
    const items = [
      { to: "/", label: "Início", icon: ICONS.home },
      { to: "/app/membros", label: "Membros", icon: ICONS.users },
    ];
    if (isAdmin) items.push({ to: "/app/cadastro", label: "Cadastro", icon: ICONS.userPlus });
    items.push({ to: "/app/relatorios", label: "Relatórios", icon: ICONS.chart });

    const nav = items.map((it) => {
      const isHomeActive = (it.to === "/" && (currentPath === "/" || currentPath === ""));
      const isMembrosActive = (it.to === "/app/membros" && (currentPath === "/app/membros" || currentPath === "/app"));
      const isOtherActive = (it.to !== "/" && it.to !== "/app/membros" && currentPath.startsWith(it.to));
      
      const active = isHomeActive || isMembrosActive || isOtherActive;

      const estiloAtivo = active 
        ? `background-color: rgba(41, 80, 194, 0.12); color: var(--primary) !important; font-weight: 600; border-radius: 12px; padding: 6px 16px;` 
        : `color: var(--muted-foreground); padding: 6px 16px;`;

      return `
        <a href="#${it.to}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; transition: all 0.2s ease; ${estiloAtivo}">
          <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 2px;">${it.icon}</div>
          <span style="font-size: 0.75rem; line-height: 1;">${it.label}</span>
        </a>
      `;
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
        <nav class="bottom-nav" style="background: var(--background); border-top: 1px solid var(--border); padding: 8px 10px 12px;">
          <div class="bottom-nav-inner" style="display: grid; grid-template-columns: repeat(${items.length}, minmax(0,1fr)); gap: 4px; align-items: center;">${nav}</div>
        </nav>
      </div>
    `;
  }

  function memberCardHTML(p, isAdmin) {
    const hoje = todayStr();
    const jaPresente = Store.get().presencas.some((x) => x.participanteId === p.id && x.data === hoje);
    
    if (!isAdmin) {
      return `
        <div class="member-card card link-perfil-card" data-id="${p.id}" style="cursor: pointer;">
          <div class="member-head">
            <div style="min-width:0;">
              <h3 class="member-name">${escapeHtml(p.nome)}</h3>
              ${p.classe ? `<p class="member-class">${escapeHtml(p.classe)}</p>` : ""}
            </div>
            <span class="talent-badge">
              <img src="${IMG_SAQUINHO}" alt="💰" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
              <span>${p.talentos}</span>
            </span>
          </div>
        </div>`;
    }
    
    return `
      <div class="member-card card">
        <div class="member-head link-perfil-card" data-id="${p.id}" style="cursor: pointer; width: 100%;">
          <div style="min-width:0; flex: 1;">
            <h3 class="member-name">${escapeHtml(p.nome)}</h3>
            ${p.classe ? `<p class="member-class">${escapeHtml(p.classe)}</p>` : ""}
          </div>
          <span class="talent-badge">
            <img src="${IMG_SAQUINHO}" alt="💰" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
            <span>${p.talentos}</span>
          </span>
        </div>
        <div class="member-actions" style="margin-top: 0.5rem;">
          <button class="btn ${jaPresente ? "btn-success" : ""}" data-presenca="${p.id}" ${jaPresente ? "disabled" : ""}>
            ${ICONS.check} ${jaPresente ? "Presença Confirmada" : "Presença"}
          </button>
          <button class="btn btn-outline-danger btn-icon btn-editar-card" data-id="${p.id}" aria-label="Editar">${ICONS.pencil}</button>
        </div>
      </div>`;
  }

  function attachMemberCardHandlers(container) {
    // 1. Gerencia o botão de dar presença
    container.querySelectorAll("[data-presenca]").forEach((btn) => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const r = await Store.registrarPresenca(btn.dataset.presenca);
        r.ok ? toast.success(r.msg) : toast.warning(r.msg);
        
        const s = Store.get();
        const filtroQ = (sessionStorage.getItem("q-inicio") || "");
        const list = s.participantes.filter((p) => p.nome.toLowerCase().includes(filtroQ.toLowerCase()));
        const listContainer = document.getElementById("list");
        if (listContainer) {
          listContainer.innerHTML = list.length === 0 ? `<p class="empty">Nenhum participante encontrado.</p>` : list.map((p) => memberCardHTML(p, s.isAdmin)).join("");
          attachMemberCardHandlers(listContainer);
        }
      };
    });

    // 2. ⚡ GERENCIA O BOTÃO DO LÁPIS (EDITAR) INTERNAMENTE:
    container.querySelectorAll(".btn-editar-card").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation(); // Impede o clique de vazar para o fundo
        const id = btn.dataset.id;
        navigate(`/app/participante?id=${id}`); // Chama o navigate com segurança total do escopo
      };
    });

    // 3. ⚡ GERENCIA O CLIQUE NO CARD/TEXTO PARA ABRIR O PERFIL:
    container.querySelectorAll(".link-perfil-card").forEach((elemento) => {
      elemento.onclick = () => {
        const id = elemento.dataset.id;
        navigate(`/app/participante?id=${id}`);
      };
    });
  }

  // ⚡ LÓGICA CORRIGIDA: Renderiza o input de busca uma única vez, blindando o teclado do telemóvel
  function viewInicio() {
    const s = Store.get();
    const filtroQ = (sessionStorage.getItem("q-inicio") || "");
    const totalMembros = s.participantes.length;
    const totalTalentos = s.participantes.reduce((a, b) => a + b.talentos, 0);

    const html = `
      <div class="row-gap">
        <div class="grid-2">
          <div class="stat-card">
            <div class="stat-icon primary">${ICONS.users}</div>
            <div class="stat-value">${totalMembros}</div>
            <div class="stat-label">Membros</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon talent" style="background: var(--talent-bg); display: flex; align-items: center; justify-content: center;">
              <img src="${IMG_SAQUINHO}" alt="💰" style="width: 22px; height: 22px;" />
            </div>
            <div class="stat-value">${totalTalentos}</div>
            <div class="stat-label">Talentos</div>
          </div>
        </div>
        <div class="search-wrap">
          <span class="icon-search" style="position: absolute; top: 50%; left: 0.75rem; transform: translateY(-50%); color: var(--muted-foreground); display: inline-flex;">${ICONS.search}</span>
          <input id="q" class="input" placeholder="Pesquisar por nome..." value="${escapeHtml(filtroQ)}" style="padding-left: 2.25rem;" autocomplete="off" />
        </div>
        <div id="list" class="row-gap"></div>
      </div>
    `;
    
    const rotaAtiva = parseRoute().startsWith("/app/membros") ? "/app/membros" : "/app";
    renderAppShell(rotaAtiva, html);

    const q = document.getElementById("q");
    const listContainer = document.getElementById("list");

    const renderizarListaFiltrada = () => {
      const termo = q.value.toLowerCase().trim();
      const filtrados = s.participantes.filter((p) => p.nome.toLowerCase().includes(termo));

      listContainer.innerHTML = filtrados.length === 0 
        ? `<p class="empty">Nenhum participante encontrado.</p>` 
        : filtrados.map((p) => memberCardHTML(p, s.isAdmin)).join("");
        
      attachMemberCardHandlers(listContainer);
    };

    renderizarListaFiltrada();

    q.oninput = () => {
      sessionStorage.setItem("q-inicio", q.value);
      renderizarListaFiltrada();
    };
  }

  // 🎯 UNIFICAÇÃO DAS ABAS: "Membros" herda nativamente o painel integrado do Início
  function viewMembros() {
    viewInicio();
  }

  function viewCadastro() {
    if (!Store.get().isAdmin) { navigate("/app/membros"); return; }
    renderAppShell("/app/cadastro", `
      <div class="row-gap">
        <div class="title-row">${ICONS.userPlus}<h1 class="section-title">Novo Participante</h1></div>
        <form id="form-cad" class="card form-card">
          <div class="field">
            <label for="nome">Nome Completo *</label>
            <input id="nome" class="input" placeholder="Ex: Maria Souza" autocomplete="off" />
          </div>
          <div class="field">
            <label>Classe EBD <span class="muted">(Opcional)</span></label>
            <select id="classe" class="select">
              <option value="">Selecione...</option>
              ${CLASSES.map((c) => `<option value="${c}">${c}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="talentos">
              <span class="label-talent-icon" style="display: inline-flex; align-items: center; justify-content: center; background: rgba(242,201,76,0.2); width: 24px; height: 24px; border-radius: 50%; margin-right: 4px;">
                <img src="${IMG_SAQUINHO}" alt="💰" style="width: 14px; height: 14px; vertical-align: middle;" />
              </span>
              Talentos iniciais <span class="muted">(Opcional)</span>
            </label>
            <input id="talentos" type="number" min="0" class="input field-talent" placeholder="0" />
          </div>
          <button type="submit" class="btn btn-md">${ICONS.save} Salvar</button>
        </form>
      </div>
    `);
    document.getElementById("form-cad").onsubmit = async (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      if (!nome) return toast.error("Informe o nome completo.");
      const classe = document.getElementById("classe").value || undefined;
      const t = parseInt(document.getElementById("talentos").value, 10);
      await Store.addParticipante({ nome, classe, talentos: isNaN(t) ? 0 : Math.max(0, t) });
      toast.success("Participante cadastrado!");
      navigate("/app");
    };
  }

  function viewRelatorios() {
    const s = Store.get();
    const top = [...s.participantes].sort((a, b) => b.talentos - a.talentos).slice(0, 5);
    const totalTal = s.participantes.reduce((a, b) => a + b.talentos, 0);
    renderAppShell("/app/relatorios", `
      <div class="row-gap">
        <div class="title-row">${ICONS.chart}<h1 class="section-title">Relatórios</h1></div>
        <div class="grid-2">
          <div class="stat-card">
            <div class="stat-icon talent" style="background: var(--talent-bg); display: flex; align-items: center; justify-content: center;">
              <img src="${IMG_SAQUINHO}" alt="💰" style="width: 20px; height: 20px;" />
            </div>
            <div class="stat-value">${totalTal}</div>
            <div class="stat-label">Talentos</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon flame">${ICONS.users}</div>
            <div class="stat-value">${s.participantes.length}</div>
            <div class="stat-label">Membros</div>
          </div>
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
                <span class="report-val" style="display: inline-flex; align-items: center; gap: 4px;">
                  ${p.talentos} <img src="${IMG_SAQUINHO}" alt="💰" style="width: 16px; height: 16px; vertical-align: middle;" />
                </span>
              </div>`).join("")}
          </div>
        </div>
      </div>
    `);
  }

  function viewPerfil(id) {
    const s = Store.get();
    const p = s.participantes.find((x) => x.id === id);
    if (!p) {
      renderAppShell("/app/participante", `<p class="empty">Não encontrado. <a href="#/app" style="color:var(--primary);text-decoration:underline">Voltar</a></p>`);
      return;
    }
    const isAdmin = s.isAdmin;
    
    const movs = s.movimentacoes.filter((m) => m.participanteId === id);
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
        ${jaPresente ? `
          <button id="btn-cancelar-presenca" class="btn btn-destructive" style="background-color: #dc2626; color: white;">
            ❌ Cancelar Presença Confirmada
          </button>
        ` : `
          <button id="btn-presenca" class="btn">
            ${ICONS.check} Registrar Presença (+1 Talento)
          </button>
        `}
        <div class="grid-2" style="margin-top: 10px;">
          <button id="btn-add" class="btn btn-flame">${ICONS.plus} Adicionar Talentos</button>
          <button id="btn-rem" class="btn btn-outline-danger">${ICONS.minus} Remover Talentos</button>
        </div>
      </div>
    ` : "";

    const movHTML = movs.length === 0 ? `<p class="history-empty">Nenhuma movimentação ainda.</p>` :
      `<ul>${movs.map((m) => `
        <li class="history-item">
          <div class="history-left">
            <span class="history-icon" style="display: inline-flex; align-items: center; margin-top: 0.15rem;">
              <img src="${IMG_SAQUINHO}" alt="💰" style="width: 18px; height: 18px; vertical-align: middle;" />
            </span>
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
            <div class="tn" style="display: inline-flex; align-items: center; gap: 6px; justify-content: center; color: var(--talent-foreground);">
              <img src="${IMG_SAQUINHO}" alt="💰" style="width: 22px; height: 22px; vertical-align: middle;" />
              <span>${p.talentos}</span>
            </div>
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
      pencil.onclick = () => { nomeInp.readOnly = false; nomeInp.classList.add("unlocked"); nomeInp.focus(); nomeInp.setSelectionRange(nomeInp.value.length, nomeInp.value.length); };
      
      const salvar = async () => {
        const nv = nomeInp.value.trim();
        if (!nv) { nomeInp.value = p.nome; }
        else if (nv !== p.nome) { 
          await Store.updateParticipante(id, { nome: nv }); 
          toast.success("Nome atualizado"); 
          await Store.sync();
          viewPerfil(id);
        }
        nomeInp.readOnly = true; nomeInp.classList.remove("unlocked");
      };
      nomeInp.onblur = salvar;
      nomeInp.onkeydown = (e) => { if (e.key === "Enter") nomeInp.blur(); };
      
      document.getElementById("edit-classe").onchange = async (e) => {
        await Store.updateParticipante(id, { classe: e.target.value || "" });
        toast.success("Classe atualizada");
        await Store.sync();
        viewPerfil(id);
      };

      if (jaPresente) {
        document.getElementById("btn-cancelar-presenca").onclick = async () => {
          if (confirm("Deseja realmente cancelar a presença de hoje e estornar 1 talento?")) {
            const r = await Store.cancelarPresenca(id);
            r.ok ? toast.success(r.msg) : toast.warning(r.msg);
            await Store.sync();
            viewPerfil(id);
          }
        };
      } else {
        document.getElementById("btn-presenca").onclick = async () => {
          const r = await Store.registrarPresenca(id);
          r.ok ? toast.success(r.msg) : toast.warning(r.msg);
          await Store.sync();
          viewPerfil(id);
        };
      }

      document.getElementById("btn-add").onclick = () => openTalentDialog("add", id, () => viewPerfil(id));
      document.getElementById("btn-rem").onclick = () => openTalentDialog("rem", id, () => viewPerfil(id));
      
      document.getElementById("btn-del").onclick = async () => {
        if (confirm(`Remover ${p.nome}?`)) { 
          await Store.removeParticipante(id); 
          toast.success("Removido"); 
          navigate("/app"); 
        }
      };
    }
  }

  function openTalentDialog(tone, id, onComplete) {
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
      modal.querySelector("#td-confirm").onclick = async () => {
        const n = parseInt(modal.querySelector("#td-qtd").value, 10);
        if (!n || n < 1) return toast.error("Quantidade inválida");
        const motivo = modal.querySelector("#td-motivo").value;
        if (isAdd) { 
          await Store.adicionarTalentos(id, n, motivo); 
          toast.success(`+${n} Talentos adicionados`); 
        } else { 
          await Store.removerTalentos(id, n, motivo); 
          toast.success(`-${n} Talentos removidos`); 
        }
        closeModal(); 
        if (onComplete) {
          await Store.sync();
          onComplete();
        } else {
          render();
        }
      };
    });
  }

  // ============ Router dispatcher ============
  async function render() {
    const path = parseRoute();
    closeModal();
    
    if (path !== "/" && path !== "") {
      await Store.sync();
    }

    if (path === "/" || path === "") return renderLanding();
    if (path === "/app" || path === "/app/") return viewInicio();
    if (path === "/app/membros") return viewMembros();
    if (path === "/app/cadastro") return viewCadastro();
    if (path === "/app/relatorios") return viewRelatorios();
    
    const m = path.match(/^\/app\/participante(?:\?id=(.+))?$/);
    if (m && m[1]) return viewPerfil(m[1]);
    
    renderLanding();
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("DOMContentLoaded", render);
  if (document.readyState !== "loading") render();
})();