// js/engine/state.js — État de l'évasion & synchronisation Firestore (l-heritage-du-sang-3436a)
import { db } from "../config.js";
import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const state = {
  uid: null,
  pseudo: "Aventurier",
  currentScene: "cellule",
  inventory: [],
  discoveredClues: [],
  visitedScenes: [],
  lastZone: null
};

const localKey = (uid, suffix) => `chateau_v2_${uid || "anon"}_${suffix}`;

export function hydrateLocalExtras(uid) {
  try {
    const clues = JSON.parse(localStorage.getItem(localKey(uid, "clues")) || "[]");
    const visited = JSON.parse(localStorage.getItem(localKey(uid, "visited")) || "[]");
    state.discoveredClues = Array.isArray(clues) ? clues : [];
    state.visitedScenes = Array.isArray(visited) ? visited : [];
  } catch {
    state.discoveredClues = [];
    state.visitedScenes = [];
  }
}

export function persistLocalExtras() {
  try {
    localStorage.setItem(localKey(state.uid, "clues"), JSON.stringify(state.discoveredClues));
    localStorage.setItem(localKey(state.uid, "visited"), JSON.stringify(state.visitedScenes));
  } catch {
    // Ignoré si stockage local indisponible
  }
}

export function markSceneVisited(sceneId) {
  if (sceneId && !state.visitedScenes.includes(sceneId)) {
    state.visitedScenes.push(sceneId);
    persistLocalExtras();
  }
}

export function recordClue(clueId) {
  if (clueId && !state.discoveredClues.includes(clueId)) {
    state.discoveredClues.push(clueId);
    persistLocalExtras();
    return true;
  }
  return false;
}

export function hasItem(name) {
  return state.inventory.includes(name);
}

export function addItem(name) {
  if (name && !state.inventory.includes(name)) {
    state.inventory.push(name);
    return true;
  }
  return false;
}

export async function syncProgressToFirebase(sceneId = state.currentScene) {
  state.currentScene = sceneId;
  if (!state.uid) return;
  try {
    await updateDoc(doc(db, "users", state.uid), {
      currentScene: state.currentScene,
      inventory: state.inventory
    });
  } catch (err) {
    console.error("Erreur synchronisation Firestore :", err);
  }
}

export async function recordEscapeInFirebase() {
  if (!state.uid) return;
  try {
    await updateDoc(doc(db, "users", state.uid), {
      hasEscaped: true,
      escapedAt: new Date()
    });
  } catch (err) {
    console.error("Erreur enregistrement évasion Firestore :", err);
  }
}
