// js/engine/audio.js — Gestionnaire sonore du Château (27 pistes exactes + fondu enchaîné)

const AUDIO_MAP = {
  // Effets sonores
  success: "assets/audio/success.mp3",
  error: "assets/audio/error.mp3",
  door: "assets/audio/grincement.mp3",
  herse: "assets/audio/herse.mp3",
  chaines: "assets/audio/chaines_sol.mp3",
  pierre: "assets/audio/pierre_glisse.mp3",
  verre: "assets/audio/cliquetis_verre.mp3",
  spark: "assets/audio/cristal_spark.mp3",
  miroir: "assets/audio/miroir_clic.mp3",
  coupe: "assets/audio/herbe_coupee.mp3",
  mecanisme: "assets/audio/mecanisme_lourd.mp3",
  engrenage: "assets/audio/engrenage_clic.mp3",
  sommeil: "assets/audio/pschitt_sommeil.mp3",
  ouverture: "assets/audio/pont_qui_tombe.mp3",
  gaz: "assets/audio/vapeur_pschitt.mp3",

  // Ambiances (en boucle ou one-shot selon scene.loop)
  gouttes: "assets/audio/gouttes_eau.mp3",
  rats: "assets/audio/rats_squeaks.mp3",
  feu: "assets/audio/feu_cheminee.mp3",
  bubbles: "assets/audio/bulles_verre.mp3",
  vapeur: "assets/audio/alchimie_ambiance.mp3",
  optique: "assets/audio/optique_ambiance.mp3",
  herbo: "assets/audio/herbo_ambiance.mp3",
  vent: "assets/audio/tour_vent.mp3",
  tic_tac: "assets/audio/horloge_tic_tac.mp3",
  vent_haut: "assets/audio/vent_sifflement.mp3",
  nuit: "assets/audio/nuit_remparts.mp3",
  espoir: "assets/audio/final_hope.mp3"
};

const AMBIENCE_VOLUMES = {
  gouttes: 0.28,
  rats: 0.36,
  feu: 0.28,
  bubbles: 0.32,
  vapeur: 0.22,
  optique: 0.28,
  herbo: 0.42,
  vent: 0.3,
  tic_tac: 0.26,
  vent_haut: 0.28,
  nuit: 0.28,
  espoir: 0.16
};

const MUTE_KEY = "chateau_audio_muted";

class SoundManager {
  constructor() {
    this.muted = localStorage.getItem(MUTE_KEY) === "1";
    this.currentAmbienceKey = null;
    this.currentAmbienceEl = null;
    this.fadeInterval = null;
    this.unlocked = false;
    this.pendingAmbience = null;

    const unlock = () => {
      if (this.unlocked) return;
      this.unlocked = true;
      if (this.pendingAmbience && !this.muted) {
        const { key, shouldLoop } = this.pendingAmbience;
        this.pendingAmbience = null;
        this.playAmbience(key, shouldLoop);
      }
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem(MUTE_KEY, this.muted ? "1" : "0");
    if (this.muted) {
      if (this.currentAmbienceEl) this.currentAmbienceEl.pause();
    } else if (this.currentAmbienceEl) {
      this.currentAmbienceEl.play().catch(() => {});
    } else if (this.pendingAmbience) {
      this.playAmbience(this.pendingAmbience.key, this.pendingAmbience.shouldLoop);
    }
    return this.muted;
  }

  playSFX(key, volume = 0.52) {
    if (this.muted) return;
    const src = AUDIO_MAP[key];
    if (!src) return;
    try {
      const a = new Audio(src);
      a.volume = volume;
      a.play().catch(() => {});
    } catch {
      // Ignoré
    }
  }

  playAmbience(key, shouldLoop = true) {
    if (!key) {
      this.stopAmbience();
      return;
    }
    if (this.currentAmbienceKey === key && this.currentAmbienceEl && shouldLoop) {
      if (!this.muted && this.currentAmbienceEl.paused) {
        this.currentAmbienceEl.play().catch(() => {});
      }
      return;
    }

    const src = AUDIO_MAP[key];
    if (!src) return;

    const targetVol = AMBIENCE_VOLUMES[key] ?? 0.26;
    this.currentAmbienceKey = key;

    if (this.muted) {
      this.stopCurrentElementOnly();
      this.pendingAmbience = { key, shouldLoop };
      return;
    }

    const oldEl = this.currentAmbienceEl;
    const nextEl = new Audio(src);
    nextEl.loop = shouldLoop;
    nextEl.volume = 0;
    this.currentAmbienceEl = nextEl;

    nextEl.play().then(() => {
      this.crossfade(oldEl, nextEl, targetVol);
    }).catch(() => {
      this.pendingAmbience = { key, shouldLoop };
      if (oldEl) {
        try { oldEl.pause(); } catch {}
      }
    });
  }

  stopCurrentElementOnly() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    if (this.currentAmbienceEl) {
      try {
        this.currentAmbienceEl.pause();
        this.currentAmbienceEl.currentTime = 0;
      } catch {}
      this.currentAmbienceEl = null;
    }
  }

  stopAmbience() {
    this.currentAmbienceKey = null;
    this.pendingAmbience = null;
    this.stopCurrentElementOnly();
  }

  crossfade(oldEl, nextEl, targetVol) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    const steps = 14;
    let step = 0;
    const startOld = oldEl ? oldEl.volume : 0;

    this.fadeInterval = setInterval(() => {
      step += 1;
      const ratio = step / steps;
      if (nextEl && !this.muted) {
        nextEl.volume = Math.min(targetVol, targetVol * ratio);
      }
      if (oldEl) {
        oldEl.volume = Math.max(0, startOld * (1 - ratio));
      }
      if (step >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (oldEl && oldEl !== nextEl) {
          try {
            oldEl.pause();
            oldEl.currentTime = 0;
          } catch {}
        }
      }
    }, 55);
  }
}

export const sound = new SoundManager();
