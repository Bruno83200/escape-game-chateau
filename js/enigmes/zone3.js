// js/enigmes/zone3.js — Acte III : Aile des Savants (Alambic, Optique, Herboristerie)
import { sound } from "../engine/audio.js";
import { addItem, recordClue } from "../engine/state.js";
import { showItemShowcase, showToast, updateJournalBadge } from "../engine/ui.js";
import { launchAlembicEquilibrium, launchOpticsMirrors } from "../minigames/alembic-and-optics.js";
import { launchHerboristeriePicker } from "../minigames/heraldry-and-plants.js";

export function createZone3Actions(engine) {
  return {
    enigmeAlchimieEquilibre() {
      launchAlembicEquilibrium({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Cristal d'Énergie");
          if (recordClue("clue_alambic")) {
            updateJournalBadge();
            showToast("Formule de transmutation archivée dans le Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Cristal d'Énergie",
            kicker: "Transmutation Réussie",
            text: "L'alambic siffle une dernière fois et libère un éclat pourpre. Vous saisissez le Cristal d'Énergie.",
            image: "assets/images/items/cristal_energie.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("table_geometrie");
            }
          });
        }
      });
    },

    enigmeGeometrieAngles() {
      launchOpticsMirrors({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Lentille d'Obsidienne");
          if (recordClue("clue_miroirs")) {
            updateJournalBadge();
            showToast("Schéma optique consigné dans le Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Lentille d'Obsidienne",
            kicker: "Alignement Parfait",
            text: "Le miroir pivote avec un clic sec. Le rayon frappe le cristal de la statue qui libère la Lentille d'Obsidienne.",
            image: "assets/images/items/lentille_obsidienne.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("herboristerie");
            }
          });
        }
      });
    },

    enigmeHerboristerie() {
      launchHerboristeriePicker({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Poudre de Sommeil");
          if (recordClue("clue_plantes")) {
            updateJournalBadge();
            showToast("Planche d'herboristerie ajoutée au Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Poudre de Sommeil",
            kicker: "Préparation Réussie",
            text: "Vous broyez soigneusement les pétales bleus. Une fine poudre argentée se forme. Vous récupérez la Poudre de Sommeil.",
            image: "assets/images/items/poudre_sommeil.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("ascenseur_tour");
            }
          });
        }
      });
    }
  };
}
