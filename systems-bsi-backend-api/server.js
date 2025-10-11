import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.CHAVE_API;

console.log("Valor da CHAVE_API lida pelo servidor:", OPENAI_API_KEY ? "Chave Carregada" : "Chave NÃO encontrada (undefined)");

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é o PinguSys, o assistente virtual oficial do SystemsBSI. 
Responda sempre em português, com tom profissional e amigável.
Você deve responder sobre: programação, cibersegurança, tecnologia, IA e sobre a comunidade SystemsBSI — que é focada em aprendizado ético, open-source e inovação digital.`
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui entender.";

    res.json({ reply });
  } catch (error) {
    console.error("Erro ao consultar API:", error);
    res.status(500).json({ reply: "Erro ao conectar com o servidor." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor do PinguSys ativo na porta ${PORT}`));
