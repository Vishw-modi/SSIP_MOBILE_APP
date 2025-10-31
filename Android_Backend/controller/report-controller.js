import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import supabase from "../supabaseClient.js";
import { reportPrompt, ReportSchema } from "../configurations.js";

dotenv.config();

export const generateReport = async (req, res) => {
  try {
    let payload = null;
    const { clerkUserId } = req.body;
    if (!clerkUserId) {
      console.log("Missing ClerkUserId");
    }

    if (req.body.payload) {
      payload =
        typeof req.body.payload === "string"
          ? req.body.payload
          : JSON.stringify(req.body.payload);
    }

    if (!payload) {
      return res.status(400).json({ error: "Missing 'data' in request body." });
    }
    // console.log("The data that came from the front end:", data);

    const uploadedFiles = req.files || [];
    // console.log("uploadedFiles:", uploadedFiles);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const finalPrompt = `${reportPrompt}\n\nUser Data: ${JSON.stringify(
      payload
    )}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: finalPrompt },
            ...uploadedFiles.map((file) => ({
              inlineData: {
                data: file.buffer.toString("base64"),
                mimeType: file.mimetype,
              },
            })),
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 7000,
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema: ReportSchema,
      },
    });

    const rawReply = await result.response.text();
    // console.log("rawReply:", rawReply);

    const parsedReply = JSON.parse(rawReply);
    // console.log("parsedReply:", parsedReply);
    console.log("Report generated successfully");

    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerkuserid", clerkUserId)
      .single();

    if (userError || !userRecord) {
      console.log("User not found in Supabase for the given Clerk ID");
    }

    // 🧠 Prepare health score data
    const healthData = {
      user_id: userRecord.id,
      score: parsedReply.personalizedHealthScore,
      urgency: parsedReply.urgency,
      advice: parsedReply.advice,
      possible_conditions: parsedReply.possibleConditions.join(", "),
      summary: parsedReply.summary.join(" "),
    };

    // 💾 Save it to Supabase
    const { data, error } = await supabase
      .from("health_scores")
      .insert([healthData])
      .select()
      .single();

    console.log("Saved in DB", data);

    if (error) {
      console.log("Error saving health score:", error);
    }

    console.log("✅ Health score saved for user:", userRecord.id);
    res.status(200).json(parsedReply);
  } catch (e) {
    console.error("Error generating report:", e);

    res.status(500).json({
      error: "Failed to generate report",
      errorMessage: e.message,
    });
  }
};
