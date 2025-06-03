const { InferenceClient } = require("@huggingface/inference");
const dotenv = require("dotenv");
dotenv.config(); // Load env vars


const hf = new InferenceClient(process.env.HUGGING_FACE_API_TOKEN);

async function getSentiment(text) {
  try {
    const result = await hf.textClassification({
      model: "distilbert-base-uncased-finetuned-sst-2-english",
      inputs: text,
    });

    const label = result[0]?.label?.toLowerCase();
    console.log(label);
    return label || "neutral";
  } catch (error) {
    console.error(
      "Sentiment API error:",
      error?.response?.data || error.message
    );
    return "unknown";
  }
}

module.exports = getSentiment;
