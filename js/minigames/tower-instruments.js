// js/minigames/tower-instruments.js — Épreuves 11 (Contrepoids : 80), 12 (Horloge : 8) & 13 (Console H2O : H)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

// --- ÉPREUVE 11 : CONTREPOIDS DE L'ASCENSEUR (SOLEIL = 80) ---
export function launchTowerWeights({ onSolved }) {
  openWorkbench({
    kicker: "Acte IV · L'Ascenseur de la Grande Tour",
    title: "Équilibrer les Contrepoids de Laiton",
    instruction: "« Le Soleil vaut la Lune et l'Étoile. La Lune est triple de l'Étoile. Le tout pèse 160. » Réglez le curseur du Soleil.",
    hint: "Puisque Soleil = Lune + Étoile et que Soleil + Lune + Étoile = 160, le Soleil vaut exactement 160 ÷ 2 = 80 (Lune = 60, Étoile = 20).",
    render(api) {
      let soleil = 40;
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_zoom_poids.webp" alt="Panneau des trois curseurs en laiton" id="w-ref" />
          <span>Soleil = Lune + Étoile · Lune = 3 × Étoile · Total = 160.</span>
        </div>

        <div class="brass-sliders">
          <div class="brass-col">
            <h4>☀ Soleil</h4>
            <div class="brass-big" id="w-soleil">40</div>
            <span style="font-size:0.74rem;color:var(--ink-500);">Curseur principal</span>
          </div>
          <div class="brass-col">
            <h4>☽ Lune (¾)</h4>
            <div class="brass-big" id="w-lune">30</div>
            <span style="font-size:0.74rem;color:var(--ink-500);">Triple de l'Étoile</span>
          </div>
          <div class="brass-col">
            <h4>★ Étoile (¼)</h4>
            <div class="brass-big" id="w-etoile">10</div>
            <span style="font-size:0.74rem;color:var(--ink-500);">Base d'équilibre</span>
          </div>
        </div>

        <div class="mg-pills">
          <span class="mg-pill" id="w-total-pill">Total actuel : <strong id="w-total">80 / 160</strong></span>
        </div>

        <div class="slider-control-row">
          <button type="button" class="step-btn" id="w-dec" aria-label="Diminuer de 4">−</button>
          <input type="range" id="w-slider" min="20" max="120" step="4" value="40" />
          <button type="button" class="step-btn" id="w-inc" aria-label="Augmenter de 4">+</button>
          <span class="readout-badge" id="w-badge">40</span>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#w-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_zoom_poids.webp", "Curseurs de contrepoids : Soleil, Lune et Étoile");
      });

      const btnLift = document.createElement("button");
      btnLift.type = "button";
      btnLift.className = "btn-crimson";
      btnLift.textContent = "Engager l'Ascenseur";
      api.footer.appendChild(btnLift);

      const sEl = stage.querySelector("#w-soleil");
      const lEl = stage.querySelector("#w-lune");
      const eEl = stage.querySelector("#w-etoile");
      const totEl = stage.querySelector("#w-total");
      const totPill = stage.querySelector("#w-total-pill");
      const slider = stage.querySelector("#w-slider");
      const badge = stage.querySelector("#w-badge");

      function update(val) {
        soleil = Math.max(20, Math.min(120, val));
        slider.value = String(soleil);
        const etoile = soleil / 4;
        const lune = etoile * 3;
        const total = soleil + lune + etoile;

        sEl.textContent = String(soleil);
        lEl.textContent = String(lune);
        eEl.textContent = String(etoile);
        badge.textContent = String(soleil);
        totEl.textContent = `${total} / 160`;
        totPill.classList.toggle("is-ok", total === 160);
      }

      slider.addEventListener("input", () => {
        if (locked) return;
        api.clearStatus();
        update(Number(slider.value));
      });
      stage.querySelector("#w-dec").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("engrenage", 0.35);
        api.clearStatus();
        update(soleil - 4);
      });
      stage.querySelector("#w-inc").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("engrenage", 0.35);
        api.clearStatus();
        update(soleil + 4);
      });

      btnLift.addEventListener("click", () => {
        if (locked) return;
        if (soleil === 80) {
          locked = true;
          sound.playSFX("mecanisme", 0.65);
          api.setStatus("Soleil = 80, Lune = 60, Étoile = 20 → Total 160 ! L'ascenseur s'ébranle vers le sommet.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1100);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("Les contrepoids refusent de bouger. L'équilibre total doit atteindre 160.", "error");
        }
      });

      update(soleil);
    }
  });
}

// --- ÉPREUVE 12 : L'HORLOGE ASTRONOMIQUE (CADRAN 12 SIGNES → 8) ---
export function launchAstroClock({ onSolved }) {
  openWorkbench({
    kicker: "Acte IV · L'Horloge Astronomique",
    title: "Impulsions Solaires sur les 12 Signes",
    instruction: "« Le Soleil part du 12 et avance de 5 crans par impulsion. » Envoyez les impulsions (ou cliquez sur le signe d'arrivée) pour trouver où il s'arrête après 4 impulsions.",
    hint: "4 impulsions × 5 crans = 20 crans. En faisant le tour du cadran de 12 signes : 12 → 5 → 10 → 3 → 8 (VIII) !",
    render(api) {
      let position = 12; // 1..12
      let impulses = 0;
      let locked = false;

      const romans = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="svg-stage-box" style="max-width:340px;">
          <svg viewBox="0 0 280 280" width="266" height="266" aria-label="Horloge astronomique à 12 signes">
            <circle cx="140" cy="140" r="130" fill="#181c24" stroke="#cb9738" stroke-width="4" />
            <circle cx="140" cy="140" r="96" fill="#232833" stroke="rgba(229,190,107,0.45)" stroke-width="1.5" />
            <g id="clock-marks"></g>
            <!-- Aiguille du Soleil -->
            <g id="sun-hand" style="transform-origin:140px 140px;transition:transform 0.55s cubic-bezier(0.22,1,0.36,1);">
              <line x1="140" y1="140" x2="140" y2="54" stroke="#e5be6b" stroke-width="4" stroke-linecap="round" />
              <circle cx="140" cy="52" r="11" fill="#e5be6b" stroke="#741520" stroke-width="2" />
            </g>
            <circle cx="140" cy="140" r="11" fill="#741520" stroke="#e5be6b" stroke-width="2.5" />
          </svg>
        </div>

        <div class="mg-pills">
          <span class="mg-pill">Signe actuel : <strong id="clk-pos">12 (XII)</strong></span>
          <span class="mg-pill">Impulsions (+5 crans) : <strong id="clk-imp">0</strong></span>
        </div>

        <div class="rune-keyboard" id="clk-direct"></div>
      `;
      api.stage.appendChild(stage);

      const btnImpulse = document.createElement("button");
      btnImpulse.type = "button";
      btnImpulse.className = "btn-vellum";
      btnImpulse.textContent = "Impulsion (+5 crans)";

      const btnReset = document.createElement("button");
      btnReset.type = "button";
      btnReset.className = "btn-vellum";
      btnReset.textContent = "Remettre sur 12";

      const btnValidate = document.createElement("button");
      btnValidate.type = "button";
      btnValidate.className = "btn-crimson";
      btnValidate.textContent = "Valider cette Position";

      api.footer.append(btnReset, btnImpulse, btnValidate);

      const marksG = stage.querySelector("#clock-marks");
      const hand = stage.querySelector("#sun-hand");
      const posEl = stage.querySelector("#clk-pos");
      const impEl = stage.querySelector("#clk-imp");
      const directWrap = stage.querySelector("#clk-direct");

      for (let i = 0; i < 12; i++) {
        const ang = (i * 30 - 90) * (Math.PI / 180);
        const tx = 140 + 112 * Math.cos(ang);
        const ty = 140 + 112 * Math.sin(ang) + 4;
        marksG.innerHTML += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" fill="#f3dc9a" font-family="Cinzel,serif" font-size="11" font-weight="700">${romans[i]}</text>`;
      }

      let visualDeg = 0;

      function refresh() {
        hand.style.transform = `rotate(${visualDeg}deg)`;
        const idx = position % 12;
        posEl.textContent = `${position} (${romans[idx]})`;
        impEl.textContent = String(impulses);
        directWrap.querySelectorAll(".rune-key").forEach((b) => {
          b.classList.toggle("is-active", Number(b.dataset.n) === position);
        });
      }

      for (let n = 1; n <= 12; n++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "rune-key";
        b.dataset.n = String(n);
        b.textContent = String(n);
        b.addEventListener("click", () => {
          if (locked) return;
          position = n;
          visualDeg = (n % 12) * 30;
          sound.playSFX("engrenage", 0.4);
          api.clearStatus();
          refresh();
        });
        directWrap.appendChild(b);
      }

      btnImpulse.addEventListener("click", () => {
        if (locked) return;
        impulses += 1;
        position = ((position + 5 - 1) % 12) + 1;
        visualDeg += 150; // 5 crans × 30°
        sound.playSFX("engrenage", 0.55);
        api.clearStatus();
        refresh();
      });

      btnReset.addEventListener("click", () => {
        if (locked) return;
        position = 12;
        impulses = 0;
        visualDeg = 0;
        api.clearStatus();
        refresh();
      });

      btnValidate.addEventListener("click", () => {
        if (locked) return;
        if (position === 8) {
          locked = true;
          sound.playSFX("engrenage", 0.7);
          api.setStatus("Signe VIII (8) ! Les rouages dorés s'alignent et ouvrent un compartiment secret.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus(`L'aiguille sur ${position} tremble mais revient à sa place. Le calcul est faux.`, "error");
        }
      });

      refresh();
    }
  });
}

// --- ÉPREUVE 13 : CONSOLE DE CONDENSATION DE L'OBSERVATOIRE (H₂O → H) ---
export function launchWaterCondenser({ onSolved }) {
  openWorkbench({
    kicker: "Acte IV · L'Observatoire sous les Toits",
    title: "Condenser la Vapeur (Formule de l'Eau)",
    instruction: "L'Oxygène (O) est déjà ouvert. Sélectionnez l'élément chimique le plus léger à injecter deux fois pour former la molécule d'eau.",
    hint: "La molécule d'eau s'écrit H₂O : il faut injecter deux fois l'Hydrogène (symbole H).",
    render(api) {
      let chosen = null;
      let locked = false;

      const elements = [
        { sym: "H", name: "Hydrogène" },
        { sym: "C", name: "Carbone" },
        { sym: "N", name: "Azote" },
        { sym: "S", name: "Soufre" },
        { sym: "He", name: "Hélium" },
        { sym: "Fe", name: "Fer" }
      ];

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_zoom_formule.webp" alt="Console vapeur Oxygène et Hydrogène" id="h2o-ref" />
          <span>Console de pression — cliquez sur la plaque pour ouvrir à la loupe.</span>
        </div>

        <div class="molecule-banner" id="mol-display">?₂ O</div>

        <div class="valves-grid" id="valves-grid"></div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#h2o-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_zoom_formule.webp", "Console de condensation de l'Observatoire");
      });

      const btnInject = document.createElement("button");
      btnInject.type = "button";
      btnInject.className = "btn-crimson";
      btnInject.textContent = "Ouvrir la Vanne (×2)";
      btnInject.disabled = true;
      api.footer.appendChild(btnInject);

      const molDisplay = stage.querySelector("#mol-display");
      const grid = stage.querySelector("#valves-grid");

      elements.forEach((el) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "valve-btn";
        b.innerHTML = `<strong>${el.sym}</strong><span>${el.name}</span>`;
        b.addEventListener("click", () => {
          if (locked) return;
          chosen = el.sym;
          molDisplay.textContent = `${el.sym}₂ O`;
          btnInject.disabled = false;
          sound.playSFX("engrenage", 0.4);
          api.clearStatus();
          grid.querySelectorAll(".valve-btn").forEach((x) => x.classList.remove("is-active"));
          b.classList.add("is-active");
        });
        grid.appendChild(b);
      });

      btnInject.addEventListener("click", () => {
        if (locked || !chosen) return;
        if (chosen === "H") {
          locked = true;
          sound.playSFX("gaz", 0.7);
          api.setStatus("H₂O ! La vapeur se condense instantanément et fait éclater le verrou givré.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1100);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus(`${chosen}₂O reste gazeux ! L'élément injecté ne forme pas la molécule d'eau.`, "error");
        }
      });
    }
  });
}
