const button = document.getElementById("assistant-button");
const chat = document.getElementById("assistant-chat");
const closeBtn = document.getElementById("assistant-close");
const sendBtn = document.getElementById("assistant-send");
const input = document.getElementById("assistant-input");
const messages = document.getElementById("assistant-messages");

button.addEventListener("click", () => {
    chat.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
    chat.style.display = "none";
});

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;

    appendMessage("Você: " + userText, "user");
    input.value = "";

    try {      
        const resposta = await fetch("https://backend-systems.up.railway.app/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText })
        });

        const data = await resposta.json();
        appendMessage("PinguSys: " + data.reply, "bot");
    } catch (error) {
        appendMessage("PinguSys: Ocorreu um erro ao conectar com o servidor.", "bot");
        console.error(error);
    }
}

function appendMessage(text, type) {
    const div = document.createElement("div");
    div.textContent = text;
    div.classList.add("message", type);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
