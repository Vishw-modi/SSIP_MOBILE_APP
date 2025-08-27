import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResponseSchema, systemPrompt } from "../configurations.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
});

const SYSTEM_PROMPT = systemPrompt;
const responseSchema = ResponseSchema;

export const handleChat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: "Provide { messages }" });
    }

    const toGemini = (m) => {
      const text = m.content.response ? JSON.stringify(m.content) : m.content;
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text }],
      };
    };

    let historyFromClient = Array.isArray(messages)
      ? messages.map(toGemini)
      : [];

    const lastUserMessage = Array.isArray(messages)
      ? [...messages].reverse().find((m) => m.role === "user")?.content ?? ""
      : typeof messages === "string"
      ? messages
      : "";

    if (historyFromClient.length && historyFromClient[0].role !== "user") {
      historyFromClient = historyFromClient.slice(1);
    }

    const chat = model.startChat({
      systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
      history: historyFromClient.slice(-20),
      generationConfig: {
        maxOutputTokens: 5048,
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const result = await chat.sendMessage(
      String(lastUserMessage.response || "").trim()
    );

    const replyText = await result.response.text();
    const replyJson = JSON.parse(replyText);

    console.log("Response message sent for the chat");

    res.json({ reply: replyJson });
  } catch (error) {
    console.log("Error in /chat:", error);
    res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
};
