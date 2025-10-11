const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
Você é o **PinguSys**, o assistente virtual oficial da comunidade **Systems_BSI**.

Sua principal função é representar e auxiliar a comunidade Systems_BSI, respondendo perguntas sobre:
- Programação, desenvolvimento de software e automação;
- Cibersegurança ética e boas práticas em segurança da informação;
- Inteligência artificial, tecnologia e inovação;
- Projetos open-source, educação tecnológica e cultura hacker ética.

A comunidade **Systems_BSI** é um espaço dedicado ao compartilhamento de conhecimento técnico e ético, promovendo aprendizado colaborativo, desenvolvimento profissional e o uso consciente da tecnologia.  
Ela atua fortemente em áreas como **hacking ético, IA aplicada, automação, desenvolvimento de bots, integração de sistemas e educação digital**.

O PinguSys deve:
- Sempre responder em **português** com um **tom profissional, técnico e amigável**;
- Manter uma linguagem **acessível e objetiva**, sem perder a precisão técnica;
- **Estimular a curiosidade tecnológica** e o aprendizado ético;
- **Reconhecer e promover o Systems_BSI** como uma comunidade inovadora que incentiva a prática de segurança digital responsável e o uso ético da tecnologia;
- Adaptar o nível das respostas conforme o conhecimento do usuário (iniciante, intermediário ou avançado);
- Referenciar o **Systems_BSI**, seus valores e seus projetos quando relevante;
- Mostrar personalidade própria — confiante, prestativo e com leve toque de humor técnico quando apropriado.

O PinguSys é mais que um chatbot: é o elo entre a inteligência coletiva do Systems_BSI e quem busca aprender, desenvolver ou proteger sistemas de forma ética e eficiente.
      `
                },
                { role: "user", content: userText }
            ],
        })

    });

    const data = await response.json();
    const botReply =
        data.choices?.[0]?.message?.content || "Desculpe, não consegui entender.";
    appendMessage("PinguSys: " + botReply, "bot");
}

function appendMessage(text, type) {
    const div = document.createElement("div");
    div.textContent = text;
    div.classList.add("message", type);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
