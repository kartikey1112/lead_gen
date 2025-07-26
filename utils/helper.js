const { GoogleGenerativeAI } = require("@google/generative-ai");
const  twilio = require("twilio");

async function processWithGeminiAI(user_message) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log(model);
  const prompt = `
  You are an AI assistant for a trip planner lead management system.
  Given the following user message, extract:
  - intent (one of: book-now, price-check, general)
  - score (one of: hot, warm, cold)
  - tags (a list of keywords, e.g. ["goa", "pool", "weekend"])
  
  User message: "${user_message}"
  
  Respond in JSON format:
  {
    "ai_detected_intent": "...",
    "score": "...",
    "tags": [...]
  }
  `;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonString);
    return data;
  } catch (err) {
    console.error("Gemini response parsing failed, using fallback:", err);
    return {
      ai_detected_intent: "general",
      score: "cold",
      tags: [],
    };
  }
}

async function sendWhatsappMessage(phone, name) {
  const from = process.env.VONAGE_WHATSAPP_NUMBER;
  const text = `Thanks for your interest, ${name}! We'll get back to you soon.`;

  try {
    const response = await fetch(process.env.VONAGE_API_URL, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.VONAGE_API_KEY}:${process.env.VONAGE_API_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from,
        to: `91${phone}`,
        message_type: "text",
        text,
        channel: "whatsapp",
      }),
    });

    const data = await response.json();
    console.log("Message sent:", data);
    return data;
  } catch (err) {
    console.error("Error sending WhatsApp message:", err);
    throw err;
  }
}

async function makeVoiceCall(phone) {
  const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );


  client.calls
    .create({
      url: process.env.TWILIO_API_URL,
      to: `+91${phone}`,
      from: process.env.TWILIO_PHONE_NUMBER,
    })
    .then((call) => console.log("✅ Call SID:", call.sid))
    .catch((err) => console.error("❌ Error making call:", err));
}

module.exports = { processWithGeminiAI, sendWhatsappMessage, makeVoiceCall };
