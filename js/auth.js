// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js"; 
import { UI } from "./ui.js";

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let isLoginMode = false;

document.addEventListener('DOMContentLoaded', () => {
    const toggleLink = document.getElementById('toggle-link');
    const forgotLink = document.getElementById('forgot-password'); // Récupération du lien
    const submitBtn = document.getElementById('submit-auth');

    // --- BASCULE ENTRE INSCRIPTION ET CONNEXION ---
    toggleLink.onclick = () => {
        isLoginMode = !isLoginMode;
        
        // Mise à jour des textes
        document.getElementById('form-title').innerText = isLoginMode ? "CONNEXION" : "CRÉER UN COMPTE";
        toggleLink.innerText = isLoginMode ? "Pas encore de compte ? S'inscrire" : "Déjà inscrit ? Se connecter";
        
        // Affichage/Masquage des champs spécifiques
        document.getElementById('group-pseudo').style.display = isLoginMode ? "none" : "block";
        
        // On affiche "Mot de passe oublié" seulement si on est en mode CONNEXION
        if (forgotLink) {
            forgotLink.style.display = isLoginMode ? "block" : "none";
        }
    };

    // --- LOGIQUE MOT DE PASSE OUBLIÉ ---
    if (forgotLink) {
        forgotLink.onclick = async () => {
            const email = document.getElementById('email').value;
            
            if (!email) {
                UI.message("Veuillez saisir votre adresse mail pour recevoir le lien de réinitialisation.");
                return;
            }

            try {
                await sendPasswordResetEmail(auth, email);
                UI.message("Un parchemin (email) a été envoyé à " + email + " pour réinitialiser votre accès.");
            } catch (e) {
                UI.message("Erreur : " + e.message);
            }
        };
    }

    // --- BOUTON PRINCIPAL (CONNEXION OU CRÉATION) ---
    submitBtn.onclick = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const pseudo = document.getElementById('pseudo').value;

        if (!email || !password) {
            UI.message("Veuillez remplir les champs obligatoires.");
            return;
        }

        try {
            if (isLoginMode) {
                // CONNEXION
                await signInWithEmailAndPassword(auth, email, password);
                UI.message("Heureux de vous revoir !", () => {
                    window.location.href = "game.html";
                });
            } else {
                // CRÉATION DE COMPTE
                if (!pseudo) { 
                    UI.message("Veuillez choisir un pseudo !"); 
                    return; 
                }
                
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                
                // Création du profil dans Firestore
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    pseudo: pseudo,
                    currentScene: "cellule",
                    inventory: [],
                    createdAt: new Date()
                });

                UI.message("Compte créé avec succès ! Bienvenue " + pseudo, () => {
                    window.location.href = "game.html";
                });
            }
        } catch (e) {
            // Traduction simplifiée des erreurs courantes
            let errorMsg = e.message;
            if (e.code === 'auth/user-not-found') errorMsg = "Utilisateur inconnu.";
            if (e.code === 'auth/wrong-password') errorMsg = "Mot de passe incorrect.";
            if (e.code === 'auth/email-already-in-use') errorMsg = "Cette adresse mail est déjà utilisée.";
            
            UI.message("Erreur : " + errorMsg);
        }
    };
});