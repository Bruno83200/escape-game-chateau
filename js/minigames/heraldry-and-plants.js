// js/minigames/heraldry-and-plants.js — Épreuve 5 (Blason : Loup) & Épreuve 10 (Herboristerie : Digitale)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

// --- ÉPREUVE 5 : LE BLASON DES FONDATEURS (LOUP) ---
export function launchHeraldicShield({ onSolved }) {
  openWorkbench({
    kicker: "Acte II · L'Antichambre Royale",
    title: "Compléter le Blason des Fondateurs",
    instruction: "« Lion = Haut-Gauche · Aigle = Opposé · Serpent = Sous le Lion. » Quel prédateur (canidé) veille au Nord de l'Aigle ?",
    hint: "On distingue la silhouette d'un canidé sauvage sur la partie supérieure droite du blason : le Loup !",
    render(api) {
      let chosen = null;
      let locked = false;

      const options = [
        { id: "loup", name: "Loup", sub: "Canidé nocturne", glyph: "🐺" },
        { id: "ours", name: "Ours", sub: "Bête des forêts", glyph: "🐻" },
        { id: "corbeau", name: "Corbeau", sub: "Oiseau d'ombre", glyph: "🦅" },
        { id: "cerf", name: "Cerf", sub: "Roi des bois", glyph: "🦌" }
      ];

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="ref-strip">
          <img src="assets/images/scenes/bg_zoom_blason.webp" alt="Blason gravé de la cheminée" id="blason-ref" />
          <span>Blason gravé dans la pierre — cliquez pour examiner à la loupe.</span>
        </div>

        <div class="shield-grid" aria-label="Écu héraldique à 4 quartiers">
          <div class="shield-quarter">
            <span style="font-size:1.5rem;">🦁</span>
            <span class="shield-q-name">Lion</span>
            <span class="shield-q-pos">Haut · Gauche</span>
          </div>
          <div class="shield-quarter is-missing" id="shield-missing-slot">
            <span style="font-size:1.5rem;" id="shield-pick-glyph">?</span>
            <span class="shield-q-name" id="shield-pick-name">À identifier</span>
            <span class="shield-q-pos">Nord de l'Aigle</span>
          </div>
          <div class="shield-quarter is-bl">
            <span style="font-size:1.5rem;">🐍</span>
            <span class="shield-q-name">Serpent</span>
            <span class="shield-q-pos">Sous le Lion</span>
          </div>
          <div class="shield-quarter is-br">
            <span style="font-size:1.5rem;">🦅</span>
            <span class="shield-q-name">Aigle</span>
            <span class="shield-q-pos">Opposé au Lion</span>
          </div>
        </div>

        <div class="choice-cards-grid" id="herald-options"></div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#blason-ref").addEventListener("click", () => {
        openLightbox("assets/images/scenes/bg_zoom_blason.webp", "Blason gravé des fondateurs");
      });

      const btnSeal = document.createElement("button");
      btnSeal.type = "button";
      btnSeal.className = "btn-crimson";
      btnSeal.textContent = "Sceller le Blason";
      btnSeal.disabled = true;
      api.footer.appendChild(btnSeal);

      const grid = stage.querySelector("#herald-options");
      const pickGlyph = stage.querySelector("#shield-pick-glyph");
      const pickName = stage.querySelector("#shield-pick-name");

      options.forEach((opt) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "herald-card";
        b.innerHTML = `
          <span style="font-size:1.6rem;">${opt.glyph}</span>
          <span>${opt.name}</span>
          <span style="font-family:var(--font-serif);font-size:0.88rem;font-weight:400;opacity:0.8;">${opt.sub}</span>
        `;
        b.addEventListener("click", () => {
          if (locked) return;
          chosen = opt.id;
          pickGlyph.textContent = opt.glyph;
          pickName.textContent = opt.name;
          btnSeal.disabled = false;
          sound.playSFX("pierre", 0.35);
          api.clearStatus();
          grid.querySelectorAll(".herald-card").forEach((el) => el.classList.remove("is-selected"));
          b.classList.add("is-selected");
        });
        grid.appendChild(b);
      });

      btnSeal.addEventListener("click", () => {
        if (locked || !chosen) return;
        if (chosen === "loup") {
          locked = true;
          sound.playSFX("pierre", 0.65);
          api.setStatus("Le Loup complète le blason des fondateurs ! La cheminée pivote sur un trésor royal.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          sound.playSFX("error", 0.55);
          api.setStatus("Le blason reste immobile. Rappelez-vous : on devine la silhouette d'un canidé prédateur…", "error");
        }
      });
    }
  });
}

// --- ÉPREUVE 10 : L'HERBORISTERIE SECRÈTE (DIGITALE BLEUE) ---
export function launchHerboristeriePicker({ onSolved }) {
  openWorkbench({
    kicker: "Acte III · L'Herboristerie Secrète",
    title: "Cueillir la Plante de la Poudre d'Argent",
    instruction: "« Belladone à droite, Mandragore au centre, Digitale à gauche. » Cliquez directement sur la plante à broyer pour obtenir la poudre d'argent.",
    hint: "Les pétales bleus de la Digitale (Campanula Caerulea, tout à gauche) produisent la fine Poudre de Sommeil argentée.",
    render(api) {
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "mg-stage";
      stage.innerHTML = `
        <div class="hotspot-frame" id="plants-frame">
          <img src="assets/images/scenes/bg_zoom_plantes.webp" alt="Les trois plantes : Digitale Bleue, Mandragore Jaune, Belladone Pourpre" draggable="false" />
        </div>
        <div class="book-choices">
          <button type="button" class="btn-vellum" data-plant="digitale">Digitale Bleue (Gauche)</button>
          <button type="button" class="btn-vellum" data-plant="mandragore">Mandragore Jaune (Centre)</button>
          <button type="button" class="btn-vellum" data-plant="belladone">Belladone Pourpre (Droite)</button>
        </div>
      `;
      api.stage.appendChild(stage);

      const frame = stage.querySelector("#plants-frame");
      const zones = [
        { id: "digitale", label: "Digitale Bleue", left: "4%", top: "10%", width: "33%", height: "84%" },
        { id: "mandragore", label: "Mandragore Jaune", left: "37%", top: "20%", width: "26%", height: "74%" },
        { id: "belladone", label: "Belladone Pourpre", left: "63%", top: "8%", width: "34%", height: "86%" }
      ];

      function pickPlant(id, zoneEl = null) {
        if (locked) return;
        if (id === "digitale") {
          locked = true;
          if (zoneEl) zoneEl.classList.add("is-hit");
          sound.playSFX("coupe", 0.65);
          api.setStatus("Vous broyez les pétales bleus de la Digitale : une fine poudre argentée s'élève !", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1100);
        } else {
          if (zoneEl) {
            zoneEl.classList.add("is-miss");
            setTimeout(() => zoneEl.classList.remove("is-miss"), 550);
          }
          sound.playSFX("error", 0.55);
          api.setStatus("La mixture devient sombre et malodorante. Ce n'est pas la bonne plante.", "error");
        }
      }

      zones.forEach((z) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "hotspot-zone";
        el.style.left = z.left;
        el.style.top = z.top;
        el.style.width = z.width;
        el.style.height = z.height;
        el.innerHTML = `<span class="hotspot-tag">${z.label}</span>`;
        el.addEventListener("click", () => pickPlant(z.id, el));
        frame.appendChild(el);
      });

      stage.querySelectorAll("[data-plant]").forEach((btn) => {
        btn.addEventListener("click", () => pickPlant(btn.dataset.plant));
      });
    }
  });
}
