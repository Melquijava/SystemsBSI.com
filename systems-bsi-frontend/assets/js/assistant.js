const button = document.getElementById("assistant-button");
const chat = document.getElementById("assistant-chat");
const closeBtn = document.getElementById("assistant-close");
const sendBtn = document.getElementById("assistant-send");
const input = document.getElementById("assistant-input");
const messages = document.getElementById("assistant-messages");

const newChatBtn = document.getElementById("assistant-new-chat");
const emojiBtn = document.getElementById("assistant-emoji-btn"); 
const attachBtn = document.getElementById("assistant-attach-btn");
const fileInput = document.getElementById("assistant-file-input");


let attachedFile = null;


button.addEventListener("click", () => { chat.style.display = "flex"; });
closeBtn.addEventListener("click", () => { chat.style.display = "none"; });


sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

newChatBtn.addEventListener("click", () => {
    messages.innerHTML = ''; 
    attachedFile = null; 
    appendMessage("👋 Nova conversa iniciada!", "bot");
});


attachBtn.addEventListener("click", () => {
    fileInput.click(); 
});


fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        attachedFile = {
            base64: e.target.result,
            name: file.name
        };
        appendMessage(`Você enviou a imagem: ${file.name}`, "user", e.target.result);
    };
    reader.readAsDataURL(file);

    fileInput.value = "";
});

async function sendMessage() {
    const userText = input.value.trim();

    if (!userText && !attachedFile) return;

    if (userText) {
        appendMessage("Você: " + userText, "user");
    }
    
    input.value = "";

    try {
        const thinkingMessage = appendMessage("PinguSys: Pensando...", "bot");
      
        const requestBody = {
            message: userText,
            attachment: attachedFile ? attachedFile.base64 : null
        };

        const response = await fetch("https://backend-systems.up.railway.app/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Falha na resposta do servidor.');
        }

        const data = await response.json();
        
        messages.removeChild(thinkingMessage);
        appendMessage("PinguSys: " + data.reply, "bot");

    } catch (error) {
        const thinkingMessage = messages.querySelector('.bot:last-child');
        if (thinkingMessage && thinkingMessage.textContent.includes("Pensando...")) {
            messages.removeChild(thinkingMessage);
        }
        appendMessage("PinguSys: Ocorreu um erro ao conectar com o servidor.", "bot");
        console.error(error);
    } finally {
        attachedFile = null;
    }
}


function appendMessage(text, type, imageBase64 = null) {
    const div = document.createElement("div");
    div.classList.add("message", type);

    const textNode = document.createElement("span");
    textNode.textContent = text;
    div.appendChild(textNode);

    if (imageBase64) {
        const img = document.createElement("img");
        img.src = imageBase64;
        img.classList.add("user-image");
        div.appendChild(img);
        if(text.includes("Você enviou a imagem:")) {
            textNode.textContent = `Anexado: ${attachedFile.name}`;
        }
    }
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    
    return div;
}