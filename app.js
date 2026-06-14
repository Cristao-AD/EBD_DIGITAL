/* EBD Digital - Vanilla JS app com Firebase Auth & Relatórios PDF */
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

  const IMG_SAQUINHO = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4b0/512.png";
  
  // 🚀 COLOQUE O LINK DO SEU SERVIDOR DO RENDER AQUI NESTA LINHA:
  const URL_BACKEND_EMAIL = "https://SEU-PROJETO.onrender.com/api/enviar-relatorio"; 

  let timerRelatorioEmail = null;

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
    trash: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    avatar: `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    save: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    mail: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`
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

  // ============ Store (Gerenciamento de Dados) ============
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

    getContagemPresencas(membroId) {
      return state.presencas.filter(p => p.participanteId === membroId).length;
    },

    async login(email, senha) {
      try {
        await signInWithEmailAndPassword(auth, email, senha);
        return { ok: true };
      } catch (error) {
        return { ok: false, msg: "E-mail ou senha incorretos." };
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
      const docRef = await addDoc(collection(db, "participantes"), novo);
      
      if (p.presencasIniciais && p.presencasIniciais > 0) {
        for (let i = 0; i < p.presencasIniciais; i++) {
          await addDoc(collection(db, "presencas"), { participanteId: docRef.id, data: `antigo-registro-${i}` });
        }
      }
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
        this.agendarEnvioRelatorioAutomatico(); // 👈 Cronômetro inteligente ativado
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

    async alterarContagemPresencasManual(id, qtd, acao) {
      try {
        if (acao === "add") {
          for (let i = 0; i < qtd; i++) {
            await addDoc(collection(db, "presencas"), { participanteId: id, data: `manual-ajuste-${Date.now()}-${i}` });
          }
        } else {
          const docsAtuais = state.presencas.filter(p => p.participanteId === id).slice(0, qtd);
          for (const docP of docsAtuais) {
            await deleteDoc(doc(db, "presencas", docP.id));
          }
        }
        await this.sync();
      } catch(e) { console.error(e); }
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

    // ⏱️ GESTÃO DE AGENDAMENTO AUTOMÁTICO (Reseta e agenda 1h de espera após cada chamada)
    agendarEnvioRelatorioAutomatico() {
      if (timerRelatorioEmail) {
        clearTimeout(timerRelatorioEmail);
      }
      console.log("Chamada efetuada. Relatório em background agendado para rodar em 1 hora.");
      timerRelatorioEmail = setTimeout(async () => {
        await this.dispararEmailRelatorio(true);
      }, 3600000); 
    },

    // 📧 FUNÇÃO INTEGRADA DE ENVIO (Aceita gatilho manual via botão ou automático de 1h)
    async dispararEmailRelatorio(isAutomatico = false) {
      if (!isAutomatico) toast("Enviando relatório para o e-mail...");
      
      const payload = state.participantes.map(m => ({
        nome: m.nome,
        talentos: m.talentos,
        presencas: this.getContagemPresencas(m.id)
      }));

      try {
        const response = await fetch(URL_BACKEND_EMAIL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email_destino: "danilolex5@gmail.com", dados: payload })
        });

        if (response.ok) {
          if (!isAutomatico) toast.success("Relatório enviado com sucesso!");
        } else {
          if (!isAutomatico) toast.warning("Verifique a configuração SMTP no painel do Render.");
        }
      } catch (err) {
        console.error("Falha na comunicação com o Render.");
        if (!isAutomatico) toast.error("Servidor indisponível. Confira os logs no painel do Render.");
      }
    }
  };

  // ============ Toast ============
  function toast(msg, type = "default") {
    const c = document.getElementById("toast-container");
    const t = document.createElement("div");
    t.className = "toast " + type;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; }, 2500);
    setTimeout(() => t.remove(), 2900);
  }
  toast.success = (m) => toast(m, "success");
  toast.error = (m) => toast(m, "error");
  toast.warning = (m) => toast(m, "warning");

  function parseRoute() { return location.hash.replace(/^#/, "") || "/"; }
  function navigate(path) { location.hash = path; }

  // ============ Modal ============
  function openModal(contentHTML, onMount) {
    const root = document.getElementById("modal-root");
    root.innerHTML = `<div class="modal-overlay" data-close><div class="modal" role="dialog">${contentHTML}</div></div>`;
    root.querySelector(".modal-overlay").addEventListener("click", (e) => { if (e.target.dataset.close !== undefined) closeModal(); });
    if (onMount) onMount(root.querySelector(".modal"));
  }
  function closeModal() { document.getElementById("modal-root").innerHTML = ""; }

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
        </div>
        <button class="btn btn-md" id="adm-enter">Entrar</button>
      </div>
    `, (modal) => {
      const inp = modal.querySelector("#adm-pass");
      const submit = async () => {
        if (!inp.value) return toast.error("Digite a senha.");
        const r = await Store.login("danilolex5@gmail.com", inp.value);
        if (r.ok) { closeModal(); toast.success("Bem-vindo!"); navigate("/app"); } 
        else { toast.error(r.msg); }
      };
      modal.querySelector("#adm-enter").onclick = submit;
    });
  }

  function renderAppShell(currentPath, contentHTML) {
    const isAdmin = Store.get().isAdmin;
    const items = [
      { to: "/", label: "Início", icon: ICONS.home },
      { to: "/app/membros", label: "Membros", icon: ICONS.users },
    ];
    if (isAdmin) items.push({ to: "/app/cadastro", label: "Cadastro", icon: ICONS.userPlus });
    items.push({ to: "/app/relatorios", label: "Relatório", icon: ICONS.chart });

    const nav = items.map((it) => {
      const isHomeActive = (it.to === "/" && (currentPath === "/" || currentPath === ""));
      const isMembrosActive = (it.to === "/app/membros" && (currentPath === "/app/membros" || currentPath === "/app"));
      const isOtherActive = (it.to !== "/" && it.to !== "/app/membros" && currentPath.startsWith(it.to));
      
      const active = isHomeActive || isMembrosActive || isOtherActive;

      const estiloAtivo = active 
        ? `background-color: rgba(41, 80, 194, 0.12); color: var(--primary) !important; font-weight: 600; border-radius: 12px; padding: 6px 16px;` 
        : `color: var(--muted-foreground); padding: 6px 16px;`;

      return `
        <a href="#${it.to}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; ${estiloAtivo}">
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
    const totalPresencas = Store.getContagemPresencas(p.id);
    
    const badgeHTML = `
      <div style="display: flex; gap: 6px; align-items: center;">
        <span class="talent-badge" style="background: #e7edff; color: var(--primary); display: inline-flex; align-items: center; gap: 4px; padding: 0.3rem 0.6rem;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; color: var(--primary); stroke-width: 2.5;">${ICONS.user}</span>
          <span>${totalPresencas}</span>
        </span>
        <span class="talent-badge">
          <img src="${IMG_SAQUINHO}" alt="💰" style="width: 14px; height: 14px; margin-right: 3px;" />
          <span>${p.talentos}</span>
        </span>
      </div>
    `;

    if (!isAdmin) {
      return `
        <div class="member-card card link-perfil-card" data-id="${p.id}" style="cursor: pointer;">
          <div class="member-head">
            <div style="min-width:0;">
              <h3 class="member-name">${escapeHtml(p.nome)}</h3>
              ${p.classe ? `<p class="member-class">${escapeHtml(p.classe)}</p>` : ""}
            </div>
            ${badgeHTML}
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
          ${badgeHTML}
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
    container.querySelectorAll("[data-presenca]").forEach((btn) => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const r = await Store.registrarPresenca(btn.dataset.presenca);
        if (r.ok) {
          toast.success(r.msg);
        } else {
          toast.warning(r.msg);
        }
        viewInicio();
      };
    });

    container.querySelectorAll(".btn-editar-card").forEach((btn) => {
      btn.onclick = (e) => { e.stopPropagation(); navigate(`/app/participante?id=${btn.dataset.id}`); };
    });

    container.querySelectorAll(".link-perfil-card").forEach((elemento) => {
      elemento.onclick = () => { navigate(`/app/participante?id=${elemento.dataset.id}`); };
    });
  }

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
            <div class="stat-label">Talentos Geral</div>
          </div>
        </div>
        
        ${s.isAdmin ? `<button id="btn-disparar-email-instantneo" class="btn btn-outline" style="gap:8px; justify-content:center; border-color:var(--primary); color:var(--primary); font-weight:700;">${ICONS.mail} Disparar PDF para o E-mail</button>` : ""}

        <div class="search-wrap">
          <span class="icon-search" style="position: absolute; top: 50%; left: 0.75rem; transform: translateY(-50%); color: var(--muted-foreground); display: inline-flex;">${ICONS.search}</span>
          <input id="q" class="input" placeholder="Pesquisar por nome..." value="${escapeHtml(filtroQ)}" style="padding-left: 2.25rem;" autocomplete="off" />
        </div>
        <div id="list" class="row-gap"></div>
      </div>
    `;
    
    renderAppShell(parseRoute().startsWith("/app/membros") ? "/app/membros" : "/app", html);

    if (s.isAdmin) {
      document.getElementById("btn-disparar-email-instantneo").onclick = () => Store.dispararEmailRelatorio(false);
    }

    const q = document.getElementById("q");
    const listContainer = document.getElementById("list");

    const renderizarListaFiltrada = () => {
      const termo = q.value.toLowerCase().trim();
      const filtrados = s.participantes.filter((p) => p.nome.toLowerCase().includes(termo));
      listContainer.innerHTML = filtrados.length === 0 ? `<p class="empty">Nenhum participante encontrado.</p>` : filtrados.map((p) => memberCardHTML(p, s.isAdmin)).join("");
      attachMemberCardHandlers(listContainer);
    };

    renderizarListaFiltrada();
    q.oninput = () => { sessionStorage.setItem("q-inicio", q.value); renderizarListaFiltrada(); };
  }

  function viewMembros() { viewInicio(); }

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
            <label>Classe EBD</label>
            <select id="classe" class="select">
              <option value="">Selecione...</option>
              ${CLASSES.map((c) => `<option value="${c}">${c}</option>`).join("")}
            </select>
          </div>
          <div class="grid-2">
            <div class="field">
              <label>Talentos Iniciais</label>
              <input id="talentos" type="number" min="0" value="0" class="input" />
            </div>
            <div class="field">
              <label>Presenças Iniciais</label>
              <input id="presencas-ini" type="number" min="0" value="0" class="input" />
            </div>
          </div>
          <button type="submit" class="btn btn-md">${ICONS.save} Salvar</button>
        </form>
      </div>
    `);
    document.getElementById("form-cad").onsubmit = async (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      if (!nome) return toast.error("Informe o nome.");
      const classe = document.getElementById("classe").value || undefined;
      const talentos = parseInt(document.getElementById("talentos").value, 10) || 0;
      const presencasIniciais = parseInt(document.getElementById("presencas-ini").value, 10) || 0;
      
      await Store.addParticipante({ nome, classe, talentos, presencasIniciais });
      toast.success("Membro Cadastrado!");
      navigate("/app");
    };
  }

  function viewPerfil(id) {
    const s = Store.get();
    const p = s.participantes.find((x) => x.id === id);
    if (!p) { navigate("/app"); return; }
    
    const isAdmin = s.isAdmin;
    const totalPresencas = Store.getContagemPresencas(id);
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
      <div class="action-block" style="display:flex; flex-direction:column; gap:12px;">
        <div style="background:#f4f5f7; border-radius:12px; padding:12px;">
          <div style="font-weight:600; margin-bottom:6px; font-size:0.9rem;">Gestão de Presenças</div>
          ${jaPresente ? `
            <button id="btn-cancelar-presenca" class="btn btn-destructive" style="background-color: #dc2626; color: white; width:100%;">❌ Cancelar Presença de Hoje</button>
          ` : `
            <button id="btn-presenca" class="btn" style="width:100%;">${ICONS.check} Registrar Chamada de Hoje (+1)</button>
          `}
        </div>

        <div style="background:#f4f5f7; border-radius:12px; padding:12px;">
  <div style="font-weight:600; margin-bottom:8px; font-size:0.9rem;">Ajuste de Presenças</div>
  <div class="grid-2">
    <button id="btn-add-presencas-lote" class="btn" style="background-color: var(--primary); color: white; font-size:0.85rem; display: flex; align-items: center; justify-content: center; gap: 4px;">
      ${ICONS.plus} Presenças
    </button>
    <button id="btn-rem-presencas-lote" class="btn btn-outline-danger" style="font-size:0.85rem;">
      ${ICONS.minus} Presenças
    </button>
  </div>
</div>

        <div style="background:#f4f5f7; border-radius:12px; padding:12px;">
          <div style="font-weight:600; margin-bottom:8px; font-size:0.9rem;">Ajuste de Talentos</div>
          <div class="grid-2">
            <button id="btn-add" class="btn btn-flame">${ICONS.plus} Talentos</button>
            <button id="btn-rem" class="btn btn-outline-danger">${ICONS.minus} Talentos</button>
          </div>
        </div>
      </div>
    ` : "";

    const deleteHTML = isAdmin ? `
  <button id="btn-del" class="btn btn-md" style="margin-top: 1rem; width: 100%; font-weight: 700; background-color: rgba(220, 38, 38, 0.1); color: #dc2626; border: 1px solid rgba(220, 38, 38, 0.2); gap: 8px; justify-content: center;">
    ${ICONS.trash} Eliminar membro do sistema
  </button>
` : "";

    renderAppShell("/app/participante", `
      <div class="row-gap">
        <a href="#/app" class="back-btn">${ICONS.arrowLeft} Voltar</a>
        <div class="card profile-head">
          <div class="avatar">${ICONS.avatar}</div>
          <div>${headHTML}</div>
          
          <div style="display:flex; justify-content:space-around; width:100%; margin-top:15px; border-top:1px solid var(--border); padding-top:10px;">
            <div class="profile-stats" style="text-align:center;">
              <div class="tn" style="color: var(--primary); font-size:1.4rem; font-weight:700; display:inline-flex; align-items:center; gap:4px;">
                <span style="display:inline-flex; width:16px; height:16px; color:var(--primary); stroke-width:3;">${ICONS.user}</span>
                <span>${totalPresencas}</span>
              </div>
              <div class="lb">Presenças</div>
            </div>
            <div class="profile-stats" style="text-align:center;">
              <div class="tn" style="color: var(--talent-foreground); font-size:1.4rem; font-weight:700;">
                <img src="${IMG_SAQUINHO}" alt="💰" style="width: 22px; height: 22px; vertical-align:middle;" /> ${p.talentos}
              </div>
              <div class="lb">Talentos</div>
            </div>
          </div>
        </div>
        ${actionsHTML}
        ${deleteHTML}
      </div>
    `);

    if (isAdmin) {
      const nomeInp = document.getElementById("edit-nome");
      document.getElementById("btn-pencil").onclick = () => { nomeInp.readOnly = false; nomeInp.classList.add("unlocked"); nomeInp.focus(); };
      nomeInp.onblur = async () => {
        if (nomeInp.value.trim() && nomeInp.value.trim() !== p.nome) {
          await Store.updateParticipante(id, { nome: nomeInp.value.trim() });
          toast.success("Nome atualizado!");
        }
        nomeInp.readOnly = true; nomeInp.classList.remove("unlocked");
        viewPerfil(id);
      };

      document.getElementById("edit-classe").onchange = async (e) => {
        await Store.updateParticipante(id, { classe: e.target.value || "" });
        toast.success("Classe salva!");
        viewPerfil(id);
      };

      if (!jaPresente) {
        document.getElementById("btn-presenca").onclick = async () => {
          const r = await Store.registrarPresenca(id);
          if(r.ok) { toast.success(r.msg); }
          viewPerfil(id);
        };
      } else {
        document.getElementById("btn-cancelar-presenca").onclick = async () => {
          if (confirm("Estornar presença de hoje?")) { await Store.cancelarPresenca(id); viewPerfil(id); }
        };
      }

      document.getElementById("btn-add").onclick = () => openBatchDialog("talentos", "add", id, () => viewPerfil(id));
      document.getElementById("btn-rem").onclick = () => openBatchDialog("talentos", "rem", id, () => viewPerfil(id));
      document.getElementById("btn-add-presencas-lote").onclick = () => openBatchDialog("presencas", "add", id, () => viewPerfil(id));
      document.getElementById("btn-rem-presencas-lote").onclick = () => openBatchDialog("presencas", "rem", id, () => viewPerfil(id));
      
      document.getElementById("btn-del").onclick = async () => {
        if (confirm(`Deseja realmente apagar ${p.nome} definitivamente da EBD?`)) { 
          await Store.removeParticipante(id); 
          toast.success("Membro excluído."); 
          navigate("/app"); 
        }
      };
    }
  }

  function openBatchDialog(alvo, acao, id, onComplete) {
    const isTalento = alvo === "talentos";
    const isAdd = acao === "add";
    const titulo = `${isAdd ? "Adicionar" : "Remover"} ${isTalento ? "Talentos" : "Presenças"}`;

    openModal(`
      <div class="modal-title">${titulo}</div>
      <div class="modal-body">
        <div class="field">
          <label>Quantidade de ${isTalento ? "Talentos" : "Presenças"}</label>
          <input id="batch-qtd" type="number" min="1" value="1" class="input" />
        </div>
        ${isTalento && isAdd ? `
        <div class="field"><label>Motivo</label>
          <select id="batch-motivo" class="select">${MOTIVOS.map(m => `<option>${m}</option>`).join("")}</select>
        </div>` : ""}
        <button class="btn btn-md ${isAdd ? "" : "btn-destructive"}" id="batch-confirm">Aplicar Alterações</button>
      </div>
    `, (modal) => {
      modal.querySelector("#batch-confirm").onclick = async () => {
        const qtd = parseInt(modal.querySelector("#batch-qtd").value, 10);
        if (!qtd || qtd < 1) return toast.error("Valor inválido.");

        if (isTalento) {
          if (isAdd) {
            const m = modal.querySelector("#batch-motivo").value;
            await Store.adicionarTalentos(id, qtd, m);
          } else {
            await Store.removerTalentos(id, qtd, "Ajuste manual");
          }
        } else {
          await Store.alterarContagemPresencasManual(id, qtd, acao);
          toast.success("Contador de presenças atualizado!");
        }
        
        closeModal();
        if (onComplete) onComplete();
      };
    });
  }

  function viewRelatorios() {
    const s = Store.get();
    const totalTal = s.participantes.reduce((a, b) => a + b.talentos, 0);
    const topCincoMembros = [...s.participantes].sort((a, b) => b.talentos - a.talentos).slice(0, 5);

    renderAppShell("/app/relatorios", `
      <div class="row-gap">
        <div class="title-row">${ICONS.chart}<h1 class="section-title">Relatório</h1></div>
        <div class="grid-2">
          <div class="stat-card">
            <div class="stat-icon primary">${ICONS.users}</div>
            <div class="stat-value">${s.participantes.length}</div>
            <div class="stat-label">Membros ativos</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon talent" style="background:var(--talent-bg); display:flex; align-items:center; justify-content:center;">
              <img src="${IMG_SAQUINHO}" alt="💰" style="width:20px; height:20px;"/>
            </div>
            <div class="stat-value">${totalTal}</div>
            <div class="stat-label">Talentos</div>
          </div>
        </div>

        <div class="card section-card" style="margin-top: 0.5rem;">
          <h2 style="font-size:1rem; margin-bottom:12px; font-weight:700; color:var(--foreground);">🏆 Ranking: Top 5 Maiores Talentos</h2>
          <div class="row-gap" style="gap: 2px;">
            ${topCincoMembros.map((p, index) => `
              <div class="report-row" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                  <span class="report-pos" style="background: var(--accent); color: var(--primary); width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">${index + 1}</span>
                  <span class="report-name" style="font-weight: 600; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(p.nome)}</span>
                </div>
                <span class="report-val" style="display: inline-flex; align-items: center; gap: 4px; font-weight: 700; color: var(--talent-foreground);">
                  <span>${p.talentos}</span>
                  <img src="${IMG_SAQUINHO}" alt="💰" style="width: 15px; height: 14px; vertical-align: middle;" />
                </span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `);
  }

  // ============ Router dispatcher ============
  async function render() {
    const path = parseRoute();
    closeModal();
    if (path !== "/" && path !== "") await Store.sync();

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
})();