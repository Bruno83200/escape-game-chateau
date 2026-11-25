// js/minigames/guards-and-bridge.js — Épreuve 14 (Rondes des Gardes : 12 min) & Épreuve 15 (Pont-Levis : 3·2·1)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

// --- ÉPREUVE 14 : SYNCHRONISATION DES RONDES DES GARDES (PPCM 4 & 6 = 12 min) ---
export function launchGuardsPatrolSync({ onSolved }) {
  openWorkbench({
    kicker: "Acte IV · Le Chemin de Ronde",
    title: "Chronographe des Rondes",
    instruction: "Le premier garde passe toutes les 4 minutes, le second toutes les 6 minutes. Réglez le sablier sur la minute exacte de leur premier croisement pour lancer la Poudre de Sommeil.",
    hint: "Garde I : 4, 8, 12… · Garde II : 6, 12… Ils se croisent simultanément devant vous à la 12e minute !",
    render(api) {
      let minute = 1;
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_zoom_gardes.webp" alt="Les deux gardes près du brasero" id="grd-ref" />
          <span>Garde I : ronde toutes les 4 min · Garde II : ronde toutes les 6 min.</span>
        </div>

        <div class="patrol-track-wrap">
          <div class="patrol-lane">
            <div class="patrol-lane-head">
              <strong>Garde I (hallebarde)</strong>
              <span>Passe toutes les 4 min</span>
            </div>
            <div class="patrol-dots" id="lane-4"></div>
          </div>
          <div class="patrol-lane">
            <div class="patrol-lane-head">
              <strong>Garde II (épée)</strong>
              <span>Passe toutes les 6 min</span>
            </div>
            <div class="patrol-dots" id="lane-6"></div>
          </div>
        </div>

        <div class="slider-control-row">
          <button type="button" class="step-btn" id="min-dec" aria-label="Reculer de 1 minute">−</button>
          <input type="range" id="min-slider" min="1" max="18" step="1" value="1" />
          <button type="button" class="step-btn" id="min-inc" aria-label="Avancer de 1 minute">+</button>
          <span class="readout-badge" id="min-badge">1 min</span>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#grd-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_zoom_gardes.webp", "Les gardes des remparts");
      });

      const btnThrow = document.createElement("button");
      btnThrow.type = "button";
      btnThrow.className = "btn-crimson";
      btnThrow.textContent = "Lancer la Poudre de Sommeil";
      api.footer.appendChild(btnThrow);

      const lane4 = stage.querySelector("#lane-4");
      const lane6 = stage.querySelector("#lane-6");
      const slider = stage.querySelector("#min-slider");
      const badge = stage.querySelector("#min-badge");

      function renderLanes() {
        slider.value = String(minute);
        badge.textContent = `${minute} min`;

        const build = (el, period) => {
          el.innerHTML = "";
          for (let m = 1; m <= 18; m++) {
            const isPass = m % period === 0;
            const isNow = m === minute;
            const isMeet = isNow && m % 4 === 0 && m % 6 === 0;
            const cell = document.createElement("div");
            cell.className = `patrol-cell ${isMeet ? "is-meet" : isNow ? "is-now" : isPass ? "is-pass" : ""}`;
            cell.textContent = String(m);
            cell.style.cursor = "pointer";
            cell.addEventListener("click", () => {
              if (locked) return;
              minute = m;
              api.clearStatus();
              renderLanes();
            });
            el.appendChild(cell);
          }
        };
        build(lane4, 4);
        build(lane6, 6);
      }

      slider.addEventListener("input", () => {
        if (locked) return;
        minute = Number(slider.value);
        api.clearStatus();
        renderLanes();
      });
      stage.querySelector("#min-dec").addEventListener("click", () => {
        if (locked || minute <= 1) return;
        minute -= 1;
        api.clearStatus();
        renderLanes();
      });
      stage.querySelector("#min-inc").addEventListener("click", () => {
        if (locked || minute >= 18) return;
        minute += 1;
        api.clearStatus();
        renderLanes();
      });

      btnThrow.addEventListener("click", () => {
        if (locked) return;
        if (minute === 12) {
          locked = true;
          sound.playSFX("sommeil", 0.68);
          api.setStatus("12e minute ! Les deux gardes s'effondrent ensemble dans un sommeil profond.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1100);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("Votre jet est mal synchronisé : un seul garde (ou aucun) se trouve devant vous !", "error");
        }
      });

      renderLanes();
    }
  });
}

// --- ÉPREUVE 15 : BOÎTIER FINAL DU PONT-LEVIS (INSERTION DES 3 PIÈCES + CODE 3·2·1) ---
export function launchFinalBridgeMechanism({ onSolved }) {
  openWorkbench({
    kicker: "Acte IV · L'Ultime Porte du Pont-Levis",
    title: "Enclencher le Mécanisme de la Liberté",
    instruction: "Insérez vos trois pièces dans le boîtier, puis réglez le code de rotation : « 3 tours de Lune d'Or (Rouage), 2 ailes de Dragon (Manivelle), 1 fer de Maître (Clé). »",
    hint: "Cliquez sur les 3 emplacements pour placer le Rouage d'Or, la Manivelle de Bronze et la Clé du Pont-Levis, puis réglez les cadrans sur 3 · 2 · 1.",
    render(api) {
      const inserted = { rouage: false, manivelle: false, cle: false };
      const digits = [0, 0, 0];
      let locked = false;

      const pieces = [
        { id: "rouage", name: "Rouage d'Or", hint: "Lune d'Or", img: "assets/images/items/rouage_or.webp" },
        { id: "manivelle", name: "Manivelle de Bronze", hint: "Ailes de Dragon", img: "assets/images/items/manivelle_bronze.webp" },
        { id: "cle", name: "Clé du Pont-Levis", hint: "Fer de Maître", img: "assets/images/items/cle_pont_levis.webp" }
      ];

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_zoom_mecanisme_final.webp" alt="Boîtier du pont-levis" id="bridge-ref" />
          <span>Devise gravée : « 3 tours de Lune d'Or, 2 ailes de Dragon, 1 fer de Maître. »</span>
        </div>

        <div class="bridge-slots" id="bridge-slots"></div>

        <div class="mg-panel">
          <div class="dial-wheels" id="bridge-dials"></div>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#bridge-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_zoom_mecanisme_final.webp", "Boîtier mécanique du Pont-Levis");
      });

      const btnLower = document.createElement("button");
      btnLower.type = "button";
      btnLower.className = "btn-crimson";
      btnLower.textContent = "Abaisser le Pont-Levis";
      btnLower.disabled = true;
      api.footer.appendChild(btnLower);

      const slotsWrap = stage.querySelector("#bridge-slots");
      const dialsWrap = stage.querySelector("#bridge-dials");

      function allInserted() {
        return inserted.rouage && inserted.manivelle && inserted.cle;
      }

      function renderSlots() {
        slotsWrap.innerHTML = "";
        pieces.forEach((p) => {
          const isIn = inserted[p.id];
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `bridge-slot ${isIn ? "is-inserted" : ""}`;
          btn.innerHTML = `
            <img src="${p.img}" alt="${p.name}" />
            <strong>${p.name}</strong>
            <span>${isIn ? "Enclenché ✓" : `Cliquer pour insérer (${p.hint})`}</span>
          `;
          btn.addEventListener("click", () => {
            if (locked || isIn) return;
            inserted[p.id] = true;
            sound.playSFX("engrenage", 0.55);
            api.clearStatus();
            renderSlots();
            btnLower.disabled = !allInserted();
          });
          slotsWrap.appendChild(btn);
        });
      }

      const labels = ["Rouage (Or)", "Manivelle (Bronze)", "Clé (Fer)"];
      const displays = [];
      labels.forEach((lbl, idx) => {
        const col = document.createElement("div");
        col.className = "dial-wheel";
        col.innerHTML = `
          <span class="dial-label">${lbl}</span>
          <button type="button" class="dial-arrow" data-d="1">▲</button>
          <div class="dial-drum" id="br-d-${idx}">0</div>
          <button type="button" class="dial-arrow" data-d="-1">▼</button>
        `;
        displays.push(col.querySelector(`#br-d-${idx}`));
        col.querySelectorAll(".dial-arrow").forEach((b) => {
          b.addEventListener("click", () => {
            if (locked) return;
            digits[idx] = (digits[idx] + Number(b.dataset.d) + 10) % 10;
            displays[idx].textContent = String(digits[idx]);
            sound.playSFX("engrenage", 0.48);
            api.clearStatus();
          });
        });
        dialsWrap.appendChild(col);
      });

      btnLower.addEventListener("click", () => {
        if (locked) return;
        if (!allInserted()) {
          api.setStatus("Insérez d'abord les trois pièces dans le boîtier.", "info");
          return;
        }
        const code = digits.join("");
        if (code === "321") {
          locked = true;
          sound.playSFX("ouverture", 0.65);
          api.setStatus("3 · 2 · 1 ! Les chaînes se déroulent et le pont-levis s'abat vers la liberté !", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1150);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("Les pièces s'entrechoquent mais rien ne bouge. La séquence de rotation est mauvaise.", "error");
        }
      });

      renderSlots();
    }
  });
}
