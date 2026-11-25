// js/auth.js — Authentification Firebase obligatoire + Mot de passe oublié (L'Héritage du Sang)
import { auth, db } from "./config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let isLogin = false;

const tabRegister = document.getElementById("tab-register");
const tabLogin = document.getElementById("tab-login");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const groupPseudo = document.getElementById("group-pseudo");
const pseudoInput = document.getElementById("pseudo");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassBtn = document.getElementById("toggle-password");
const submitBtn = document.getElementById("submit-auth");
const forgotWrap = document.getElementById("forgot-wrap");
const forgotBtn = document.getElementById("forgot-password");
const authForm = document.getElementById("auth-form");
const feedbackBox = document.getElementById("auth-feedback");

const modalBackdrop = document.getElementById("custom-modal");
const modalTitle = document.getElementById("modal-title-text");
const modalKicker = document.getElementById("modal-kicker");
const modalText = document.getElementById("modal-text");
const modalBtn = document.getElementById("modal-btn");

function setMode(loginMode) {
  isLogin = loginMode;
  tabRegister.classList.toggle("is-active", !isLogin);
  tabRegister.setAttribute("aria-selected", String(!isLogin));
  tabLogin.classList.toggle("is-active", isLogin);
  tabLogin.setAttribute("aria-selected", String(isLogin));

  if (isLogin) {
    formTitle.textContent = "CONNEXION";
    formSubtitle.textContent = "Reprenez votre évasion dans la salle exacte où vous l'aviez laissée";
    groupPseudo.style.display = "none";
    forgotWrap.style.display = "block";
    submitBtn.querySelector("span").textContent = "Ouvrir le Grimoire";
  } else {
    formTitle.textContent = "CRÉER UN COMPTE";
    formSubtitle.textContent = "Inscrivez votre nom au grimoire pour sauvegarder votre évasion";
    groupPseudo.style.display = "block";
    forgotWrap.style.display = "none";
    submitBtn.querySelector("span").textContent = "Commencer l'Aventure";
  }
  clearFeedback();
}

function showFeedback(message, type = "error") {
  feedbackBox.textContent = message;
  feedbackBox.className = `auth-feedback is-${type}`;
}

function clearFeedback() {
  feedbackBox.textContent = "";
  feedbackBox.className = "auth-feedback";
}

function openModal({ title, kicker = "Sceau du Donjon", html, buttonText = "Continuer", onClose }) {
  modalTitle.textContent = title;
  modalKicker.textContent = kicker;
  modalText.innerHTML = html;
  modalBtn.textContent = buttonText;
  modalBackdrop.classList.add("is-open");
  modalBtn.onclick = () => {
    modalBackdrop.classList.remove("is-open");
    if (onClose) onClose();
  };
}

function translateFirebaseError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Adresse mail ou mot de passe incorrect.";
    case "auth/email-already-in-use":
      return "Cette adresse mail est déjà utilisée ! Basculez sur l'onglet « Déjà Inscrit » pour vous connecter.";
    case "auth/weak-password":
      return "Votre mot de passe doit contenir au moins 6 caractères.";
    case "auth/invalid-email":
      return "Veuillez saisir une adresse mail valide.";
    case "auth/too-many-requests":
      return "Trop de tentatives. Patientez quelques instants avant de réessayer.";
    case "auth/network-request-failed":
      return "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
    default:
      return "Une erreur est survenue lors de l'identification. Réessayez dans un instant.";
  }
}

tabRegister.addEventListener("click", () => setMode(false));
tabLogin.addEventListener("click", () => setMode(true));

togglePassBtn.addEventListener("click", () => {
  const isPwd = passwordInput.type === "password";
  passwordInput.type = isPwd ? "text" : "password";
  togglePassBtn.setAttribute("aria-label", isPwd ? "Masquer le mot de passe" : "Afficher le mot de passe");
});

forgotBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  if (!email) {
    showFeedback("Veuillez saisir votre adresse mail pour recevoir le parchemin de réinitialisation.");
    emailInput.focus();
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showFeedback(`Un parchemin (email) a été envoyé à ${email} pour réinitialiser votre accès.`, "success");
  } catch (err) {
    showFeedback(translateFirebaseError(err.code));
  }
});

let isSubmitting = false;

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  clearFeedback();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const pseudo = pseudoInput.value.trim();

  if (!isLogin && !pseudo) {
    showFeedback("Veuillez choisir un pseudo pour votre évasion.");
    pseudoInput.focus();
    return;
  }
  if (!email) {
    showFeedback("Veuillez saisir votre adresse mail.");
    emailInput.focus();
    return;
  }
  if (!password || password.length < 6) {
    showFeedback("Le mot de passe doit comporter au moins 6 caractères.");
    passwordInput.focus();
    return;
  }

  isSubmitting = true;
  submitBtn.disabled = true;
  const labelSpan = submitBtn.querySelector("span");
  const prevLabel = labelSpan.textContent;
  labelSpan.textContent = isLogin ? "Ouverture du donjon…" : "Inscription au grimoire…";

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "game.html";
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Schéma Firestore strictement identique à l'original
      await setDoc(doc(db, "users", user.uid), {
        pseudo,
        currentScene: "cellule",
        inventory: [],
        createdAt: new Date()
      });

      openModal({
        title: "Compte créé avec succès !",
        kicker: "Sceau Pourpre Apposé",
        html: `<p>Bienvenue <strong>${escapeHtml(pseudo)}</strong>.</p>
               <p>Les chaînes de l'oubliette vous attendent… Saurez-vous briser L'Héritage du Sang ?</p>`,
        buttonText: "Entrer dans la Cellule",
        onClose: () => {
          window.location.href = "game.html";
        }
      });
    }
  } catch (err) {
    showFeedback(translateFirebaseError(err.code));
    labelSpan.textContent = prevLabel;
    submitBtn.disabled = false;
    isSubmitting = false;
  }
});

onAuthStateChanged(auth, (user) => {
  if (user && !isSubmitting) {
    window.location.href = "game.html";
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
