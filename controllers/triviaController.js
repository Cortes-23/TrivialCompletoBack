// controllers/triviaController.js
import { Configuration, OpenAIApi } from 'openai';
import Question from '../models/Question.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateQuestion = async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: "Se requiere una categoría." });
  }

  try {
    const prompt = `Crea una pregunta de trivia en la categoría "${category}" con 5 opciones y una respuesta correcta. Devuélvela en este formato JSON:
{
  "question": "¿Cuál es ...?",
  "options": ["opción1", "opción2", "opción3", "opción4", "opción5"],
  "correctAnswer": "opción3"
}`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.data.choices[0].message.content.trim();
    const parsed = JSON.parse(content);

    const newQuestion = new Question({
      category,
      question: parsed.question,
      options: parsed.options,
      correctAnswer: parsed.correctAnswer,
    });

    await newQuestion.save();
    res.json(newQuestion);

  } catch (error) {
    console.error("❌ Error generando pregunta:", error.message);
    res.status(500).json({ error: "Error al generar la pregunta", detail: error.message });
  }
};
