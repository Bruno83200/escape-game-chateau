export function showParchemin(text, callback = null) {
    const modal = document.getElementById('custom-modal');
    const modalText = document.getElementById('modal-text');
    const modalBtn = document.getElementById('modal-btn');
    const inputArea = document.getElementById('modal-input-area');

    modalText.innerText = text;
    modal.style.display = 'flex';
    if(inputArea) inputArea.style.display = 'none';

    modalBtn.onclick = () => {
        modal.style.display = 'none';
        if (callback) callback();
    };
}

export function askParchemin(text, callback) {
    const modal = document.getElementById('custom-modal');
    const modalText = document.getElementById('modal-text');
    const inputArea = document.getElementById('modal-input-area');
    const inputField = document.getElementById('modal-input-field');
    const modalBtn = document.getElementById('modal-btn');

    modalText.innerText = text;
    inputArea.style.display = 'block';
    inputField.value = "";
    modal.style.display = 'flex';
    inputField.focus();

    modalBtn.onclick = () => {
        modal.style.display = 'none';
        callback(inputField.value);
    };
}

// js/ui.js
export const UI = {
    // Affiche un message simple sur le parchemin
    message: function(text, callback = null) {
        const modal = document.getElementById('custom-modal');
        document.getElementById('modal-text').innerText = text;
        document.getElementById('modal-input-area').style.display = 'none';
        modal.style.display = 'flex';

        document.getElementById('modal-btn').onclick = () => {
            modal.style.display = 'none';
            if (callback) callback();
        };
    },

    // Affiche une question avec champ de saisie sur le parchemin
    ask: function(text, callback) {
        const modal = document.getElementById('custom-modal');
        document.getElementById('modal-text').innerText = text;
        const inputArea = document.getElementById('modal-input-area');
        const inputField = document.getElementById('modal-input-field');
        
        inputArea.style.display = 'block';
        inputField.value = "";
        modal.style.display = 'flex';
        inputField.focus();

        document.getElementById('modal-btn').onclick = () => {
            const val = inputField.value;
            modal.style.display = 'none';
            callback(val);
        };
    }
};