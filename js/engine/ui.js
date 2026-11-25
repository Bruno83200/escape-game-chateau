// js/engine/ui.js — Interface Grimoire Enluminé Lumineux (modales, ateliers, grimoire, loupe, toasts)
import { ZONES, ITEM_CATALOG, CLUE_CATALOG, SCENE_ORDER, scenes } from "../data/scenes.js";
import { state } from "./state.js";

const CHOICE_ICONS = {
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 19l-7-7 7-7"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
  feather: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>`,
  scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3v18M5 7h14M5 7l-3 7h6l-3-7Zm14 0-3 7h6l-3-7ZM8 21h8"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  flask: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M9 3h6M10 3v6.5L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V3"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`
};

export function getChoiceIcon(name = "arrow") {
  return CHOICE_ICONS[name] || CHOICE_ICONS.arrow;
}

export function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// --- Toast parchemin ---
let toastTimer = null;
export function showToast(message) {
  const el = document.getElementById("folio-toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("is-shown");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-shown"), 3000);
}

// --- Bannière d'annonce d'Acte ---
let bannerTimer = null;
export function showZoneAnnouncement(zoneObj) {
  const box = document.getElementById("zone-announcement");
  const kicker = document.getElementById("zone-announcement-kicker");
  const title = document.getElementById("zone-announcement-title");
  if (!box || !zoneObj) return;
  kicker.textContent = `ACTE ${zoneObj.roman}`;
  title.textContent = zoneObj.name;
  box.classList.add("is-shown");
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => box.classList.remove("is-shown"), 2600);
}

// --- Visionneuse Loupe plein écran ---
export function openLightbox(imageSrc, caption = "") {
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-img");
  const cap = document.getElementById("lightbox-caption");
  const zoomBtn = document.getElementById("lightbox-zoom-toggle");
  if (!modal || !img) return;

  img.src = imageSrc;
  img.classList.remove("is-zoomed");
  cap.textContent = caption;
  modal.classList.add("is-open");

  const toggleZoom = () => img.classList.toggle("is-zoomed");
  img.onclick = toggleZoom;
  zoomBtn.onclick = toggleZoom;

  const close = () => {
    modal.classList.remove("is-open");
    img.classList.remove("is-zoomed");
  };
  document.getElementById("lightbox-close").onclick = close;
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };
}

// --- Modale Grimoire ---
export function showModal({
  title = "Note du Grimoire",
  kicker = "Sceau Pourpre",
  text = "",
  html = null,
  image = null,
  imageCaption = "",
  extraHtml = "",
  buttonText = "Continuer",
  onClose = null
}) {
  const backdrop = document.getElementById("custom-modal");
  const titleEl = document.getElementById("modal-title-text");
  const kickerEl = document.getElementById("modal-kicker");
  const bodyRow = document.getElementById("modal-body-row");
  const thumbWrap = document.getElementById("modal-thumb-wrap");
  const imgEl = document.getElementById("modal-illustration");
  const textEl = document.getElementById("modal-text");
  const extraEl = document.getElementById("modal-extra");
  const btnEl = document.getElementById("modal-btn");

  titleEl.textContent = title;
  kickerEl.textContent = kicker;
  textEl.innerHTML = html !== null ? html : `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
  extraEl.innerHTML = extraHtml;
  btnEl.textContent = buttonText;

  if (image) {
    thumbWrap.style.display = "block";
    imgEl.src = image;
    imgEl.alt = title;
    bodyRow.classList.remove("stacked");
    thumbWrap.onclick = () => openLightbox(image, imageCaption || title);
  } else {
    thumbWrap.style.display = "none";
    bodyRow.classList.add("stacked");
    thumbWrap.onclick = null;
  }

  backdrop.classList.add("is-open");
  btnEl.onclick = () => {
    backdrop.classList.remove("is-open");
    if (onClose) onClose();
  };
}

// --- Modale Artefact / Victoire d'Épreuve ---
export function showItemShowcase({
  title,
  text,
  image,
  kicker = "Placé dans votre Besace",
  buttonText = "Poursuivre",
  onClose = null
}) {
  const backdrop = document.getElementById("item-modal");
  const img = document.getElementById("item-modal-img");
  const media = document.getElementById("item-modal-media");
  const titleEl = document.getElementById("item-modal-title");
  const textEl = document.getElementById("item-modal-text");
  const tagEl = backdrop.querySelector(".folio-tag");
  const btn = document.getElementById("item-modal-btn");

  img.src = image;
  img.alt = title;
  titleEl.textContent = title;
  textEl.textContent = text;
  if (tagEl) tagEl.textContent = kicker;
  btn.textContent = buttonText;

  media.onclick = () => openLightbox(image, `${title} — ${text}`);

  backdrop.classList.add("is-open");
  btn.onclick = () => {
    backdrop.classList.remove("is-open");
    if (onClose) onClose();
  };
}

// --- Atelier Interactif ---
let workbenchCleanup = null;

export function openWorkbench({
  kicker = "Mécanisme du Donjon",
  title = "Épreuve du Château",
  instruction = "",
  hint = "",
  render,
  onClose = null
}) {
  closeWorkbench();

  const backdrop = document.getElementById("workbench-modal");
  const kickerEl = document.getElementById("workbench-kicker");
  const titleEl = document.getElementById("workbench-title");
  const instrEl = document.getElementById("workbench-instruction");
  const stageEl = document.getElementById("workbench-stage");
  const footerEl = document.getElementById("workbench-footer");
  const statusEl = document.getElementById("workbench-status");
  const hintBtn = document.getElementById("workbench-hint-btn");
  const hintBox = document.getElementById("workbench-hint-box");
  const closeBtn = document.getElementById("workbench-close");

  kickerEl.textContent = kicker;
  titleEl.textContent = title;
  instrEl.textContent = instruction;
  stageEl.innerHTML = "";
  footerEl.innerHTML = "";
  statusEl.textContent = "";
  statusEl.className = "workbench-status";
  hintBox.classList.remove("is-open");
  hintBox.textContent = hint || "";

  if (hint) {
    hintBtn.style.display = "inline-flex";
    hintBtn.onclick = () => hintBox.classList.toggle("is-open");
  } else {
    hintBtn.style.display = "none";
  }

  const api = {
    stage: stageEl,
    footer: footerEl,
    setStatus(msg, type = "info") {
      statusEl.textContent = msg;
      statusEl.className = `workbench-status is-${type}`;
    },
    clearStatus() {
      statusEl.textContent = "";
      statusEl.className = "workbench-status";
    },
    close() {
      closeWorkbench();
    },
    setCleanup(fn) {
      workbenchCleanup = fn;
    }
  };

  closeBtn.onclick = () => {
    closeWorkbench();
    if (onClose) onClose();
  };

  backdrop.classList.add("is-open");
  if (render) render(api);
  return api;
}

export function closeWorkbench() {
  if (workbenchCleanup) {
    try { workbenchCleanup(); } catch {}
    workbenchCleanup = null;
  }
  const backdrop = document.getElementById("workbench-modal");
  if (backdrop) backdrop.classList.remove("is-open");
}

// --- Rendu Besace ---
export function renderInventoryBar() {
  const container = document.getElementById("inventory-slots");
  if (!container) return;

  if (!state.inventory.length) {
    container.innerHTML = `<span class="inventory-empty">Votre besace est vide</span>`;
    return;
  }

  container.innerHTML = "";
  state.inventory.forEach((name) => {
    const info = ITEM_CATALOG[name] || { title: name, image: "", description: "Objet recueilli dans le donjon." };
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "inv-chip";
    pill.title = `${info.title} — Cliquer pour examiner`;
    pill.innerHTML = `
      ${info.image ? `<img src="${info.image}" alt="${escapeHtml(info.title)}" />` : ""}
      <span>${escapeHtml(info.title)}</span>
    `;
    pill.addEventListener("click", () => {
      showModal({
        title: info.title,
        kicker: "Objet de votre Besace",
        text: info.description,
        image: info.image || null,
        imageCaption: info.title,
        buttonText: "Fermer"
      });
    });
    container.appendChild(pill);
  });
}

// --- Boussole des 4 Actes ---
export function renderZoneStepper(activeZoneId) {
  const nav = document.getElementById("zone-stepper");
  if (!nav) return;
  nav.innerHTML = ZONES.map((z, idx) => {
    const cls = z.id === activeZoneId ? "is-active" : z.id < activeZoneId ? "is-done" : "";
    const conn = idx < ZONES.length - 1
      ? `<span class="zone-connector ${z.id < activeZoneId ? "is-done" : ""}" aria-hidden="true"></span>`
      : "";
    return `
      <div class="zone-step" title="Acte ${z.roman} · ${escapeHtml(z.name)}">
        <span class="zone-node ${cls}">${z.roman}. ${escapeHtml(z.name)}</span>
        ${conn}
      </div>
    `;
  }).join("");
}

export function updateJournalBadge() {
  const badge = document.getElementById("journal-badge");
  if (!badge) return;
  const count = state.discoveredClues.length;
  badge.textContent = String(count);
  badge.classList.toggle("has-items", count > 0);
}

// --- Grimoire des Indices (3 onglets) ---
let currentJournalTab = "clues";

export function initJournalModal() {
  const modal = document.getElementById("journal-modal");
  const btnOpen = document.getElementById("btn-journal");
  const btnClose = document.getElementById("journal-close");
  const tabs = modal.querySelectorAll(".journal-tab");

  btnOpen.addEventListener("click", () => {
    renderJournalContent(currentJournalTab);
    modal.classList.add("is-open");
  });

  btnClose.addEventListener("click", () => modal.classList.remove("is-open"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("is-open");
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentJournalTab = tab.dataset.jtab;
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      renderJournalContent(currentJournalTab);
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const lb = document.getElementById("lightbox-modal");
    if (lb && lb.classList.contains("is-open")) {
      lb.classList.remove("is-open");
      return;
    }
    if (modal.classList.contains("is-open")) {
      modal.classList.remove("is-open");
    }
  });
}

function renderJournalContent(tab) {
  const content = document.getElementById("journal-content");
  if (!content) return;

  if (tab === "clues") {
    if (!state.discoveredClues.length) {
      content.innerHTML = `<p class="journal-empty">Aucune enluminure n'a encore été consignée dans votre grimoire. Résolvez les épreuves du donjon pour y archiver chaque secret.</p>`;
      return;
    }
    const grid = document.createElement("div");
    grid.className = "clue-grid";
    state.discoveredClues.forEach((clueId) => {
      const clue = CLUE_CATALOG[clueId];
      if (!clue) return;
      const card = document.createElement("article");
      card.className = "clue-card";
      card.innerHTML = `
        <div class="clue-card-img"><img src="${clue.image}" alt="${escapeHtml(clue.title)}" /></div>
        <div class="clue-card-body">
          <h4>${escapeHtml(clue.title)}</h4>
          <p>${escapeHtml(clue.text)}</p>
        </div>
      `;
      card.querySelector(".clue-card-img").addEventListener("click", () => {
        openLightbox(clue.image, `${clue.title} — ${clue.text}`);
      });
      grid.appendChild(card);
    });
    content.innerHTML = "";
    content.appendChild(grid);
    return;
  }

  if (tab === "bag") {
    if (!state.inventory.length) {
      content.innerHTML = `<p class="journal-empty">Votre besace est vide pour le moment. Libérez-vous de la cellule pour recueillir vos premiers artefacts.</p>`;
      return;
    }
    const grid = document.createElement("div");
    grid.className = "clue-grid";
    state.inventory.forEach((name) => {
      const item = ITEM_CATALOG[name] || { title: name, image: "", description: "Objet du château." };
      const card = document.createElement("article");
      card.className = "clue-card";
      card.innerHTML = `
        ${item.image ? `<div class="clue-card-img"><img src="${item.image}" alt="${escapeHtml(item.title)}" /></div>` : ""}
        <div class="clue-card-body">
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.description)}</p>
        </div>
      `;
      const imgWrap = card.querySelector(".clue-card-img");
      if (imgWrap) {
        imgWrap.addEventListener("click", () => openLightbox(item.image, `${item.title} — ${item.description}`));
      }
      grid.appendChild(card);
    });
    content.innerHTML = "";
    content.appendChild(grid);
    return;
  }

  if (tab === "route") {
    const currentSceneObj = scenes[state.currentScene] || scenes["cellule"];
    const activeZone = currentSceneObj.zone;
    const currentIdx = SCENE_ORDER.indexOf(state.currentScene);

    const list = document.createElement("div");
    list.className = "route-timeline";

    ZONES.forEach((z) => {
      const isDone = z.id < activeZone || (z.id === 4 && state.currentScene === "victoire");
      const isCurrent = z.id === activeZone && state.currentScene !== "victoire";
      const statusCls = isDone ? "done" : isCurrent ? "current" : "locked";
      const statusTxt = isDone ? "Franchi" : isCurrent ? "En cours" : "Scellé";

      const zoneScenes = SCENE_ORDER.filter((id) => scenes[id]?.zone === z.id);
      const reachedSteps = zoneScenes.filter((id) => SCENE_ORDER.indexOf(id) <= currentIdx).length;

      const card = document.createElement("div");
      card.className = `route-zone-card ${isDone ? "is-done" : isCurrent ? "is-current" : ""}`;
      card.innerHTML = `
        <div class="route-zone-info">
          <h4>Acte ${z.roman} — ${escapeHtml(z.name)}</h4>
          <p>${escapeHtml(z.desc)} · <strong>${reachedSteps}/${zoneScenes.length} salles</strong></p>
        </div>
        <span class="route-status ${statusCls}">${statusTxt}</span>
      `;
      list.appendChild(card);
    });

    content.innerHTML = "";
    content.appendChild(list);
  }
}
