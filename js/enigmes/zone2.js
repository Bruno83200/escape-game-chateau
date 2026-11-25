// js/enigmes/zone2.js — Acte II : Appartements Royaux (Blason, Bibliothèque, Fioles d'Éther)
import { sound } from "../engine/audio.js";
import { addItem, recordClue } from "../engine/state.js";
import { showModal, showItemShowcase, showToast, updateJournalBadge } from "../engine/ui.js";
import { launchHeraldicShield } from "../minigames/heraldry-and-plants.js";
import { launchBookshelfSequence, launchEtherDosage } from "../minigames/books-and-potion.js";

export function createZone2Actions(engine) {
  return {
    fouillerTapisseries() {
      showModal({
        title: "Tapisseries en lambeaux",
        kicker: "Acte II · Antichambre Royale",
        text: "Elles tombent en lambeaux sous vos doigts. Rien d'utile ici."
      });
    },

    enigmeBlasonLoup() {
      launchHeraldicShield({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Bague à Sceau");
          if (recordClue("clue_blason")) {
            updateJournalBadge();
            showToast("Blason des Fondateurs consigné dans le Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Bague à Sceau",
            kicker: "Trésor Royal",
            text: "Le blason pivote… Vous trouvez la Bague à Sceau.",
            image: "assets/images/items/bague_sceau.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("bibliotheque");
            }
          });
        }
      });
    },

    enigmeLivresDates() {
      launchBookshelfSequence({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Fiole d'Ether");
          if (recordClue("clue_livres")) {
            updateJournalBadge();
            showToast("Chronologie des Grimoires ajoutée au Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Fiole d'Ether",
            kicker: "Découverte Secrète",
            text: "Le grimoire s'enclenche… Une section pivote, révélant une Fiole d'Ether.",
            image: "assets/images/items/fiole_ether.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("cabinet_curiosites");
            }
          });
        }
      });
    },

    enigmeFiolesEther() {
      launchEtherDosage({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Clé de l'Alchimiste");
          if (recordClue("clue_fioles")) {
            updateJournalBadge();
            showToast("Dosage d'Éther archivé dans le Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Clé de l'Alchimiste",
            kicker: "Alchimie Réussie",
            text: "Le mélange se stabilise et libère un compartiment secret. Vous y trouvez la Clé de l'Alchimiste.",
            image: "assets/images/items/cle_alchimiste.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("laboratoire_alchimie");
            }
          });
        }
      });
    }
  };
}
