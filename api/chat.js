const OpenAI = require("openai");

module.exports = async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // leer correctamente el body
    const { message, name } = req.body || {};

    // fallback por si viene vacío
    const userMessage = message || "Decime hola";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sos el Asistente Estratégico Ejecutivo de Martín Xavier Urtasun Rubio. Respondé de forma profesional y estratégica.",
        },
        {
          role: "user",
          content: `Visitante: ${name || "Visitante"}\nPregunta: ${userMessage}`,
        },
      ],
      max_tokens: 300,
    });

    const reply =
      completion &&
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      completion.choices[0].message.content
        ? completion.choices[0].message.content
        : "No se pudo generar respuesta.";

    return res.status(200).json({
      reply: reply,
    });
  } catch (error) {
    console.error("ERROR OPENAI:", error);

    return res.status(200).json({
      reply: "Error interno, pero el servidor funciona.",
    });
  }
};
