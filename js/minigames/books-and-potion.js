// js/minigames/books-and-potion.js — Épreuve 6 (Grimoires : 1266) & Épreuve 7 (Fioles d'Éther : 26 ml)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

// --- ÉPREUVE 6 : LA SUITE DES GRIMOIRES (1266) ---
export function launchBookshelfSequence({ onSolved }) {
  openWorkbench({
    kicker: "Acte II · La Bibliothèque Royale",
    title: "Compléter la Suite Chronologique",
    instruction: "Examinez la progression des dates dorées sur les tranches (1240, 1245, 1251, 1258…) et insérez le grimoire manquant.",
    hint: "1240 → 1245 (+5) → 1251 (+6) → 1258 (+7). L'écart augmente de 1 à chaque tome : 1258 + 8 = 1266 !",
    render(api) {
      let picked = null;
      let locked = false;

      const candidates = [1263, 1265, 1266, 1267, 1269];
      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="bookshelf-row">
          <div class="book-spine"><span>✦</span><span>1240</span><span>I</span></div>
          <div class="book-spine"><span>✦</span><span>1245</span><span>II</span></div>
          <div class="book-spine"><span>✦</span><span>1251</span><span>III</span></div>
          <div class="book-spine"><span>✦</span><span>1258</span><span>IV</span></div>
          <div class="book-spine is-slot" id="book-target">?</div>
        </div>
        <div class="book-choices" id="book-picks"></div>
      `;
      api.stage.appendChild(stage);

      const btnInsert = document.createElement("button");
      btnInsert.type = "button";
      btnInsert.className = "btn-crimson";
      btnInsert.textContent = "Insérer le Grimoire";
      btnInsert.disabled = true;
      api.footer.appendChild(btnInsert);

      const target = stage.querySelector("#book-target");
      const picksWrap = stage.querySelector("#book-picks");

      candidates.forEach((yr) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "book-pick-btn";
        b.textContent = `Tome ${yr}`;
        b.addEventListener("click", () => {
          if (locked) return;
          picked = yr;
          target.className = "book-spine is-filled";
          target.innerHTML = `<span>✦</span><span>${yr}</span><span>V</span>`;
          btnInsert.disabled = false;
          sound.playSFX("pierre", 0.35);
          api.clearStatus();
          picksWrap.querySelectorAll(".book-pick-btn").forEach((x) => x.classList.remove("is-selected"));
          b.classList.add("is-selected");
        });
        picksWrap.appendChild(b);
      });

      btnInsert.addEventListener("click", () => {
        if (locked || !picked) return;
        if (picked === 1266) {
          locked = true;
          sound.playSFX("door", 0.65);
          api.setStatus("Tome 1266 enclenché ! Un pan entier de la bibliothèque pivote sur une niche secrète.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus(`Le tome ${picked} ne s'emboîte pas. Vérifiez l'écart entre chaque date.`, "error");
        }
      });
    }
  });
}

// --- ÉPREUVE 7 : DOSAGE DU NECTAR D'ÉTHER (26 ml) ---
export function launchEtherDosage({ onSolved }) {
  openWorkbench({
    kicker: "Acte II · Le Cabinet de Curiosités",
    title: "Doser le Nectar d'Éther",
    instruction: "« Le nectar doit égaler le double de la plus petite fiole, plus la différence entre la plus grande et la moyenne. » Dosez le mélange exact dans l'éprouvette.",
    hint: "Fioles : Verte = 7 ml (plus petite), Rouge = 10 ml (moyenne), Bleue = 22 ml (plus grande). Calcul : (2 × 7) + (22 − 10) = 14 + 12 = 26 ml.",
    render(api) {
      let ml = 0;
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_zoom_fioles.webp" alt="Les trois fioles colorées" id="ether-ref" />
          <span>Fioles de l'établi : Rouge = 10 ml · Bleue = 22 ml · Verte = 7 ml.</span>
        </div>

        <div class="flask-cards">
          <div class="flask-tag">
            <span class="flask-dot" style="background:#b02836;"></span>
            <div><strong>Rouge · 10 ml</strong></div>
            <div style="font-size:0.74rem;color:var(--ink-500);">Moyenne</div>
          </div>
          <div class="flask-tag">
            <span class="flask-dot" style="background:#2155a4;"></span>
            <div><strong>Bleue · 22 ml</strong></div>
            <div style="font-size:0.74rem;color:var(--ink-500);">Plus grande</div>
          </div>
          <div class="flask-tag">
            <span class="flask-dot" style="background:#1d7a4f;"></span>
            <div><strong>Verte · 7 ml</strong></div>
            <div style="font-size:0.74rem;color:var(--ink-500);">Plus petite</div>
          </div>
        </div>

        <div class="beaker-layout">
          <div class="beaker-cylinder">
            <div class="beaker-liquid" id="ether-liq" style="height:0%;"></div>
            <span class="beaker-val" id="ether-val">0 ml</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn-vellum" data-add="10">+ 10 ml</button>
              <button type="button" class="btn-vellum" data-add="5">+ 5 ml</button>
              <button type="button" class="btn-vellum" data-add="1">+ 1 ml</button>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn-vellum" data-add="-5">− 5 ml</button>
              <button type="button" class="btn-vellum" data-add="-1">− 1 ml</button>
              <button type="button" class="btn-vellum" id="ether-clear">Vider</button>
            </div>
          </div>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#ether-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_zoom_fioles.webp", "Les trois fioles d'Éther");
      });

      const btnMix = document.createElement("button");
      btnMix.type = "button";
      btnMix.className = "btn-crimson";
      btnMix.textContent = "Stabiliser l'Éther";
      api.footer.appendChild(btnMix);

      const liq = stage.querySelector("#ether-liq");
      const valEl = stage.querySelector("#ether-val");

      function updateView() {
        valEl.textContent = `${ml} ml`;
        liq.style.height = `${Math.min(100, (ml / 40) * 100)}%`;
      }

      stage.querySelectorAll("[data-add]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (locked) return;
          ml = Math.max(0, Math.min(40, ml + Number(btn.dataset.add)));
          sound.playSFX("verre", 0.4);
          api.clearStatus();
          updateView();
        });
      });

      stage.querySelector("#ether-clear").addEventListener("click", () => {
        if (locked) return;
        ml = 0;
        api.clearStatus();
        updateView();
      });

      btnMix.addEventListener("click", () => {
        if (locked) return;
        if (ml === 26) {
          locked = true;
          sound.playSFX("verre", 0.65);
          api.setStatus("26 ml exacts ! Le nectar d'Éther se stabilise et libère un compartiment secret.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("Le liquide bouillonne dangereusement… Ce dosage est incorrect.", "error");
        }
      });

      updateView();
    }
  });
}
