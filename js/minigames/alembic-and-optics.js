// js/minigames/alembic-and-optics.js — Épreuve 8 (Alambic : 5 Soufres) & Épreuve 9 (Miroirs : 50°)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

// --- ÉPREUVE 8 : L'ALAMBIC DE TRANSMUTATION (X = 5) ---
export function launchAlembicEquilibrium({ onSolved }) {
  openWorkbench({
    kicker: "Acte III · Laboratoire d'Alchimie",
    title: "Équilibrer l'Alambic de Transmutation",
    instruction: "Formule sur l'ardoise : [X] Soufre + 2 Mercures = 3 Essences (Soufre = 5, Mercure = 10, Essence = 15). Ajustez le nombre de doses de Soufre.",
    hint: "3 Essences = 3 × 15 = 45. 2 Mercures = 2 × 10 = 20. Il manque 25, soit 5 doses de Soufre (5 × 5 = 25) !",
    render(api) {
      let sulfur = 1;
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_zoom_alambic.webp" alt="Ardoise et alambic du laboratoire" id="alembic-ref" />
          <span>Soufre = 5 · Mercure = 10 · Essence = 15 → [X] Soufre + 2 Mercures = 3 Essences.</span>
        </div>

        <div class="mg-panel" style="text-align:center;">
          <div style="font-family:var(--font-display);font-size:1.15rem;color:var(--crimson-800);margin-bottom:14px;">
            <strong id="eq-x">1</strong> × Soufre (5) &nbsp;+&nbsp; 2 × Mercure (10) &nbsp;≟&nbsp; 3 × Essence (15)
          </div>
          <div class="mg-pills">
            <span class="mg-pill">Réactifs (gauche) : <strong id="eq-left">25</strong></span>
            <span class="mg-pill">Essences (droite) : <strong>45</strong></span>
            <span class="mg-pill" id="eq-state">État : <strong id="eq-diff">Instable (−20)</strong></span>
          </div>
        </div>

        <div class="slider-control-row">
          <button type="button" class="step-btn" id="sul-dec" aria-label="Retirer 1 dose">−</button>
          <input type="range" id="sul-slider" min="0" max="10" step="1" value="1" />
          <button type="button" class="step-btn" id="sul-inc" aria-label="Ajouter 1 dose">+</button>
          <span class="readout-badge" id="sul-badge">1 dose</span>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#alembic-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_zoom_alambic.webp", "Alambic et ardoise de transmutation");
      });

      const btnDistill = document.createElement("button");
      btnDistill.type = "button";
      btnDistill.className = "btn-crimson";
      btnDistill.textContent = "Lancer la Transmutation";
      api.footer.appendChild(btnDistill);

      const xEl = stage.querySelector("#eq-x");
      const leftEl = stage.querySelector("#eq-left");
      const diffEl = stage.querySelector("#eq-diff");
      const statePill = stage.querySelector("#eq-state");
      const slider = stage.querySelector("#sul-slider");
      const badge = stage.querySelector("#sul-badge");

      function update(val) {
        sulfur = Math.max(0, Math.min(10, val));
        slider.value = String(sulfur);
        xEl.textContent = String(sulfur);
        badge.textContent = `${sulfur} dose${sulfur > 1 ? "s" : ""}`;

        const left = sulfur * 5 + 20;
        const delta = left - 45;
        leftEl.textContent = String(left);
        if (delta === 0) {
          diffEl.textContent = "Équilibre parfait ✓";
        } else {
          diffEl.textContent = delta < 0 ? `Trop faible (${delta})` : `Surcharge (+${delta})`;
        }
        statePill.classList.toggle("is-ok", delta === 0);
      }

      slider.addEventListener("input", () => {
        if (locked) return;
        api.clearStatus();
        update(Number(slider.value));
      });
      stage.querySelector("#sul-dec").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("verre", 0.35);
        api.clearStatus();
        update(sulfur - 1);
      });
      stage.querySelector("#sul-inc").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("verre", 0.35);
        api.clearStatus();
        update(sulfur + 1);
      });

      btnDistill.addEventListener("click", () => {
        if (locked) return;
        if (sulfur === 5) {
          locked = true;
          sound.playSFX("spark", 0.7);
          api.setStatus("5 doses de Soufre ! Un éclat pourpre jaillit de l'alambic et cristallise l'énergie.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1100);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("Le mélange devient instable ! La quantité de Soufre est incorrecte.", "error");
        }
      });

      update(sulfur);
    }
  });
}

// --- ÉPREUVE 9 : LA TABLE D'OPTIQUE & LE TRIANGLE DE MIROIRS (50°) ---
export function launchOpticsMirrors({ onSolved }) {
  openWorkbench({
    kicker: "Acte III · Table d'Optique",
    title: "Clore le Triangle Lumineux",
    instruction: "« Deux angles à la base valent 65°. Clôt le triangle pour voir la vérité. » Orientez le miroir sommital à l'angle exact.",
    hint: "Dans tout triangle, la somme des trois angles vaut 180° : 180° − (65° + 65°) = 50°.",
    render(api) {
      let deg = 75;
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_zoom_miroirs.webp" alt="Disque des miroirs en laiton" id="opt-ref" />
          <span>Base du triangle : 65° + 65° = 130°. Quel angle ferme le sommet ?</span>
        </div>

        <div class="svg-stage-box">
          <svg viewBox="0 0 380 215" width="370" height="208" aria-label="Simulateur optique de triangle">
            <rect x="0" y="0" width="380" height="215" rx="8" fill="#171d28" />
            <!-- Triangle cible en pointillés -->
            <polygon points="190,26 92,184 288,184" fill="rgba(229,190,107,0.08)" stroke="rgba(229,190,107,0.38)" stroke-width="1.5" stroke-dasharray="5 4" />
            <!-- Rayon incident et réfléchi -->
            <line x1="92" y1="184" x2="190" y2="26" stroke="#f7dc88" stroke-width="3" />
            <line id="opt-beam" x1="190" y1="26" x2="320" y2="184" stroke="#f7dc88" stroke-width="3" stroke-linecap="round" />
            <line x1="92" y1="184" x2="288" y2="184" stroke="rgba(247,220,136,0.55)" stroke-width="2" />

            <!-- Miroirs de base (65° / 65°) -->
            <circle cx="92" cy="184" r="9" fill="#cb9738" stroke="#fff2c2" stroke-width="2" />
            <text x="116" y="176" fill="#e5be6b" font-family="Cinzel,serif" font-size="12" font-weight="700">65°</text>
            <circle cx="288" cy="184" r="11" fill="#741520" stroke="#e5be6b" stroke-width="2.5" id="opt-crystal" />
            <text x="242" y="176" fill="#e5be6b" font-family="Cinzel,serif" font-size="12" font-weight="700">65°</text>

            <!-- Miroir sommital orientable -->
            <circle cx="190" cy="26" r="10" fill="#cb9738" stroke="#fff2c2" stroke-width="2" />
            <text id="opt-top-txt" x="190" y="62" text-anchor="middle" fill="#fff2c2" font-family="Cinzel,serif" font-size="14" font-weight="700">75°</text>
          </svg>
        </div>

        <div class="mg-pills">
          <span class="mg-pill">Somme actuelle : <strong id="opt-sum">205°</strong></span>
          <span class="mg-pill">Objectif triangle : <strong>180°</strong></span>
        </div>

        <div class="slider-control-row">
          <button type="button" class="step-btn" id="opt-dec" aria-label="Diminuer de 1 degré">−</button>
          <input type="range" id="opt-slider" min="20" max="110" step="1" value="75" />
          <button type="button" class="step-btn" id="opt-inc" aria-label="Augmenter de 1 degré">+</button>
          <span class="readout-badge" id="opt-badge">75°</span>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#opt-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_zoom_miroirs.webp", "Disque gradué des miroirs optiques");
      });

      const btnAlign = document.createElement("button");
      btnAlign.type = "button";
      btnAlign.className = "btn-crimson";
      btnAlign.textContent = "Verrouiller le Miroir";
      api.footer.appendChild(btnAlign);

      const beam = stage.querySelector("#opt-beam");
      const crystal = stage.querySelector("#opt-crystal");
      const topTxt = stage.querySelector("#opt-top-txt");
      const sumEl = stage.querySelector("#opt-sum");
      const slider = stage.querySelector("#opt-slider");
      const badge = stage.querySelector("#opt-badge");

      function update(val) {
        deg = Math.max(20, Math.min(110, val));
        slider.value = String(deg);
        badge.textContent = `${deg}°`;
        topTxt.textContent = `${deg}°`;
        sumEl.textContent = `${130 + deg}°`;

        // À 50°, le rayon frappe exactement le cristal en (288, 184)
        const offset = (deg - 50) * 2.4;
        const x2 = Math.max(195, Math.min(372, 288 + offset));
        beam.setAttribute("x2", String(x2.toFixed(1)));
        const hit = deg === 50;
        beam.setAttribute("stroke", hit ? "#7bf0c2" : "#f7dc88");
        crystal.setAttribute("fill", hit ? "#298260" : "#741520");
      }

      slider.addEventListener("input", () => {
        if (locked) return;
        api.clearStatus();
        update(Number(slider.value));
      });
      stage.querySelector("#opt-dec").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("miroir", 0.35);
        api.clearStatus();
        update(deg - 1);
      });
      stage.querySelector("#opt-inc").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("miroir", 0.35);
        api.clearStatus();
        update(deg + 1);
      });

      btnAlign.addEventListener("click", () => {
        if (locked) return;
        if (deg === 50) {
          locked = true;
          sound.playSFX("miroir", 0.7);
          api.setStatus("50° ! Le faisceau frappe le cristal central et libère la Lentille d'Obsidienne.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("Le rayon se perd dans l'obscurité. L'angle du sommet est erroné.", "error");
        }
      });

      update(deg);
    }
  });
}
