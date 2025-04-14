import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.error("REACT_APP_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  }
});

// Initialize a single chat session that persists
const chatSession = model.startChat({
  history: [
    {
      role: "user",
      parts: [{
        text: "You are the mind behind a new AI powered version of Little Alchemy, a popular puzzle game. In this game, players combine various elements to create new items. Your input will be 2 items separated by a comma. You will output an item that you think best represents the combination of the 2 inputs, followed by an emoji that you think best fits the results. For example: input = mud,fire | output= brick🧱"
      }]
    }
  ],
});

async function run(prompt) {
  try {
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    console.log("Starting Gemini API call with prompt:", prompt);
    console.log("API Key present:", !!apiKey);

    console.log("Chat session sending message...");
    const result = await chatSession.sendMessage([{ text: prompt }]);
    console.log("Message sent, getting response...");
    
    if (!result) {
      throw new Error("No response received from Gemini");
    }

    const response = await result.response.text();
    console.log("Raw Gemini Response:", response);

    if (!response) {
      throw new Error("Empty response from Gemini");
    }

    return response;
  } catch (error) {
    console.error("Detailed error in Gemini API call:", {
      message: error.message,
      stack: error.stack,
      prompt: prompt,
      apiKeyExists: !!apiKey
    });
    throw error;
  }
}

export default run;