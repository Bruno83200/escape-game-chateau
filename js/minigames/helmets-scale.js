// js/minigames/helmets-scale.js — Épreuve 3 : La Balance des Trois Casques (Or = 8 kg)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

export function launchHelmetsScale({ onSolved }) {
  openWorkbench({
    kicker: "Acte I · Salle des Gardes",
    title: "La Balance des Trois Casques",
    instruction: "« Bronze = 2 kg · Argent = Bronze + moitié d'Or · Or = Bronze + Argent. » Réglez le poids du casque d'Or jusqu'à équilibrer la balance.",
    hint: "Testez 8 kg pour l'Or : alors Argent = 2 + (8 ÷ 2) = 6 kg, et Bronze + Argent = 2 + 6 = 8 kg = Or !",
    render(api) {
      let goldKg = 4;
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_table_gardes.webp" alt="Les trois casques et la balance" id="helm-ref" />
          <span>Plaque de cuivre : Bronze = 2 kg · Argent = Bronze + ½ Or · Or = Bronze + Argent.</span>
        </div>

        <div class="svg-stage-box">
          <svg viewBox="0 0 420 190" width="400" height="182" aria-label="Balance d'armurier animée">
            <rect x="155" y="168" width="110" height="14" rx="4" fill="#6d4c22" />
            <rect x="202" y="34" width="16" height="136" rx="4" fill="#ae7b24" />
            <circle cx="210" cy="30" r="11" fill="#741520" stroke="#cb9738" stroke-width="3" />

            <g id="helm-beam" style="transform-origin:210px 44px;transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);">
              <rect x="64" y="40" width="292" height="8" rx="4" fill="#cb9738" stroke="#5c3e12" stroke-width="1.5" />

              <!-- Plateau gauche : Casque d'Or -->
              <line x1="90" y1="48" x2="68" y2="112" stroke="#7d5924" stroke-width="2" />
              <line x1="90" y1="48" x2="112" y2="112" stroke="#7d5924" stroke-width="2" />
              <path d="M54 112 Q90 132 126 112 Z" fill="#cb9738" stroke="#5c3e12" stroke-width="1.8" />
              <path d="M72 110 C72 86 108 86 108 110 Z" fill="#d9a734" stroke="#6f4d11" stroke-width="2" />
              <text id="svg-left-kg" x="90" y="144" text-anchor="middle" fill="#741520" font-family="Cinzel,serif" font-size="12" font-weight="700">Or : 4 kg</text>

              <!-- Plateau droit : Bronze (2kg) + Argent (2 + Or/2) -->
              <line x1="330" y1="48" x2="308" y2="112" stroke="#7d5924" stroke-width="2" />
              <line x1="330" y1="48" x2="352" y2="112" stroke="#7d5924" stroke-width="2" />
              <path d="M294 112 Q330 132 366 112 Z" fill="#cb9738" stroke="#5c3e12" stroke-width="1.8" />
              <path d="M304 110 C304 92 328 92 328 110 Z" fill="#8b5a2b" stroke="#4c2f13" stroke-width="1.8" />
              <path d="M330 110 C330 88 358 88 358 110 Z" fill="#a8b0b8" stroke="#4f565e" stroke-width="1.8" />
              <text id="svg-right-kg" x="330" y="144" text-anchor="middle" fill="#741520" font-family="Cinzel,serif" font-size="12" font-weight="700">Br+Ar : 6 kg</text>
            </g>
          </svg>
        </div>

        <div class="mg-pills">
          <span class="mg-pill">Bronze : <strong>2 kg</strong></span>
          <span class="mg-pill">Argent (2 + ½ Or) : <strong id="val-argent">4 kg</strong></span>
          <span class="mg-pill" id="pill-eq">Or ≟ Bronze + Argent : <strong id="val-eq">4 ≟ 6</strong></span>
        </div>

        <div class="slider-control-row">
          <button type="button" class="step-btn" id="gold-dec" aria-label="Diminuer">−</button>
          <input type="range" id="gold-slider" min="2" max="14" step="1" value="4" />
          <button type="button" class="step-btn" id="gold-inc" aria-label="Augmenter">+</button>
          <span class="readout-badge" id="gold-badge">4 kg</span>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#helm-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_table_gardes.webp", "Les trois casques : Bronze, Argent et Or");
      });

      const btnCheck = document.createElement("button");
      btnCheck.type = "button";
      btnCheck.className = "btn-crimson";
      btnCheck.textContent = "Verrouiller la Balance";
      api.footer.appendChild(btnCheck);

      const beam = stage.querySelector("#helm-beam");
      const leftTxt = stage.querySelector("#svg-left-kg");
      const rightTxt = stage.querySelector("#svg-right-kg");
      const argentEl = stage.querySelector("#val-argent");
      const eqEl = stage.querySelector("#val-eq");
      const pillEq = stage.querySelector("#pill-eq");
      const slider = stage.querySelector("#gold-slider");
      const badge = stage.querySelector("#gold-badge");

      function update(val) {
        goldKg = Math.max(2, Math.min(14, val));
        slider.value = String(goldKg);
        badge.textContent = `${goldKg} kg`;

        const bronze = 2;
        const argent = bronze + goldKg / 2;
        const rightTotal = bronze + argent;
        const diff = rightTotal - goldKg; // >0 penche à droite, 0 équilibre

        beam.style.transform = `rotate(${Math.max(-14, Math.min(14, diff * 3.6))}deg)`;
        leftTxt.textContent = `Or : ${goldKg} kg`;
        rightTxt.textContent = `Br+Ar : ${rightTotal} kg`;
        argentEl.textContent = `${argent} kg`;
        eqEl.textContent = diff === 0 ? `${goldKg} = ${rightTotal} ✓` : `${goldKg} ≠ ${rightTotal}`;
        pillEq.classList.toggle("is-ok", diff === 0);
      }

      slider.addEventListener("input", () => {
        if (locked) return;
        api.clearStatus();
        update(Number(slider.value));
      });
      stage.querySelector("#gold-dec").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("engrenage", 0.35);
        api.clearStatus();
        update(goldKg - 1);
      });
      stage.querySelector("#gold-inc").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("engrenage", 0.35);
        api.clearStatus();
        update(goldKg + 1);
      });

      btnCheck.addEventListener("click", () => {
        if (locked) return;
        if (goldKg === 8) {
          locked = true;
          sound.playSFX("success", 0.55);
          api.setStatus("Équilibre parfait à 8 kg ! Le compartiment du Médaillon de Garde s'ouvre.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("La balance penche encore… Le poids de l'Or est erroné.", "error");
        }
      });

      update(goldKg);
    }
  });
}
