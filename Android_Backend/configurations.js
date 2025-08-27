export const systemPrompt = `
You are a medical assistant AI for a health diagnosis chat app.  
Your task is to respond ONLY in the following strict JSON format.  

Output ONLY a JSON object with no extra text, no markdown, no explanations, no code fences.  

Rules:  
1. ASK AT LEAST 4 QUESTIONS NO MATTER WHAT FOR BETTER DIAGNOSIS.  
2. If the user's message is NOT related to health, mental health, weight loss, health diets, or any medical topic, you may respond to greetings or day-to-day/life related questions normally in a friendly tone inside "response", but keep "question" and "type" as null.  
3. If the non-health message is not a greeting or casual life question, respond with:  
    {  
        "response": "Sorry, please ask only health-related questions.",  
        "question": null,  
        "type": null  
    }  
4. The "response" should be clear, empathetic, and medically relevant if it's health-related.  
5. The "question" should be only ONE at a time, designed to gather more info for medical assessment.  
6. Choose "type" according to the question format:  
    - "text" for open-ended questions  
    - "yes/no" for binary choice questions  
    - "4options" ONLY if it can naturally be answered with:  
      "Strongly Agree", "Agree", "Disagree", "Strongly Disagree"  
7. If there are no more questions to ask:  
    - Set "question" to null and "type" to null  
    - Provide a final, satisfying summary or advice in "response".  

`;

export const ResponseSchema = {
  type: "OBJECT",
  properties: {
    response: {
      type: "STRING",
      description:
        "A normal conversational reply to the user about their health input.",
    },
    question: {
      type: "STRING",
      description:
        "One follow-up question related to the user's health to gather more info, or null if no further questions are needed.",
      nullable: true,
    },
    type: {
      type: "STRING",
      description:
        "The question type: 'text' | 'yes/no' | '4options', or null if no further questions.",
      enum: ["text", "yes/no", "4options", "null"],
      nullable: true,
    },
  },
  // Ensure the properties are in the correct order in the response
  propertyOrdering: ["response", "question", "type"],
  required: ["response"],
};
export const reportPrompt = `
You are an AI health assistant that analyzes a user's symptoms and produces a structured medical advisory report in JSON format.

### Output Requirements:
- Your response **must strictly follow the JSON structure defined in ReportSchema** below.
- Only output valid JSON. Do not include explanations, markdown, or extra text outside the JSON.
- Fill all required fields with meaningful, contextually appropriate data.
- If some optional fields (e.g., 'possibleDiseases', 'ayurvedicMedications', 'reportInsights') are not applicable, return an empty array or an empty string.
- Each string should be **clear, concise, and user-friendly** (avoid medical jargon unless necessary).
- Advice must be supportive, encouraging the user to consult a healthcare professional where relevant.

---

### Special Focus: Personalized Health Score
- The **personalizedHealthScore (1–100)** is one of the most important fields.
- It must be **realistically calculated** based on:
  1. Severity of the user's reported symptoms.
  2. Presence of lifestyle or health-related risk factors.
  3. Urgency level of the condition (Low → higher score, High → lower score).
  4. Insights from any uploaded health report.
- Interpret the score as follows:
  - **80–100** → Generally healthy / mild issues.
  - **60–79** → Moderate issues / manageable with lifestyle changes.
  - **40–59** → Significant health concerns, medical attention advisable.
  - **1–39** → Severe condition, urgent medical care recommended.
- Ensure the score **matches the overall advice and urgency**.  
- Do not give unrealistically high or low scores without context.

---

### ReportSchema Definition:
{
  "possibleConditions": "ARRAY of possible health conditions related to the symptoms.",
  "possibleDiseases": "ARRAY of diseases possibly associated with symptoms (may overlap with conditions).",
  "advice": "STRING - personalized health advice based on symptoms and report submitted if any.",
  "urgency": "STRING - must be one of: Low, Moderate, High.",
  "riskFactors": "ARRAY of lifestyle or health-related risk factors.",
  "doList": "ARRAY of positive actions user should take.",
  "dontList": "ARRAY of actions user should avoid.",
  "recommendedNextSteps": "ARRAY of concrete next steps (doctor visits, tests, tracking symptoms).",
  "preventiveMeasures": "ARRAY of preventive measures to avoid recurrence or worsening.",
  "dietRecommendations": {
    "breakfast": "ARRAY of recommended breakfast options.",
    "lunch": "ARRAY of recommended lunch options.",
    "dinner": "ARRAY of recommended dinner options.",
    "snacks": "ARRAY of healthy snack options."
  },
  "exercisePlan": "ARRAY of recommended exercises, with duration & frequency.",
  "ayurvedicMedications": "ARRAY of optional herbal remedies (if applicable)(if not provide basic ayurvedic medications).",
  "followUpActions": "ARRAY of follow-up actions (doctor check-ins, monitoring).",
  "personalizedHealthScore": "NUMBER between 1 and 100, representing the overall healthiness of the user's current condition, lifestyle, and submitted report.",
  "reportInsights": "STRING - additional insights or recommendations based only on the user's submitted report."
}

---

### Instructions:
1. Use the user's reported **symptoms, lifestyle, and risk factors** to populate the report.
2. Keep 'possibleConditions' broader (e.g., Migraine, Sinusitis) and 'possibleDiseases' more specific (e.g., Chronic Migraine, Acute Sinus Infection).
3. Always provide at least **3 recommendations** in diet, exercise, and preventive measures.
4. Urgency must reflect severity (example: chest pain → High, mild headache → Low).
5. Ensure "reportInsights" summarizes additional insights derived solely from the user's submitted report.
6. Do not include contradictory advice.
7. Pay **special attention** to "personalizedHealthScore": it must be aligned with urgency, risks, and lifestyle.
8. Fill all required fields; use empty arrays or empty strings for optional fields if not applicable.
`;

export const ReportSchema = {
  type: "OBJECT",
  properties: {
    possibleConditions: {
      type: "ARRAY",
      description:
        "List of possible health conditions related to the provided symptoms.",
      items: { type: "STRING" },
    },
    possibleDiseases: {
      type: "ARRAY",
      description:
        "List of diseases that may be associated with the given symptoms.",
      items: { type: "STRING" },
    },
    advice: {
      type: "STRING",
      description:
        "Clear, concise health advice based on the user's provided symptoms and information and also based on the report submitted by the user if any.",
    },
    urgency: {
      type: "STRING",
      description:
        "Urgency of the condition: Low, Moderate, High. This helps the user understand if immediate action is needed.",
      enum: ["Low", "Moderate", "High"],
    },
    riskFactors: {
      type: "ARRAY",
      description:
        "Risk factors associated with the user's condition, lifestyle, or symptoms.",
      items: { type: "STRING" },
    },
    doList: {
      type: "ARRAY",
      description:
        "Recommended actions or habits that the user should follow to improve their condition.",
      items: { type: "STRING" },
    },
    dontList: {
      type: "ARRAY",
      description:
        "Actions, foods, or habits that the user should avoid to prevent worsening of condition.",
      items: { type: "STRING" },
    },
    recommendedNextSteps: {
      type: "ARRAY",
      description:
        "List of recommended next medical actions or health checks for the user.",
      items: { type: "STRING" },
    },
    preventiveMeasures: {
      type: "ARRAY",
      description:
        "Preventive lifestyle or medical measures to avoid progression of condition or recurrence.",
      items: { type: "STRING" },
    },
    dietRecommendations: {
      type: "OBJECT",
      description:
        "Specific diet recommendations structured into meals for clarity.",
      properties: {
        breakfast: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Recommended breakfast options.",
        },
        lunch: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Recommended lunch options.",
        },
        dinner: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Recommended dinner options.",
        },
        snacks: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Healthy snack recommendations.",
        },
      },
      required: ["breakfast", "lunch", "dinner"],
    },
    exercisePlan: {
      type: "ARRAY",
      description:
        "List of suggested exercises, including type, duration, and frequency, suitable for the user's condition or health goal.",
      items: { type: "STRING" },
    },
    ayurvedicMedications: {
      type: "ARRAY",
      description:
        "List of suggested Ayurvedic or herbal remedies that may complement the user's condition.",
      items: { type: "STRING" },
    },
    followUpActions: {
      type: "ARRAY",
      description:
        "Recommended follow-up actions, such as doctor visits, lab tests, or regular monitoring.",
      items: { type: "STRING" },
    },
    personalizedHealthScore: {
      type: "NUMBER",
      description:
        "Personalized health score between 1 and 100, reflecting the overall healthiness of the user's condition and lifestyle and the report submited by the user if submitted.",
      minimum: 1,
      maximum: 100,
    },
    reportInsights: {
      type: "ARRAY",
      description:
        "Additional insights or recommendations based on the report submited by the user not the other data of the user",
      items: { type: "STRING" },
    },
  },
  required: [
    "possibleConditions",
    "advice",
    "urgency",
    "recommendedNextSteps",
    "dietRecommendations",
    "exercisePlan",
    "personalizedHealthScore",
  ],
  propertyOrdering: [
    "possibleConditions",
    "possibleDiseases",
    "advice",
    "urgency",
    "riskFactors",
    "doList",
    "dontList",
    "recommendedNextSteps",
    "preventiveMeasures",
    "dietRecommendations",
    "exercisePlan",
    "ayurvedicMedications",
    "followUpActions",
    "personalizedHealthScore",
    "reportInsights",
  ],
};

export const nutritionPrompt = `
You are a professional AI nutrition assistant.  
The user will upload an image of food, and your task is to analyze it and return a structured JSON strictly following the given schema.  

Rules:  
1. Accurately identify the type of food in the image.  
2. Estimate the total calories and provide a per-serving breakdown if possible.  
3. Provide macronutrient details: protein, carbohydrates, fats.  
4. Include important micronutrients where relevant (fiber, sugar, sodium, vitamins, etc.).  
5. Provide a brief health assessment of the food (is it balanced, high in sugar, high in protein, etc.).  
6. Suggest healthier alternatives or modifications if the food is unhealthy.  
7. Always return results in JSON only, with no extra text or explanation.  
8. Ensure values are safe estimates — never claim 100% accuracy.  

If the image is not food-related, return:  
{
  "foodName": null,
  "calories": null,
  "macronutrients": null,
  "micronutrients": null,
  "healthAssessment": "Sorry, please upload a clear food image for analysis.",
  "suggestions": []
}
`;

export const NutritionSchema = {
  type: "OBJECT",
  properties: {
    foodName: {
      type: "STRING",
      description: "The identified food or dish name from the image.",
      nullable: true,
    },
    calories: {
      type: "NUMBER",
      description: "Estimated total calories of the food portion in kcal.",
      nullable: true,
    },
    macronutrients: {
      type: "OBJECT",
      description: "Estimated macronutrient breakdown of the food.",
      properties: {
        protein: { type: "NUMBER", description: "Protein in grams." },
        carbohydrates: {
          type: "NUMBER",
          description: "Carbohydrates in grams.",
        },
        fat: { type: "NUMBER", description: "Fat in grams." },
      },
      required: ["protein", "carbohydrates", "fat"],
      nullable: true,
    },
    micronutrients: {
      type: "OBJECT",
      description: "Key micronutrients if identifiable.",
      properties: {
        fiber: {
          type: "NUMBER",
          description: "Fiber in grams.",
          nullable: true,
        },
        sugar: {
          type: "NUMBER",
          description: "Sugar in grams.",
          nullable: true,
        },
        sodium: {
          type: "NUMBER",
          description: "Sodium in milligrams.",
          nullable: true,
        },
        vitamins: {
          type: "ARRAY",
          description: "List of notable vitamins found in the food.",
          items: { type: "STRING" },
          nullable: true,
        },
        iron: {
          type: "NUMBER",
          description: "Iron in milligrams.",
          nullable: true,
        },
        calcium: {
          type: "NUMBER",
          description: "Calcium in milligrams.",
          nullable: true,
        },
        phosphorus: {
          type: "NUMBER",
          description: "Phosphorus in milligrams.",
          nullable: true,
        },
        potassium: {
          type: "NUMBER",
          description: "Potassium in milligrams.",
          nullable: true,
        },
      },
      nullable: true,
    },
    healthAssessment: {
      type: "STRING",
      description: "Brief assessment of how healthy or balanced the food is.",
    },
    suggestions: {
      type: "ARRAY",
      description: "Healthier alternatives or modifications.",
      items: { type: "STRING" },
    },
  },
  required: [
    "foodName",
    "calories",
    "macronutrients",
    "micronutrients",
    "healthAssessment",
    "suggestions",
  ],
  propertyOrdering: [
    "foodName",
    "calories",
    "macronutrients",
    "micronutrients",
    "healthAssessment",
    "suggestions",
  ],
};
