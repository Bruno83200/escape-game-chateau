// js/minigames/stone-engraver.js — Épreuve 1 (Dalle Runique : N) & Épreuve 2 (Engrenages des Rats : 36)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

// --- ÉPREUVE 1 : LA DALLE GRAVÉE DE LA CELLULE (LETTRE N) ---
export function launchCellLetterRiddle({ onSolved }) {
  openWorkbench({
    kicker: "Acte I · La Cellule Glaciale",
    title: "Graver la Lettre sur la Pierre",
    instruction: "Trouvez la lettre décrite par l'énigme gravée sur le mur humide et ciselez-la dans l'encoche de pierre.",
    hint: "Observez les mots : Nuit commence par N, matiN finit par N, aNNée contient deux N, et jourNée un seul !",
    render(api) {
      let chosen = "";
      let locked = false;

      const letters = ["A", "E", "I", "J", "L", "M", "N", "O", "R", "S", "T", "U"];
      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="stone-tablet">
          <p class="stone-riddle" id="stone-riddle-text">
            « Je commence la <strong>nuit</strong> et je finis le <strong>matin</strong>,<br>
            j'apparais deux fois dans l'<strong>année</strong> et une seule fois dans la <strong>journée</strong>.<br>
            Qui suis-je ? »
          </p>
          <div class="stone-chisel-slot" id="chisel-slot">?</div>
        </div>
        <div class="rune-keyboard" id="rune-kb"></div>
      `;
      api.stage.appendChild(stage);

      const btnCarve = document.createElement("button");
      btnCarve.type = "button";
      btnCarve.className = "btn-crimson";
      btnCarve.textContent = "Graver cette lettre";
      btnCarve.disabled = true;
      api.footer.appendChild(btnCarve);

      const slot = stage.querySelector("#chisel-slot");
      const riddleEl = stage.querySelector("#stone-riddle-text");
      const kb = stage.querySelector("#rune-kb");

      function selectLetter(ch) {
        if (locked) return;
        chosen = ch;
        slot.textContent = ch;
        btnCarve.disabled = false;
        sound.playSFX("pierre", 0.4);
        api.clearStatus();
        kb.querySelectorAll(".rune-key").forEach((b) => {
          b.classList.toggle("is-active", b.dataset.ch === ch);
        });
      }

      letters.forEach((ch) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "rune-key";
        b.dataset.ch = ch;
        b.textContent = ch;
        b.addEventListener("click", () => selectLetter(ch));
        kb.appendChild(b);
      });

      function validate() {
        if (locked || !chosen) return;
        if (chosen === "N") {
          locked = true;
          riddleEl.innerHTML = `« Je commence la <mark>n</mark>uit et je finis le mati<mark>n</mark>,<br>j'apparais deux fois dans l'a<mark>nn</mark>ée et une seule fois dans la jour<mark>n</mark>ée ! »`;
          sound.playSFX("chaines", 0.65);
          api.setStatus("Un déclic résonne dans la pierre ! La clé des chaînes tombe à vos pieds.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1150);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("Le silence vous répond. Essayez une autre lettre présente dans nuit, matin, année et journée.", "error");
        }
      }

      btnCarve.addEventListener("click", validate);

      const onKey = (e) => {
        if (locked) return;
        if (e.key === "Enter") validate();
        else if (/^[a-zA-Z]$/.test(e.key)) {
          const up = e.key.toUpperCase();
          if (letters.includes(up)) selectLetter(up);
        }
      };
      window.addEventListener("keydown", onKey);
      api.setCleanup(() => window.removeEventListener("keydown", onKey));
    }
  });
}

// --- ÉPREUVE 2 : ENGRENAGES DU COULOIR DES RATS (36) ---
export function launchRatsGearLock({ onSolved }) {
  openWorkbench({
    kicker: "Acte I · Le Couloir des Rats",
    title: "Les Engrenages de la Trappe",
    instruction: "« Divise-moi deux fois par 2, ma somme est 9. Qui suis-je ? » Réglez les deux roues d'engrenage pour libérer la trappe.",
    hint: "Pour retrouver le nombre avant les deux divisions par 2, multipliez par 2 deux fois : 9 × 2 = 18, puis 18 × 2 = 36.",
    render(api) {
      const digits = [0, 0];
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_mecanisme_rats.webp" alt="Mécanisme mural des rats" id="rats-ref" />
          <span>Gravure murale : « Divise-moi deux fois par 2, ma somme est 9. »</span>
        </div>
        <div class="mg-panel">
          <div class="dial-wheels" id="rats-wheels"></div>
        </div>
        <div class="mg-pills">
          <span class="mg-pill">Nombre réglé : <strong id="rats-num">0</strong></span>
          <span class="mg-pill">Divisé par 2 : <strong id="rats-div1">0</strong></span>
          <span class="mg-pill">Puis encore par 2 : <strong id="rats-div2">0</strong></span>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#rats-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_mecanisme_rats.webp", "Les engrenages de la trappe aux rats");
      });

      const btnPull = document.createElement("button");
      btnPull.type = "button";
      btnPull.className = "btn-crimson";
      btnPull.textContent = "Actionner la Trappe";
      api.footer.appendChild(btnPull);

      const wheelsWrap = stage.querySelector("#rats-wheels");
      const numEl = stage.querySelector("#rats-num");
      const d1El = stage.querySelector("#rats-div1");
      const d2El = stage.querySelector("#rats-div2");
      const displays = [];

      function refresh() {
        const val = digits[0] * 10 + digits[1];
        displays[0].textContent = String(digits[0]);
        displays[1].textContent = String(digits[1]);
        numEl.textContent = String(val);
        d1El.textContent = (val / 2).toFixed(val % 2 === 0 ? 0 : 1);
        d2El.textContent = (val / 4).toFixed(val % 4 === 0 ? 0 : 2);
      }

      ["Dizaines", "Unités"].forEach((lbl, idx) => {
        const col = document.createElement("div");
        col.className = "dial-wheel";
        col.innerHTML = `
          <span class="dial-label">${lbl}</span>
          <button type="button" class="dial-arrow" data-d="1">▲</button>
          <div class="dial-drum" id="rat-d-${idx}">0</div>
          <button type="button" class="dial-arrow" data-d="-1">▼</button>
        `;
        displays.push(col.querySelector(`#rat-d-${idx}`));
        col.querySelectorAll(".dial-arrow").forEach((b) => {
          b.addEventListener("click", () => {
            if (locked) return;
            digits[idx] = (digits[idx] + Number(b.dataset.d) + 10) % 10;
            sound.playSFX("engrenage", 0.5);
            api.clearStatus();
            refresh();
          });
        });
        wheelsWrap.appendChild(col);
      });

      function check() {
        if (locked) return;
        const val = digits[0] * 10 + digits[1];
        if (val === 36) {
          locked = true;
          sound.playSFX("mecanisme", 0.65);
          api.setStatus("36 ÷ 2 = 18, puis 18 ÷ 2 = 9 ! La trappe s'ouvre et aspire les rats.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("Le mécanisme refuse de bouger. Une décharge de vapeur siffle !", "error");
        }
      }

      btnPull.addEventListener("click", check);
      refresh();
    }
  });
}
