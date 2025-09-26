import { GoogleGenerativeAI } from "@google/generative-ai";
import { chatSchema, chatPrompt } from "../configurations.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  // model: "gemini-2.5-flash-preview-05-20",
  model: "gemini-2.5-flash",
});

// const SYSTEM_PROMPT = chatPrompt;
const SYSTEM_PROMPT = "You are a helpful Medical assistant.";
const responseSchema = chatSchema;

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error("Invalid JSON from model:", str.slice(0, 200)); // log first 200 chars
    throw new Error("Model did not return valid JSON");
  }
}

export const handleChat = async (req, res) => {
  try {
    console.log("message recieved");

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
        maxOutputTokens: 7048,
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const result = await chat.sendMessage(
      String(lastUserMessage.response || "").trim()
    );

    const replyText = await result.response.text();
    console.log("replyText", replyText);

    // const replyJson = JSON.parse(replyText);
    const replyJson = safeJsonParse(replyText);
    console.log("replyJson", replyJson);

    console.log("Response message sent for the chat");

    // if (replyJson.question === null) {
    //   const model = genAI.getGenerativeModel({
    //     model: "gemini-2.5-pro",
    //   });

    //   const chat = model.startChat({
    //     systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
    //     history: historyFromClient.slice(-20),
    //     generationConfig: {
    //       maxOutputTokens: 7048,
    //       temperature: 0.5,
    //       responseMimeType: "application/json",
    //       responseReportSchema,
    //     },
    //   });

    //   const result = await chat.sendMessage(
    //     String(lastUserMessage.response || "").trim()
    //   );

    //   const replyText = await result.response.text();
    //   console.log("replyText", replyText);

    //   // const replyJson = JSON.parse(replyText);
    //   const replyJson = safeJsonParse(replyText);
    //   console.log("replyJson", replyJson);
    //   return res.json({ reply: replyJson });
    // }

    res.json({ reply: replyJson });
  } catch (error) {
    console.log("Error in /chat:", error);
    res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
};
// import { generateText } from "ai";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { chatSchema, chatPrompt } from "../configurations.js";

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_API_KEY,
// });

// // const model = google("gemini-2.5-flash-preview-05-20");
// const model = google("gemini-2.5-flash");

// function safeJsonParse(str) {
//   try {
//     return JSON.parse(str);
//   } catch (err) {
//     console.error("Invalid JSON from model:", str.slice(0, 200));
//     throw new Error("Model did not return valid JSON");
//   }
// }

// export const handleChat = async (req, res) => {
//   try {
//     console.log("message received");

//     const { messages } = req.body;
//     if (!messages) {
//       return res.status(400).json({ error: "Provide { messages }" });
//     }

//     const toAI = (m) => {
//       const text = m.content.response ? JSON.stringify(m.content) : m.content;
//       return {
//         role: m.role,
//         content: text,
//       };
//     };

//     let historyFromClient = Array.isArray(messages) ? messages.map(toAI) : [];

//     const lastUserMessage = Array.isArray(messages)
//       ? [...messages].reverse().find((m) => m.role === "user")?.content ?? ""
//       : typeof messages === "string"
//       ? messages
//       : "";

//     if (historyFromClient.length && historyFromClient[0].role !== "user") {
//       historyFromClient = historyFromClient.slice(1);
//     }

//     const result = await generateText({
//       model,
//       messages: [
//         {
//           role: "system",
//           content: chatPrompt,
//         },
//         ...historyFromClient.slice(-20),
//         {
//           role: "user",
//           content: String(lastUserMessage.response || "").trim(),
//         },
//       ],
//       temperature: 0.5,
//       maxOutputTokens: 12000,
//       responseFormat: {
//         type: "json_schema",
//         schema: chatSchema,
//       },
//     });

//     const replyText = result.text; // ✅ now works
//     console.log("replyText", replyText);

//     const replyJson = safeJsonParse(replyText);

//     // console.log("replyJson", replyJson);
//     console.log("Response message sent for the chat");

//     res.json({ reply: replyJson });
//   } catch (error) {
//     console.log("Error in /chat:", error);
//     res.status(500).json({ error: error?.message || "Internal Server Error" });
//   }
// };
