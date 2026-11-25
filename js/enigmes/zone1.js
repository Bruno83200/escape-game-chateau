// js/enigmes/zone1.js — Acte I : Les Oubliettes (Cellule, Rats, Casques, Herse de Fer)
import { sound } from "../engine/audio.js";
import { hasItem, addItem, recordClue } from "../engine/state.js";
import { showModal, showItemShowcase, showToast, updateJournalBadge } from "../engine/ui.js";
import { launchCellLetterRiddle, launchRatsGearLock } from "../minigames/stone-engraver.js";
import { launchHelmetsScale } from "../minigames/helmets-scale.js";

export function createZone1Actions(engine) {
  return {
    tirerChaines() {
      sound.playSFX("chaines", 0.55);
      showModal({
        title: "Entraves d'acier",
        kicker: "Acte I · La Cellule",
        text: "L'acier est trop solide ! Impossible de briser ces chaînes par la force."
      });
    },

    verifierEnigmeN() {
      launchCellLetterRiddle({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Clé des chaînes");
          if (recordClue("clue_mur_n")) {
            updateJournalBadge();
            showToast("Enluminure archivée dans votre Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Clé des chaînes",
            text: "Bravo ! Tu as trouvé la clé pour te libérer de tes chaînes !",
            image: "assets/images/items/cle_chaine.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("couloir_01");
            }
          });
        }
      });
    },

    enigmeMathRats() {
      launchRatsGearLock({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          if (recordClue("clue_rats")) {
            updateJournalBadge();
            showToast("Relevé des engrenages archivé dans le Grimoire");
          }
          showItemShowcase({
            title: "Passage Libéré !",
            kicker: "Épreuve Résolue",
            text: "Bravo ! Vous avez résolu cette seconde énigme. La trappe du couloir s'ouvre pour que les rats s'échappent et libère le couloir. Poursuivez votre chemin vers la sortie !",
            image: "assets/images/items/calcul.webp",
            onClose: () => {
              sound.playSFX("door", 0.55);
              engine.goTo("salle_des_gardes");
            }
          });
        }
      });
    },

    fouillerRateliers() {
      showModal({
        title: "Râteliers d'armes",
        kicker: "Acte I · Salle des Gardes",
        text: "Les armes sont enchaînées au mur. Impossible de s'en saisir."
      });
    },

    enigmeCasqueOr() {
      launchHelmetsScale({
        onSolved: async () => {
          sound.playSFX("success", 0.45);
          sound.stopAmbience();
          addItem("Médaillon de Garde");
          if (recordClue("clue_casques")) {
            updateJournalBadge();
            showToast("Balance des casques consignée dans le Grimoire");
          }
          await engine.save();
          showItemShowcase({
            title: "Médaillon de Garde",
            text: "La balance s'équilibre ! Vous récupérez le Médaillon de Garde.",
            image: "assets/images/items/medaillon.webp",
            onClose: () => engine.goTo("grille_fer")
          });
        }
      });
    },

    utiliserMedaillon() {
      if (hasItem("Médaillon de Garde")) {
        sound.playSFX("success", 0.45);
        sound.playSFX("herse", 0.65);
        showModal({
          title: "La Herse se Soulève !",
          kicker: "Acte I · Accès aux Appartements Royaux",
          image: "assets/images/items/medaillon.webp",
          imageCaption: "Le Médaillon de Garde enclenché dans la fente circulaire",
          text: "Vous insérez le médaillon dans la fente. Un mécanisme complexe s'active et la herse se soulève lourdement !",
          buttonText: "Franchir la Herse",
          onClose: () => engine.goTo("antichambre")
        });
      } else {
        sound.playSFX("error", 0.55);
        showModal({
          title: "Fente circulaire vide",
          kicker: "Acte I · La Herse de Fer",
          text: "Vous n'avez rien qui semble s'adapter à cette fente. Vous devriez fouiller la salle précédente."
        });
      }
    }
  };
}
