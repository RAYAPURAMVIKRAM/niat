const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;
if (apiKey && !apiKey.includes('placeholder')) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('⚠️ Could not initialize GoogleGenerativeAI:', err.message);
  }
}

/**
 * Returns a generative model with fallback candidates
 */
const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = {
  genAI,
  getGeminiModel,
};
