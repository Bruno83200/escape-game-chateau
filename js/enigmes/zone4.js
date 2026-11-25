// js/enigmes/zone4.js — Acte IV : La Grande Tour & Les Remparts (Ascenseur, Horloge, Observatoire, Gardes, Pont-Levis & Hall of Fame)
import { db } from "../config.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { sound } from "../engine/audio.js";
import {
  state,
  hasItem,
  addItem,
  recordClue,
  recordEscapeInFirebase
} from "../engine/state.js";
import {
  showModal,
  showItemShowcase,
  showToast,
  updateJournalBadge,
  escapeHtml
} from "../engine/ui.js";
import {
  launchTowerWeights,
  launchAstroClock,
  launchWaterCondenser
} from "../minigames/tower-instruments.js";
import {
  launchGuardsPatrolSync,
  launchFinalBridgeMechanism
} from "../minigames/guards-and-bridge.js";

export function createZone4Actions(engine) {
  return {
    enigmeAscenseurPoids() {
      launchTowerWeights({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Manivelle de Bronze");
          if (recordClue("clue_poids")) {
            updateJournalBadge();
            showToast("Contrepoids consignés dans le Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Manivelle de Bronze",
            kicker: "Mécanisme Enclenché",
            text: "Dans un fracas de chaînes, l'ascenseur s'ébranle et monte vers les sommets. Vous trouvez une Manivelle de Bronze au sol.",
            image: "assets/images/items/manivelle_bronze.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("horloge_astro");
            }
          });
        }
      });
    },

    enigmeHorlogeAstro() {
      launchAstroClock({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Rouage d'Or");
          if (recordClue("clue_horloge")) {
            updateJournalBadge();
            showToast("Cadran astronomique archivé dans le Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Rouage d'Or",
            kicker: "Alignement Céleste",
            text: "Les rouages s'alignent dans un bourdonnement harmonieux. Un compartiment secret s'ouvre, révélant un Rouage d'Or.",
            image: "assets/images/items/rouage_or.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("observatoire");
            }
          });
        }
      });
    },

    enigmeStabilisationEau() {
      launchWaterCondenser({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Condenseur de Vapeur");
          if (recordClue("clue_eau")) {
            updateJournalBadge();
            showToast("Formule de condensation archivée dans le Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Condenseur de Vapeur",
            kicker: "Équilibre Atteint",
            text: "La vapeur se condense instantanément. Le verrou givré de la porte des remparts explose, libérant le passage. Vous récupérez un Condenseur de Vapeur.",
            image: "assets/images/items/condenseur_vapeur.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("chemin_ronde");
            }
          });
        }
      });
    },

    verifierPoudreEtEnigme() {
      if (!hasItem("Poudre de Sommeil")) {
        sound.playSFX("error", 0.55);
        showModal({
          title: "Aucun moyen discret",
          kicker: "Acte IV · Les Remparts",
          text: "Vous n'avez rien pour neutraliser ces gardes discrètement. Vous devriez fouiller l'herboristerie."
        });
        return;
      }
      launchGuardsPatrolSync({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Clé du Pont-Levis");
          if (recordClue("clue_gardes")) {
            updateJournalBadge();
            showToast("Synchronisation des rondes consignée dans le Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Clé du Pont-Levis",
            kicker: "Gardes Neutralisés",
            text: "Vous lancez la poudre au moment précis. Les gardes s'effondrent dans un sommeil profond. Vous récupérez la Clé du Pont-Levis sur l'un d'eux.",
            image: "assets/images/items/cle_pont_levis.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("pont_levis");
            }
          });
        }
      });
    },

    verifierObjetsFinaux() {
      const ok = hasItem("Rouage d'Or") && hasItem("Manivelle de Bronze") && hasItem("Clé du Pont-Levis");
      if (!ok) {
        sound.playSFX("error", 0.55);
        showModal({
          title: "Pièces manquantes",
          kicker: "Acte IV · Mécanisme Final",
          text: "Il vous manque des éléments pour activer ce mécanisme (Rouage d'Or, Manivelle de Bronze, Clé du Pont-Levis). Avez-vous exploré la tour et neutralisé les gardes ?"
        });
        return;
      }
      launchFinalBridgeMechanism({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          if (recordClue("clue_pont")) {
            updateJournalBadge();
          }
          // Enregistrement du succès dans Firestore exactement au moment de la résolution
          await recordEscapeInFirebase();
          showItemShowcase({
            title: "LIBERTÉ !",
            kicker: "L'Héritage du Sang Brisé",
            text: "Les rouages s'enclenchent, les chaînes se déroulent… Le pont-levis descend lentement vers la vallée !",
            image: "assets/images/items/bg_libre.webp",
            buttonText: "Franchir le Pont-Levis",
            onClose: () => engine.goTo("victoire")
          });
        }
      });
    },

    async afficherLesEvades() {
      let rowsHtml = `<p style="text-align:center;color:var(--ink-500);">Le parchemin des évadés se déroule…</p>`;

      try {
        let docs = [];
        try {
          const q = query(
            collection(db, "users"),
            where("hasEscaped", "==", true),
            orderBy("escapedAt", "desc")
          );
          const snap = await getDocs(q);
          snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
        } catch {
          // Repli automatique si l'index composite Firestore n'existe pas encore
          const qFallback = query(collection(db, "users"), where("hasEscaped", "==", true));
          const snap = await getDocs(qFallback);
          snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
          docs.sort((a, b) => {
            const ta = a.escapedAt?.toMillis ? a.escapedAt.toMillis() : new Date(a.escapedAt || 0).getTime();
            const tb = b.escapedAt?.toMillis ? b.escapedAt.toMillis() : new Date(b.escapedAt || 0).getTime();
            return tb - ta;
          });
        }

        if (!docs.length) {
          rowsHtml = `<p style="text-align:center;color:var(--ink-500);">Vous êtes le tout premier prisonnier à vous évader du château !</p>`;
        } else {
          const items = docs.map((d, i) => {
            const isMe = d.id === state.uid || d.pseudo === state.pseudo;
            const dt = d.escapedAt?.toDate
              ? d.escapedAt.toDate().toLocaleDateString("fr-FR")
              : d.escapedAt
                ? new Date(d.escapedAt).toLocaleDateString("fr-FR")
                : "Évadé";
            return `
              <li class="hof-item ${isMe ? "is-me" : ""}">
                <span class="hof-rank"><span class="hof-medal">${i + 1}</span>${escapeHtml(d.pseudo || "Aventurier")}${isMe ? " (Vous)" : ""}</span>
                <span class="hof-date">${escapeHtml(dt)}</span>
              </li>
            `;
          });
          rowsHtml = `<ul class="hof-list">${items.join("")}</ul>`;
        }
      } catch (err) {
        console.error("Erreur Hall of Fame :", err);
        rowsHtml = `<p style="color:var(--crimson-800);">Le mécanisme de la liste est grippé pour le moment.</p>`;
      }

      showModal({
        title: "Liste des Évadés",
        kicker: "Chronique de la Forteresse",
        image: "assets/images/items/bg_libre.webp",
        imageCaption: "Les évadés ayant brisé L'Héritage du Sang",
        html: `<p>Voici les prisonniers ayant triomphé de l'Oubliette et franchi le pont-levis vers la liberté :</p>`,
        extraHtml: rowsHtml,
        buttonText: "Fermer le parchemin"
      });
    },

    demandeRejouer() {
      showModal({
        title: "Recommencer l'Aventure",
        kicker: "Gardien des Archives",
        html: `<p>Si vous souhaitez renouveler cette aventure depuis le début, adressez un mail à <strong>bruno83200.6929@gmail.com</strong> en précisant le nom du jeu ainsi que votre pseudo, afin que votre sauvegarde soit réinitialisée.</p>
               <p>En retour vous recevrez un message vous indiquant que l'aventure est prête à être rejouée !</p>
               <p style="font-size:0.9rem;color:var(--ink-500);">© 2026 — Imaginé et créé par Bruno CULOT</p>`,
        buttonText: "Compris"
      });
    }
  };
}
