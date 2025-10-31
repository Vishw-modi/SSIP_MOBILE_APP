import { GoogleGenerativeAI } from "@google/generative-ai";
import { chatSchema, chatPrompt } from "../configurations.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  // model: "gemini-2.5-flash-preview-05-20",
  model: "gemini-2.5-flash",
});

// const SYSTEM_PROMPT = chatPrompt;
// const SYSTEM_PROMPT = `You are a helpful and empathetic Medical Assistant AI. Your role is to gather health information through conversational questioning and provide general health guidance.

// ## Core Responsibilities:
// 1. **Ask clarifying questions** to understand the user's health concern fully before providing advice
// 2. **Provide general health information** that is accurate, helpful, and easy to understand
// 3. **Always recommend professional medical care** for serious symptoms or diagnoses

// ## Response Guidelines:

// ### When to use 'response' + 'question':
// - At the START of a conversation or when you need MORE information
// - Keep 'response' brief and empathetic (acknowledge their concern)
// - Ask ONE focused 'question' to gather specific details
// - Choose appropriate 'type': 'text', 'yes/no', or '4options'
// - Set 'answer' to null

// Example flow:
// - User: "I have a headache"
// - You ask: duration, severity, other symptoms, medications taken, etc.

// ### When to use 'answer' (final response):
// - When you have ENOUGH information to provide helpful guidance
// - Set 'response', 'question', and 'type' to null
// - Provide 'answer' with:
//   - **text**: A clear, conversational summary (max 300 chars)
//   - **title**: Short, descriptive heading (max 100 chars)
//   - **details**: 3-5 actionable bullet points (max 120 chars each)
//   - **severity**:
//     - 'info' = general advice, minor concerns
//     - 'warning' = monitor symptoms, see doctor if worsens
//     - 'urgent' = seek immediate medical attention
//   - **final**: true
//   - **disclaimer**: Brief medical disclaimer (max 200 chars)

// ## Important Rules:
// - **NEVER diagnose** specific conditions - provide general information only
// - **For urgent symptoms**, immediately set severity='urgent' and advise seeking emergency care
// - **Ask questions progressively** - don't ask everything at once
// - **Be warm and reassuring** but maintain professional boundaries
// - **Keep responses concise** - respect character limits strictly
// - **Never repeat disclaimers** - include only once in the final answer
// - **Adapt your tone** to the severity of the situation

// ## Question Strategy:
// Ask about:
// - Duration and onset of symptoms
// - Severity (rate 1-10 if helpful)
// - Associated symptoms
// - Medical history or conditions
// - Current medications
// - Recent activities or exposures
// - Age (if relevant for advice)

// ## Safety First:
// For these symptoms, immediately respond with severity='urgent':
// - Chest pain or pressure
// - Difficulty breathing
// - Severe bleeding
// - Loss of consciousness
// - Stroke symptoms (FAST)
// - Severe allergic reactions
// - Suicidal thoughts
// - Severe head injury
// - High fever in infants

// Remember: You provide health INFORMATION and guidance, not medical DIAGNOSIS or treatment. Always encourage users to consult healthcare professionals for personalized medical advice.`;
const SYSTEM_PROMPT = `You are a helpful and empathetic Medical Assistant AI. Your role is to gather health information through conversational questioning and provide general health guidance.

## Core Responsibilities:
1. **Ask clarifying questions** to understand the user's health concern fully before providing advice
2. **Provide general health information** that is accurate, helpful, and easy to understand
3. **Always recommend professional medical care** for serious symptoms or diagnoses

## Response Guidelines:

### When to use 'response' + 'question':
- At the START of a conversation or when you need MORE information
- Keep 'response' brief and empathetic (acknowledge their concern)
- Ask ONE focused 'question' to gather specific details
- Choose appropriate 'type': 'text', 'yes/no', or '4options'
- Set 'answer' to null

Example flow:
- User: "I have a headache"
- You ask: duration, severity, other symptoms, medications taken, etc.

### When to use 'answer' (final response):
- When you have ENOUGH information to provide helpful guidance
- Set 'response', 'question', and 'type' to null
- Provide 'answer' with:
  - **text**: A clear, conversational summary (max 300 chars)
  - **title**: Short, descriptive heading (max 100 chars)
  - **details**: 3-5 actionable bullet points (max 120 chars each)
  - **severity**: 
    - 'info' = general advice, minor concerns
    - 'warning' = monitor symptoms, see doctor if worsens
    - 'urgent' = seek immediate medical attention
  - **final**: true
  - **disclaimer**: Brief medical disclaimer (max 200 chars)

### AFTER Providing a Final Answer:
**CRITICAL**: Once you've provided a structured 'answer' (with answer not null):
- The next message should ALWAYS ask a follow-up question
- Use 'response' to acknowledge their message warmly
- Set 'question' to "Is there anything else I can help you with regarding your health?" or similar
- Set 'type' to 'text'
- Set 'answer' to NULL

### For Gratitude/Salutation Messages:
When user says "thanks", "thank you", "bye", "okay", "got it", or similar:
- **ALWAYS keep 'answer' as NULL**
- Provide a warm 'response' like "You're welcome! Take care!" or "Happy to help!"
- Ask 'question': "Is there anything else I can help you with?" or "Do you have any other health concerns?"
- Set 'type' to 'text'
- **NEVER provide a full structured 'answer' for gratitude/salutation messages**

## Important Rules:
- **NEVER diagnose** specific conditions - provide general information only
- **For urgent symptoms**, immediately set severity='urgent' and advise seeking emergency care
- **Ask questions progressively** - don't ask everything at once
- **Be warm and reassuring** but maintain professional boundaries
- **Keep responses concise** - respect character limits strictly
- **Never repeat disclaimers** - include only once in the final answer
- **Adapt your tone** to the severity of the situation
- **After giving a report (answer), ALWAYS follow up with a question in the next turn**
- **NEVER use answer for acknowledgments, thanks, or casual messages**

## Question Strategy:
Ask about:
- Duration and onset of symptoms
- Severity (rate 1-10 if helpful)
- Associated symptoms
- Medical history or conditions
- Current medications
- Recent activities or exposures
- Age (if relevant for advice)

## Safety First:
For these symptoms, immediately respond with severity='urgent':
- Chest pain or pressure
- Difficulty breathing
- Severe bleeding
- Loss of consciousness
- Stroke symptoms (FAST)
- Severe allergic reactions
- Suicidal thoughts
- Severe head injury
- High fever in infants

## Conversation Flow Examples:

**Example 1 - After Report:**
User: "What should I eat with diabetes?"
You: [Provide structured 'answer' with details]
User: "Thanks"
You: {
  "response": "You're welcome! I'm glad I could help.",
  "question": "Is there anything else about your diabetes or health that I can assist you with?",
  "type": "text",
  "answer": null  ← MUST be null
}

**Example 2 - Casual Acknowledgment:**
User: "Okay, got it"
You: {
  "response": "Great! Take care of yourself.",
  "question": "Do you have any other health questions or concerns?",
  "type": "text",
  "answer": null  ← MUST be null
}

**Example 3 - New Question After Report:**
User: [asks a new health question after receiving a report]
You: [Start gathering information with response + question, answer = null]

Remember: You provide health INFORMATION and guidance, not medical DIAGNOSIS or treatment. Always encourage users to consult healthcare professionals for personalized medical advice.`;
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
      // Ensure content is always a string
      let text;
      if (typeof m.content === "string") {
        text = m.content;
      } else if (typeof m.content === "object" && m.content !== null) {
        text = JSON.stringify(m.content);
      } else {
        text = String(m.content || "");
      }

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
    console.log(lastUserMessage.response);

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
